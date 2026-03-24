"""PDF extraction helpers."""

from pathlib import Path


def extract_pdf_text(path: str) -> dict:
    file_path = Path(path)
    return {
        "source_path": str(file_path),
        "file_type": "pdf",
        "text": file_path.read_text(encoding="utf-8") if file_path.exists() else "",
        "ocr_used": False,
    }
