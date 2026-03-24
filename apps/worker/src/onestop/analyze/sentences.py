"""Sentence segmentation helpers."""

import re
from typing import List


def split_text_into_sentences(text: str) -> List[str]:
    normalized = " ".join(text.split())
    if not normalized:
        return []

    parts = re.split(r"(?<=[.!?])\s+", normalized)
    return [part.strip() for part in parts if part.strip()]
