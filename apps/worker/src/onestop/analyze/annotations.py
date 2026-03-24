"""Annotation draft generation helpers."""

from typing import Dict, List


def _build_grammar_text(syntax_label: str) -> str:
    return f"구문 포인트: {syntax_label}"


def _build_vocab_text(vocab_items: List[Dict]) -> str:
    lemmas = [item["lemma"] for item in vocab_items[:3]]
    return "핵심 어휘: " + ", ".join(lemmas) if lemmas else "핵심 어휘"


def build_annotation_drafts(
    chunk_text: str,
    syntax_label: str,
    vocab_items: List[Dict],
) -> List[Dict]:
    drafts = [
        {
            "id": f"{chunk_text}-grammar",
            "type": "grammar",
            "text": _build_grammar_text(syntax_label),
            "color_family": "red",
            "visible": True,
            "priority": 1,
        },
        {
            "id": f"{chunk_text}-vocab",
            "type": "vocab",
            "text": _build_vocab_text(vocab_items),
            "color_family": "blue",
            "visible": True,
            "priority": 2,
        },
        {
            "id": f"{chunk_text}-decode",
            "type": "decode",
            "text": "DECODE 태그 슬롯",
            "color_family": "decode",
            "visible": False,
            "priority": 3,
        },
    ]
    return drafts
