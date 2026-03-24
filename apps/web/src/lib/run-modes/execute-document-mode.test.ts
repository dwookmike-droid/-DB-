import test from "node:test";
import assert from "node:assert/strict";

import { executeDocumentMode } from "./execute-document-mode.ts";

test("maps draft_only to draft storage", () => {
  assert.deepEqual(executeDocumentMode("draft_only"), {
    runMode: "draft_only",
    nextAction: "store_draft",
  });
});

test("maps review_before_export to editor review", () => {
  assert.deepEqual(executeDocumentMode("review_before_export"), {
    runMode: "review_before_export",
    nextAction: "open_editor",
  });
});

test("maps immediate_export to pdf rendering", () => {
  assert.deepEqual(executeDocumentMode("immediate_export"), {
    runMode: "immediate_export",
    nextAction: "render_pdf",
  });
});
