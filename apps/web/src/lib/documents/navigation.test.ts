import test from "node:test";
import assert from "node:assert/strict";

import { resolveNextDocumentUrl } from "./navigation.ts";

test("keeps draft_only uploads on the documents dashboard", () => {
  assert.equal(resolveNextDocumentUrl("store_draft", "doc-1"), "/documents");
});

test("opens editor for review mode uploads", () => {
  assert.equal(resolveNextDocumentUrl("open_editor", "doc-1"), "/documents/doc-1");
});

test("reuses document workspace for immediate export mode until pdf route exists", () => {
  assert.equal(resolveNextDocumentUrl("render_pdf", "doc-1"), "/documents/doc-1");
});
