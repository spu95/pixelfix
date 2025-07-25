import cv2
from cv2.typing import MatLike
import numpy as np


def transform_image(image: MatLike) -> bytes:
    """
    Transforms the input image into a format suitable for further processing.

    Args:
        image (MatLike): The input image in cv MatLike format.

    Returns:
        bytes: The transformed image in bytes format.
    """
    _, buffer = cv2.imencode(".png", image)

    return buffer.tobytes()
