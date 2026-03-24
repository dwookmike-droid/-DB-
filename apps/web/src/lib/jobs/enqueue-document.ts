export interface EnqueuedDocumentJob {
  jobName: "process_document";
  documentId: string;
}

export function enqueueDocument(documentId: string): EnqueuedDocumentJob {
  return {
    jobName: "process_document",
    documentId,
  };
}
