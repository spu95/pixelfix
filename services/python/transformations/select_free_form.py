from typing import Optional
from ultralytics import YOLO
import cv2
from cv2.typing import MatLike
import numpy as np


def select_free_form(image_mat: MatLike, image_type) -> Optional[MatLike]:
    """
    Extrahiert ein Möbelstück aus einem Bild.

    Args:
        image_path (str): Pfad zum Eingabebild
        furniture_type (str): Möbeltyp ('chair', 'couch', 'bed', 'dining table')

    Returns:
        np.array oder None: Ausgeschnittenes Möbelstück mit Transparenz oder None
    """
    # Mapping der unterstützten Möbeltypen
    supported_image_types = {
        "chair": 56,
        "couch": 57,
        "bed": 59,
        "dining table": 60,
        "table": 60,  # Alias
        "sofa": 57,  # Alias
    }

    # Prüfen ob Möbeltyp unterstützt wird
    # image_type = image_type.lower()
    # if image_type not in supported_image_types:
    #     print(
    #         f"Möbeltyp '{image_type}' nicht unterstützt. Verfügbar: {list(supported_image_types.keys())}"
    #     )
    #     return None

    # YOLOv8 Modell laden (beim ersten Mal wird es automatisch heruntergeladen)
    model = YOLO("./models/yolov8x-seg.pt")

    # Bild einlesen
    # image = cv2.imread(image_path)
    # if image is None:
    #     print(f"Konnte Bild nicht laden: {image_path}")
    #     return None

    # Objekterkennung durchführen
    results = model(image_mat, verbose=False)

    # Nach dem gewünschten Möbeltyp suchen
    target_class_id = supported_image_types[image_type]

    for r in results:
        if r.masks is None:
            continue

        for i, cls in enumerate(r.boxes.cls):
            if int(cls) == target_class_id:
                # Möbel gefunden! Maske extrahieren
                mask = r.masks[i].data[0].cpu().numpy()

                # Maske auf Bildgröße resizen
                mask_resized = cv2.resize(
                    mask, (image_mat.shape[1], image_mat.shape[0])
                )

                # Binäre Maske erstellen
                binary_mask = (mask_resized > 0.5).astype(np.uint8)

                # Möbelstück mit Transparenz ausschneiden
                result = np.zeros(
                    (image_mat.shape[0], image_mat.shape[1], 4),
                    dtype=np.uint8,
                )
                result[:, :, :3] = image_mat
                result[:, :, 3] = binary_mask * 255

                # Nur den Bereich mit dem Möbel zurückgeben
                y_indices, x_indices = np.where(binary_mask > 0)
                if len(y_indices) > 0 and len(x_indices) > 0:
                    y_min, y_max = y_indices.min(), y_indices.max()
                    x_min, x_max = x_indices.min(), x_indices.max()

                    return result[y_min : y_max + 1, x_min : x_max + 1]

    # Kein Möbelstück gefunden
    return None


# Verwendungsbeispiel:
if __name__ == "__main__":
    # Möbel extrahieren
    img = cv2.imread("./resources/wohnzimmer.jpeg")

    furniture = select_free_form(img, "couch")

    if furniture is not None:
        # Als PNG mit Transparenz speichern
        cv2.imwrite("extrahiertes_sofa.png", furniture)
        print("Möbel erfolgreich extrahiert!")
    else:
        print("Kein Möbel gefunden.")
