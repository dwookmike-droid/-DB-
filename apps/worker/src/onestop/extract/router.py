"""Extractor router."""

from .docx import extract_docx_text
from .md import extract_md_text
from .pdf import extract_pdf_text


def get_extractor(file_type: str):
    if file_type == "pdf":
        return extract_pdf_text
    if file_type == "docx":
        return extract_docx_text
    if file_type == "md":
        return extract_md_text
    raise ValueError(f"Unsupported file type: {file_type}")
