"""Basic syntax labeling helpers."""

from typing import Dict, List


def label_sentence_syntax(tagged_tokens: List[Dict]) -> Dict:
    first_verb = next((token for token in tagged_tokens if token["pos"] == "VERB"), None)
    subject_tokens = []
    predicate_tokens = []

    for token in tagged_tokens:
        if first_verb is None or token["index"] < first_verb["index"]:
            subject_tokens.append(token["text"])
        else:
            predicate_tokens.append(token["text"])

    return {
        "subject": " ".join(subject_tokens).strip(),
        "predicate": " ".join(predicate_tokens).strip(),
        "has_main_verb": first_verb is not None,
        "main_verb": first_verb["lemma"] if first_verb else None,
    }
