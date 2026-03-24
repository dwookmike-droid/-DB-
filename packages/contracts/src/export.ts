import type { ChunkDraft, AnnotationDraft, VocabularyDraft } from "./analysis.ts";
import type { RunMode } from "./document.ts";

export interface ExportRequest {
  documentId: string;
  runMode: RunMode;
  presetId?: string;
}

export interface ExportPayload {
  title: string;
  documentId: string;
  chunks: ChunkDraft[];
  annotations: AnnotationDraft[];
  vocabulary: VocabularyDraft[];
}
