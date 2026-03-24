"""Persistence normalization helpers."""

from typing import Dict, List


def normalize_document_result(result: Dict) -> Dict:
    sentences: List[Dict] = list(result.get("sentences", []))
    chunks: List[Dict] = list(result.get("chunks", []))
    annotations: List[Dict] = list(result.get("annotations", []))
    vocabulary: List[Dict] = list(result.get("vocabulary", []))

    return {
        "sentences": sentences,
        "chunks": chunks,
        "annotations": annotations,
        "vocabulary": vocabulary,
        "processing_state": result.get("processing_state", "draft_ready"),
    }
