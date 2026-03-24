"""DOCX extraction helpers."""

from pathlib import Path


def extract_docx_text(path: str) -> dict:
    file_path = Path(path)
    return {
        "source_path": str(file_path),
        "file_type": "docx",
        "text": file_path.read_text(encoding="utf-8") if file_path.exists() else "",
    }
