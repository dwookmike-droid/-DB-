"""Vocabulary candidate extraction helpers."""

from typing import Dict, List

from .collocations import extract_collocation_candidates
from .pos import tag_tokens


def _normalize_lemma(token: Dict) -> str:
    lemma = token["lemma"]
    if token["pos"] == "VERB" and lemma.endswith("s") and len(lemma) > 3:
        return lemma[:-1]
    return lemma


def extract_vocabulary_candidates(text: str) -> List[Dict]:
    tagged_tokens = tag_tokens(text)
    collocations = extract_collocation_candidates(tagged_tokens)
    content_words = []

    for token in tagged_tokens:
        if token["pos"] not in {"NOUN", "VERB", "ADJ"}:
            continue

        lemma = _normalize_lemma(token)
        item = {
            "lemma": lemma,
            "surface_form": token["text"],
            "pos": token["pos"],
            "meaning_candidates": [],
            "collocation_candidates": [c for c in collocations if lemma in c.split()],
            "importance": 1,
        }

        if not any(existing["lemma"] == item["lemma"] for existing in content_words):
            content_words.append(item)

    return content_words
