"""Collocation candidate extraction helpers."""

from typing import Dict, List


def extract_collocation_candidates(tagged_tokens: List[Dict]) -> List[str]:
    content_tokens = [token["lemma"] for token in tagged_tokens if token["pos"] in {"NOUN", "VERB", "ADJ"}]
    collocations = []

    for index in range(len(content_tokens) - 1):
      pair = f"{content_tokens[index]} {content_tokens[index + 1]}"
      if pair not in collocations:
          collocations.append(pair)

    return collocations
