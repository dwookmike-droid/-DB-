import { readdir } from "node:fs/promises";
import path from "node:path";
import type { DocumentMetadata } from "@onestop/contracts";

import type { StoredDocumentRecord } from "./store.ts";

const DB_ROOT =
  process.env.ONESTOP_DB_ROOT ??
  "/Volumes/Developer/mikekangmoltbot-work/Desktop/[DB]모의고사[임시]";

const FILE_TYPE_BY_EXTENSION = new Map<string, DocumentMetadata["fileType"]>([
  [".pdf", "pdf"],
  [".docx", "docx"],
  [".md", "md"],
]);

const DOCUMENT_TYPE_BY_FILENAME = new Map<string, DocumentMetadata["documentType"]>([
  ["문제", "question"],
  ["해설", "explanation"],
  ["대본", "transcript"],
]);

function slugify(value: string) {
  return value
    .toLowerCase()
    .replaceAll(/[^a-z0-9가-힣]+/g, "-")
    .replaceAll(/^-+|-+$/g, "")
    .slice(0, 64);
}

function createEmptyAnalysis(documentId: string) {
  return {
    chunks: [
      {
        id: `${documentId}-chunk-1`,
        sentenceId: `${documentId}-sentence-1`,
        text: "DB에서 발견된 원본 문서입니다. 아직 본문 분석은 수행되지 않았습니다.",
        startOffset: 0,
        endOffset: 36,
        syntaxLabel: "placeholder",
        highlightFamily: "none" as const,
      },
    ],
    annotations: [
      {
        id: `${documentId}-annotation-1`,
        chunkId: `${documentId}-chunk-1`,
        type: "decode" as const,
        text: "업로드 또는 분석 실행 후 실제 chunk와 annotation으로 교체됩니다.",
        colorFamily: "decode",
        visible: true,
        priority: 1,
      },
    ],
  };
}

function toStoredRecord(id: string, metadata: DocumentMetadata): StoredDocumentRecord {
  return {
    id,
    metadata,
    analysis: createEmptyAnalysis(id),
    createdAt: new Date(0).toISOString(),
  };
}

export function inferDocumentFromDbPath(
  absolutePath: string,
  rootPath: string = DB_ROOT,
): StoredDocumentRecord | null {
  const relativePath = path.relative(rootPath, absolutePath);
  const parts = relativePath.split(path.sep);

  if (parts.length < 4) {
    return null;
  }

  const [grade, month, yearLabel, filename] = parts;
  const extension = path.extname(filename).toLowerCase();
  const basename = path.basename(filename, extension);
  const fileType = FILE_TYPE_BY_EXTENSION.get(extension);

  if (!fileType) {
    return null;
  }

  const documentType = DOCUMENT_TYPE_BY_FILENAME.get(basename) ?? "unknown";
  const year = Number.parseInt(yearLabel, 10);
  const parsedYear = Number.isNaN(year) ? null : year;
  const id = slugify([grade, month, yearLabel, basename].join("-"));

  return toStoredRecord(id, {
    title: [grade, parsedYear ?? yearLabel, month, basename].join(" "),
    sourcePath: absolutePath,
    fileType,
    documentType,
    grade: grade === "고1" || grade === "고2" || grade === "고3" ? grade : "unknown",
    month,
    year: parsedYear,
    runMode: "review_before_export",
    processingState: "queued",
  });
}

async function collectFiles(rootPath: string): Promise<string[]> {
  const entries = await readdir(rootPath, { withFileTypes: true });
  const paths = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(rootPath, entry.name);
      if (entry.isDirectory()) {
        return collectFiles(entryPath);
      }
      return [entryPath];
    }),
  );

  return paths.flat();
}

export async function scanDbRoot(rootPath: string = DB_ROOT) {
  const files = await collectFiles(rootPath);

  return files
    .map((filePath) => inferDocumentFromDbPath(filePath, rootPath))
    .filter((record): record is StoredDocumentRecord => record !== null)
    .sort((left, right) => left.id.localeCompare(right.id));
}
