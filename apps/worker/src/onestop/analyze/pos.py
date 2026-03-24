"""POS tagging helpers."""

import re
from typing import Dict, List


VERB_LEXICON = {
    "am",
    "is",
    "are",
    "was",
    "were",
    "be",
    "being",
    "been",
    "do",
    "does",
    "did",
    "have",
    "has",
    "had",
    "shape",
    "shapes",
    "act",
    "acts",
    "remember",
    "remembers",
}


def _clean_token(token: str) -> str:
    return re.sub(r"^[^\w]+|[^\w]+$", "", token).lower()


def infer_pos(token: str) -> str:
    cleaned = _clean_token(token)
    if not cleaned:
        return "PUNCT"
    if cleaned in {"the", "a", "an"}:
        return "DET"
    if cleaned in {"in", "on", "at", "of", "to", "for", "with", "by"}:
        return "ADP"
    if cleaned in {"and", "but", "or"}:
        return "CCONJ"
    if cleaned in VERB_LEXICON or cleaned.endswith("ed") or cleaned.endswith("ing"):
        return "VERB"
    if cleaned.endswith("ly"):
        return "ADV"
    if cleaned.endswith(("ous", "ful", "ive", "al")):
        return "ADJ"
    return "NOUN"


def tag_tokens(text: str) -> List[Dict]:
    tokens = text.split()
    tagged = []
    for index, token in enumerate(tokens):
        tagged.append(
            {
                "index": index,
                "text": token,
                "lemma": _clean_token(token),
                "pos": infer_pos(token),
            }
        )
    return tagged
