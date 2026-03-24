"""Queue helpers for worker jobs."""

from typing import Dict, List


_IN_MEMORY_QUEUE: List[Dict] = []


def enqueue_payload(payload: Dict) -> Dict:
    _IN_MEMORY_QUEUE.append(payload)
    return payload


def get_queued_payloads() -> List[Dict]:
    return list(_IN_MEMORY_QUEUE)
