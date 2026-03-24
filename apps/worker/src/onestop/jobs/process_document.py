"""Worker job entrypoint for document processing."""

from .queue import enqueue_payload


def build_job_payload(document_id: str) -> dict:
    return {
        "document_id": document_id,
        "job_type": "process_document",
    }


def dispatch_document_job(document_id: str) -> dict:
    payload = build_job_payload(document_id)
    enqueue_payload(payload)
    return payload
