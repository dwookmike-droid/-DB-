import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { AnnotationDraft, ChunkDraft, DocumentMetadata } from "@onestop/contracts";

import { scanDbRoot } from "./db-scan.ts";
import { hydrateDocumentAnalysis } from "./hydrate-analysis.ts";
import { mockDocuments, mockEditorChunks } from "../mock-data.ts";

export interface StoredDocumentRecord {
  id: string;
  metadata: DocumentMetadata;
  analysis: {
    chunks: ChunkDraft[];
    annotations: AnnotationDraft[];
  };
  createdAt: string;
}

const RUNTIME_DIRNAME = ".onestop-runtime";
const DOCUMENTS_FILENAME = "documents.json";

function getRuntimeDir() {
  return process.env.ONESTOP_RUNTIME_DIR ?? path.join(process.cwd(), RUNTIME_DIRNAME);
}

function getDocumentsFilePath() {
  return path.join(getRuntimeDir(), DOCUMENTS_FILENAME);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replaceAll(/[^a-z0-9가-힣]+/g, "-")
    .replaceAll(/^-+|-+$/g, "")
    .slice(0, 48);
}

function createSeedChunks(documentId: string): ChunkDraft[] {
  return mockEditorChunks.map((chunk, index) => ({
    id: `${documentId}-chunk-${index + 1}`,
    sentenceId: `${documentId}-sentence-${index + 1}`,
    text: chunk.text,
    startOffset: 0,
    endOffset: chunk.text.length,
    syntaxLabel: index === 0 ? "lead" : index === mockEditorChunks.length - 1 ? "tail" : "body",
    highlightFamily: index === 0 ? "grammar" : index === 1 ? "vocab" : "decode",
  }));
}

function createSeedAnnotations(documentId: string, chunks: ChunkDraft[]): AnnotationDraft[] {
  return mockEditorChunks.flatMap((chunk, chunkIndex) =>
    chunk.annotations.map((annotation, annotationIndex) => ({
      id: `${documentId}-${annotation.id}`,
      chunkId: chunks[chunkIndex]?.id ?? `${documentId}-chunk-${chunkIndex + 1}`,
      type: annotation.type,
      text: annotation.text,
      colorFamily: annotation.type,
      visible: true,
      priority: annotationIndex + 1,
    })),
  );
}

function buildSeedRecords(): StoredDocumentRecord[] {
  return mockDocuments.map((document) => {
    const chunks = createSeedChunks(document.id);

    return {
      id: document.id,
      metadata: {
        title: document.title,
        sourcePath: `/seed/${document.id}.pdf`,
        fileType: "pdf",
        documentType: "question",
        grade: "고2",
        month: "9월",
        year: 2025,
        runMode: document.runMode,
        processingState: document.processingState as DocumentMetadata["processingState"],
      },
      analysis: {
        chunks,
        annotations: createSeedAnnotations(document.id, chunks),
      },
      createdAt: "2026-03-24T00:00:00.000Z",
    };
  });
}

async function ensureRuntimeFile() {
  const runtimeDir = getRuntimeDir();
  const filePath = getDocumentsFilePath();

  await mkdir(runtimeDir, { recursive: true });

  try {
    await readFile(filePath, "utf8");
  } catch {
    await writeFile(filePath, "[]", "utf8");
  }

  return filePath;
}

async function readStoredRecords() {
  const filePath = await ensureRuntimeFile();
  const raw = await readFile(filePath, "utf8");

  if (!raw.trim()) {
    return [];
  }

  return JSON.parse(raw) as StoredDocumentRecord[];
}

async function writeStoredRecords(records: StoredDocumentRecord[]) {
  const filePath = await ensureRuntimeFile();
  await writeFile(filePath, JSON.stringify(records, null, 2), "utf8");
}

function buildRecordId(metadata: DocumentMetadata) {
  const base = [metadata.grade, metadata.year ?? "unknown", metadata.month, metadata.documentType]
    .filter(Boolean)
    .join("-");

  return slugify(base || metadata.title || "document");
}

export async function createDocumentRecord(metadata: DocumentMetadata) {
  const storedRecords = await readStoredRecords();
  const idBase = buildRecordId(metadata);
  const duplicateCount = storedRecords.filter((record) => record.id.startsWith(idBase)).length;
  const id = duplicateCount === 0 ? idBase : `${idBase}-${duplicateCount + 1}`;
  const chunks = createSeedChunks(id);

  const record: StoredDocumentRecord = {
    id,
    metadata,
    analysis: {
      chunks,
      annotations: createSeedAnnotations(id, chunks),
    },
    createdAt: new Date().toISOString(),
  };

  storedRecords.push(record);
  await writeStoredRecords(storedRecords);

  return record;
}

export async function listDocumentRecords() {
  const storedRecords = await readStoredRecords();
  const dbRecords = await scanDbRoot().catch(() => []);
  return [...buildSeedRecords(), ...dbRecords, ...storedRecords];
}

export async function getDocumentRecord(documentId: string) {
  const records = await listDocumentRecords();
  const record = records.find((candidate) => candidate.id === documentId) ?? null;

  if (!record) {
    return null;
  }

  return hydrateDocumentAnalysis(record);
}
