import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import { mkdtemp, rm } from "node:fs/promises";

import {
  createDocumentRecord,
  getDocumentRecord,
  listDocumentRecords,
} from "./store.ts";

test("creates and retrieves a stored document record", async () => {
  const runtimeDir = await mkdtemp(path.join(os.tmpdir(), "onestop-store-"));
  process.env.ONESTOP_RUNTIME_DIR = runtimeDir;

  try {
    const created = await createDocumentRecord({
      title: "고2 2025 9월 문제",
      sourcePath: "/uploads/g2-2025-09.pdf",
      fileType: "pdf",
      documentType: "question",
      grade: "고2",
      month: "9월",
      year: 2025,
      runMode: "review_before_export",
      processingState: "queued",
    });

    const found = await getDocumentRecord(created.id);

    assert.ok(found);
    assert.equal(found?.id, created.id);
    assert.equal(found?.metadata.title, "고2 2025 9월 문제");
    assert.equal(found?.analysis.chunks.length, 3);
  } finally {
    delete process.env.ONESTOP_RUNTIME_DIR;
    await rm(runtimeDir, { recursive: true, force: true });
  }
});

test("lists seeded documents before created records", async () => {
  const runtimeDir = await mkdtemp(path.join(os.tmpdir(), "onestop-store-"));
  process.env.ONESTOP_RUNTIME_DIR = runtimeDir;

  try {
    await createDocumentRecord({
      title: "고3 2026 6월 해설",
      sourcePath: "/uploads/g3-2026-06.docx",
      fileType: "docx",
      documentType: "explanation",
      grade: "고3",
      month: "6월",
      year: 2026,
      runMode: "draft_only",
      processingState: "queued",
    });

    const records = await listDocumentRecords();

    assert.equal(records[0]?.id, "g2-2025-09-q20");
    assert.equal(records.at(-1)?.metadata.title, "고3 2026 6월 해설");
  } finally {
    delete process.env.ONESTOP_RUNTIME_DIR;
    await rm(runtimeDir, { recursive: true, force: true });
  }
});
