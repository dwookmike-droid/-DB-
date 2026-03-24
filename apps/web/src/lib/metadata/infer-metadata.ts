import type {
  DocumentMetadata,
  DocumentType,
  FileType,
  ProcessingState,
  RunMode,
} from "@onestop/contracts";

const DOCUMENT_TYPE_BY_LABEL: Record<string, DocumentType> = {
  문제: "question",
  해설: "explanation",
  대본: "transcript",
};

const FILE_TYPES = new Set<FileType>(["pdf", "docx", "md"]);

function normalizeTitle(parts: string[]) {
  return parts.filter(Boolean).join(" ");
}

export function inferMetadataFromFilename(filename: string): Pick<
  DocumentMetadata,
  "title" | "grade" | "month" | "year" | "fileType" | "documentType"
> {
  const extension = filename.split(".").pop()?.toLowerCase() ?? "pdf";
  const fileType: FileType = FILE_TYPES.has(extension as FileType)
    ? (extension as FileType)
    : "pdf";

  const basename = filename.replace(/\.[^.]+$/, "");
  const gradeMatch = basename.match(/고[123]/);
  const yearMatch = basename.match(/(20\d{2})/);
  const monthMatch = basename.match(/(0?\d{1,2}월(?:_수능)?)/);
  const typeLabel =
    Object.keys(DOCUMENT_TYPE_BY_LABEL).find((label) => basename.includes(label)) ??
    "";

  const grade = (gradeMatch?.[0] as DocumentMetadata["grade"]) ?? "unknown";
  const year = yearMatch ? Number(yearMatch[1]) : null;
  const month = monthMatch?.[1] ?? "unknown";
  const documentType = DOCUMENT_TYPE_BY_LABEL[typeLabel] ?? "unknown";

  return {
    grade,
    year,
    month,
    fileType,
    documentType,
    title: normalizeTitle([grade, year ? String(year) : "", month, typeLabel]),
  };
}

export function buildQueuedDocumentMetadata(
  filename: string,
  sourcePath: string,
  runMode: RunMode = "review_before_export",
): DocumentMetadata {
  const inferred = inferMetadataFromFilename(filename);
  const processingState: ProcessingState = "queued";

  return {
    ...inferred,
    sourcePath,
    runMode,
    processingState,
  };
}
