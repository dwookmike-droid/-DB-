import { readFile } from "node:fs/promises";

import type { AnnotationDraft, ChunkDraft } from "@onestop/contracts";
import type { StoredDocumentRecord } from "./store.ts";

const DB_ROOT =
  process.env.ONESTOP_DB_ROOT ??
  "/Volumes/Developer/mikekangmoltbot-work/Desktop/[DB]모의고사[임시]";

function normalizeText(text: string) {
  return text.replaceAll(/\r\n/g, "\n").replaceAll(/\n{3,}/g, "\n\n").trim();
}

function splitPreviewChunks(text: string) {
  return normalizeText(text)
    .split(/\n{2,}/)
    .map((chunk) => chunk.replaceAll(/\s+/g, " ").trim())
    .filter(Boolean)
    .slice(0, 6);
}

function buildChunkDrafts(documentId: string, chunks: string[]): ChunkDraft[] {
  return chunks.map((text, index) => ({
    id: `${documentId}-chunk-${index + 1}`,
    sentenceId: `${documentId}-sentence-${index + 1}`,
    text,
    startOffset: 0,
    endOffset: text.length,
    syntaxLabel: index === 0 ? "lead" : index === chunks.length - 1 ? "tail" : "body",
    highlightFamily: "decode",
  }));
}

function buildAnnotationDrafts(documentId: string, chunks: ChunkDraft[]): AnnotationDraft[] {
  return chunks.map((chunk, index) => ({
    id: `${documentId}-annotation-${index + 1}`,
    chunkId: chunk.id,
    type: index === 0 ? "grammar" : "decode",
    text:
      index === 0
        ? "원본 파일에서 추출한 미리보기 초안입니다. 이후 문장 분리와 구문 분석으로 세분화됩니다."
        : "원본 파일 기반 preview chunk입니다.",
    colorFamily: index === 0 ? "grammar" : "decode",
    visible: true,
    priority: 1,
  }));
}

function buildSourcePlaceholder(record: StoredDocumentRecord) {
  const extensionLabel =
    record.metadata.fileType === "pdf"
      ? "PDF"
      : record.metadata.fileType === "docx"
        ? "DOCX"
        : "원본";

  const text = `${extensionLabel} 원본 문서 경로: ${record.metadata.sourcePath}`;
  const chunks = buildChunkDrafts(record.id, [text]);

  return {
    chunks,
    annotations: [
      {
        id: `${record.id}-annotation-source`,
        chunkId: chunks[0]!.id,
        type: "decode" as const,
        text: `${extensionLabel} 파서는 아직 웹 런타임에 직접 연결되지 않았습니다. 다음 단계에서 worker 추출기로 넘깁니다.`,
        colorFamily: "decode",
        visible: true,
        priority: 1,
      },
    ],
    processingState: "ready_for_review" as const,
  };
}

export async function hydrateDocumentAnalysis(record: StoredDocumentRecord) {
  if (
    record.metadata.sourcePath.startsWith("/seed/") ||
    !record.metadata.sourcePath.startsWith(DB_ROOT)
  ) {
    return record;
  }

  if (record.metadata.fileType === "md") {
    try {
      const raw = await readFile(record.metadata.sourcePath, "utf8");
      const previewChunks = splitPreviewChunks(raw);

      if (previewChunks.length > 0) {
        const chunks = buildChunkDrafts(record.id, previewChunks);

        return {
          ...record,
          metadata: {
            ...record.metadata,
            processingState: "draft_ready",
          },
          analysis: {
            chunks,
            annotations: buildAnnotationDrafts(record.id, chunks),
          },
        };
      }
    } catch {
      return {
        ...record,
        metadata: {
          ...record.metadata,
          processingState: "failed",
        },
      };
    }
  }

  const placeholder = buildSourcePlaceholder(record);

  return {
    ...record,
    metadata: {
      ...record.metadata,
      processingState: placeholder.processingState,
    },
    analysis: {
      chunks: placeholder.chunks,
      annotations: placeholder.annotations,
    },
  };
}
