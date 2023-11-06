from typing import Any

from app.schemas import ModelType

from .base import InferenceModel
from .clip import MCLIPEncoder, OpenCLIPEncoder, is_mclip, is_openclip
from .facial_recognition import FaceRecognizer
from .image_classification import ImageClassifier


def from_model_type(model_type: ModelType, model_name: str, **model_kwargs: Any) -> InferenceModel:
    match model_type:
        case ModelType.CLIP:
            if is_openclip(model_name):
                return OpenCLIPEncoder(model_name, **model_kwargs)
            elif is_mclip(model_name):
                return MCLIPEncoder(model_name, **model_kwargs)
            else:
                raise ValueError(f"Unknown CLIP model {model_name}")
        case ModelType.FACIAL_RECOGNITION:
            return FaceRecognizer(model_name, **model_kwargs)
        case ModelType.IMAGE_CLASSIFICATION:
            return ImageClassifier(model_name, **model_kwargs)
        case _:
            raise ValueError(f"Unknown model type {model_type}")
