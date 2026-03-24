export type AnnotationType = "grammar" | "vocab" | "decode";

export type DecodeRoleColor =
  | "core_blue"
  | "paraphrase_green"
  | "evidence_yellow"
  | "contrast_red"
  | "transition_orange";

export interface ChunkDraft {
  id: string;
  sentenceId: string;
  text: string;
  startOffset: number;
  endOffset: number;
  syntaxLabel: string;
  highlightFamily: AnnotationType | "none";
}

export interface AnnotationDraft {
  id: string;
  chunkId: string;
  type: AnnotationType;
  text: string;
  colorFamily: string;
  visible: boolean;
  priority: number;
}

export interface VocabularyDraft {
  lemma: string;
  surfaceForm: string;
  pos: string;
  meaningCandidates: string[];
  collocationCandidates: string[];
  importance: number;
}
