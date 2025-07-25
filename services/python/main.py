import base64
from typing import Union

import cv2
from fastapi import FastAPI, File, Response, UploadFile
import numpy as np
from pydantic import BaseModel

from transformations.select_free_form import select_free_form
from helper import transform_image

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post(
    "/select-free-form",
    responses={200: {"content": {"image/png": {}}}},
    response_class=Response,
)
async def select_free_form_route(file: UploadFile = File(...)):
    contents = await file.read()

    nparr = np.fromstring(contents, np.uint8)

    img_np = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    img = select_free_form(img_np, "sofa")

    img_bytes = transform_image(img)

    return Response(content=img_bytes, media_type="image/png")
