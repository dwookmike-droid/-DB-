"""Chunk generation helpers."""

from typing import Dict, List


def split_sentence_into_chunks(sentence: str) -> List[Dict]:
    tokens = sentence.strip().split()
    if not tokens:
        return []

    if len(tokens) <= 4:
        return [
            {
                "text": sentence.strip(),
                "start_offset": 0,
                "end_offset": len(sentence.strip()),
                "syntax_label": "simple",
            }
        ]

    midpoint = max(2, len(tokens) // 2)
    chunk_texts = [
        " ".join(tokens[:midpoint]),
        " ".join(tokens[midpoint:]),
    ]

    chunks = []
    cursor = 0
    for index, chunk_text in enumerate(chunk_texts):
        start_offset = sentence.find(chunk_text, cursor)
        end_offset = start_offset + len(chunk_text)
        chunks.append(
            {
                "text": chunk_text,
                "start_offset": start_offset,
                "end_offset": end_offset,
                "syntax_label": "lead" if index == 0 else "tail",
            }
        )
        cursor = end_offset

    return chunks
