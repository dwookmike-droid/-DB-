import test from "node:test";
import assert from "node:assert/strict";

import { renderInterlinearTemplate } from "./interlinear.ts";

test("renders grammar and vocab annotations into separate visual blocks", () => {
  const html = renderInterlinearTemplate({
    title: "Sample",
    chunks: [
      {
        text: "The way we remember",
        annotations: [
          { type: "grammar", text: "주어구" },
          { type: "vocab", text: "기억하는 방식" },
        ],
      },
    ],
  });

  assert.match(html, /주어구/);
  assert.match(html, /기억하는 방식/);
});
