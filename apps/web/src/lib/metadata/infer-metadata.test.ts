import test from "node:test";
import assert from "node:assert/strict";

import {
  buildQueuedDocumentMetadata,
  inferMetadataFromFilename,
} from "./infer-metadata.ts";

test("infers grade, year, month, type, and file type from filename", () => {
  const inferred = inferMetadataFromFilename("고2_2025_9월_문제.pdf");

  assert.equal(inferred.grade, "고2");
  assert.equal(inferred.year, 2025);
  assert.equal(inferred.month, "9월");
  assert.equal(inferred.fileType, "pdf");
  assert.equal(inferred.documentType, "question");
});

test("builds queued metadata with default run mode", () => {
  const metadata = buildQueuedDocumentMetadata(
    "고3_2024_11월_해설.docx",
    "/uploads/sample.docx",
  );

  assert.equal(metadata.processingState, "queued");
  assert.equal(metadata.runMode, "review_before_export");
  assert.equal(metadata.documentType, "explanation");
});
