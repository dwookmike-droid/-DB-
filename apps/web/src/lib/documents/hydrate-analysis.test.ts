import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import { mkdtemp, rm, writeFile } from "node:fs/promises";

import { hydrateDocumentAnalysis } from "./hydrate-analysis.ts";
import type { StoredDocumentRecord } from "./store.ts";

function createRecord(sourcePath: string, fileType: "pdf" | "docx" | "md"): StoredDocumentRecord {
  return {
    id: "db-doc-1",
    metadata: {
      title: "고2 2025 9월 문제",
      sourcePath,
      fileType,
      documentType: "question",
      grade: "고2",
      month: "9월",
      year: 2025,
      runMode: "review_before_export",
      processingState: "queued",
    },
    analysis: {
      chunks: [
        {
          id: "db-doc-1-chunk-1",
          sentenceId: "db-doc-1-sentence-1",
          text: "DB에서 발견된 원본 문서입니다. 아직 본문 분석은 수행되지 않았습니다.",
          startOffset: 0,
          endOffset: 36,
          syntaxLabel: "placeholder",
          highlightFamily: "none",
        },
      ],
      annotations: [
        {
          id: "db-doc-1-annotation-1",
          chunkId: "db-doc-1-chunk-1",
          type: "decode",
          text: "업로드 또는 분석 실행 후 실제 chunk와 annotation으로 교체됩니다.",
          colorFamily: "decode",
          visible: true,
          priority: 1,
        },
      ],
    },
    createdAt: new Date(0).toISOString(),
  };
}

test("hydrates markdown documents into chunk previews", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "onestop-hydrate-"));
  const filePath = path.join(root, "sample.md");
  await writeFile(
    filePath,
    "# Title\n\nFirst sentence in the passage.\nSecond sentence continues the point.\n\nFinal sentence closes.",
    "utf8",
  );

  try {
    const hydrated = await hydrateDocumentAnalysis(createRecord(filePath, "md"));

    assert.equal(hydrated.analysis.chunks.length, 3);
    assert.match(hydrated.analysis.chunks[0]?.text ?? "", /Title/);
    assert.equal(hydrated.metadata.processingState, "draft_ready");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("falls back to source-aware placeholder for pdf documents", async () => {
  const hydrated = await hydrateDocumentAnalysis(
    createRecord("/tmp/mock-exam.pdf", "pdf"),
  );

  assert.equal(hydrated.analysis.chunks.length, 1);
  assert.match(hydrated.analysis.chunks[0]?.text ?? "", /PDF 원본 문서/);
  assert.equal(hydrated.metadata.processingState, "ready_for_review");
});
