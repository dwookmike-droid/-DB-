export type FileType = "pdf" | "docx" | "md";

export type DocumentType =
  | "question"
  | "explanation"
  | "transcript"
  | "audio"
  | "supplement"
  | "unknown";

export type RunMode =
  | "draft_only"
  | "review_before_export"
  | "immediate_export";

export type ProcessingState =
  | "queued"
  | "extracting"
  | "analyzing"
  | "draft_ready"
  | "ready_for_review"
  | "exported"
  | "failed";

export interface DocumentMetadata {
  title: string;
  sourcePath: string;
  fileType: FileType;
  documentType: DocumentType;
  grade: "고1" | "고2" | "고3" | "unknown";
  month: string;
  year: number | null;
  runMode: RunMode;
  processingState: ProcessingState;
}
