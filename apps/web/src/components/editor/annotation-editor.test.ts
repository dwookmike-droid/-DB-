import test from "node:test";
import assert from "node:assert/strict";

import { renderAnnotationEditor } from "./annotation-editor.ts";

test("renders grammar and vocab annotation cards", () => {
  const html = renderAnnotationEditor({
    id: "chunk-1",
    text: "Tactics is a term drawn from military usage.",
    annotations: [
      { id: "a1", type: "grammar", text: "분사구 후치 수식" },
      { id: "a2", type: "vocab", text: "tactics: 전술" },
    ],
  });

  assert.match(html, /Selected Chunk/);
  assert.match(html, /분사구 후치 수식/);
  assert.match(html, /tactics: 전술/);
});
