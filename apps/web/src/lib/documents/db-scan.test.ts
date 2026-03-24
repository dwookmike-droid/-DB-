import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";

import { inferDocumentFromDbPath, scanDbRoot } from "./db-scan.ts";

test("infers metadata from grade/month/year/file path", () => {
  const document = inferDocumentFromDbPath(
    "/db/고3/11월_수능/2025/문제.pdf",
    "/db",
  );

  assert.ok(document);
  assert.equal(document?.metadata.grade, "고3");
  assert.equal(document?.metadata.month, "11월_수능");
  assert.equal(document?.metadata.year, 2025);
  assert.equal(document?.metadata.documentType, "question");
  assert.equal(document?.metadata.fileType, "pdf");
});

test("scans db root and ignores unsupported files", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "onestop-db-"));
  await mkdir(path.join(root, "고2", "09월", "2025"), { recursive: true });
  await writeFile(path.join(root, "고2", "09월", "2025", "문제.pdf"), "pdf");
  await writeFile(path.join(root, "고2", "09월", "2025", "해설.pdf"), "pdf");
  await writeFile(path.join(root, "고2", "09월", "2025", "듣기.mp3"), "mp3");

  try {
    const records = await scanDbRoot(root);

    assert.equal(records.length, 2);
    assert.equal(records[0]?.metadata.grade, "고2");
    assert.equal(records[0]?.metadata.month, "09월");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
