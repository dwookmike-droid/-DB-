import test from "node:test";
import assert from "node:assert/strict";

import { renderDocumentTable } from "./document-table.ts";

test("renders document rows with open links", () => {
  const html = renderDocumentTable([
    {
      id: "doc-1",
      title: "고2 2025 9월 20번",
      processingState: "draft_ready",
      runMode: "review_before_export",
    },
  ]);

  assert.match(html, /고2 2025 9월 20번/);
  assert.match(html, /draft_ready/);
  assert.match(html, /\/documents\/doc-1/);
});
