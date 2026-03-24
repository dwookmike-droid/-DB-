import type { DocumentAction } from "../run-modes/execute-document-mode.ts";

export function resolveNextDocumentUrl(
  nextAction: DocumentAction,
  documentId: string,
) {
  if (nextAction === "store_draft") {
    return "/documents";
  }

  return `/documents/${documentId}`;
}
