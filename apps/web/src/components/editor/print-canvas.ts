import type { EditorChunk } from "./annotation-editor.ts";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function renderPrintCanvas(chunks: EditorChunk[]) {
  const chunkHtml = chunks
    .map(
      (chunk, index) => `
        <div class="canvas-sentence ${index === 0 ? "selected" : ""}">
          <div class="canvas-ref">${index + 1}</div>
          <div class="canvas-text">${escapeHtml(chunk.text)}</div>
        </div>
      `,
    )
    .join("");

  return `
    <style>
      .canvas-shell {
        border: 1px solid #d8cbb6;
        background: linear-gradient(180deg, rgba(255,255,255,0.8), rgba(243,235,223,0.95));
        padding: 16px;
        min-height: 420px;
      }
      .canvas-title {
        font: 700 10px/1.1 "Avenir Next", sans-serif;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: #8a745d;
      }
      .canvas-page {
        margin-top: 12px;
        border: 1px solid #dfd3c0;
        background: rgba(255,252,246,0.92);
        padding: 18px;
      }
      .canvas-sentence {
        display: grid;
        grid-template-columns: 24px 1fr;
        gap: 10px;
        padding: 10px 0;
        border-bottom: 1px dashed #e4d9c8;
      }
      .canvas-sentence.selected {
        background: rgba(52,111,163,0.05);
      }
      .canvas-ref {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: rgba(52,111,163,0.12);
        border: 1px solid rgba(52,111,163,0.2);
        color: #366fa1;
        font: 700 10px/20px "Avenir Next", sans-serif;
        text-align: center;
      }
      .canvas-text {
        font: 400 16px/1.7 Georgia, serif;
        color: #1e2831;
      }
    </style>
    <div class="canvas-shell">
      <div class="canvas-title">Print Canvas Preview</div>
      <div class="canvas-page">
        ${chunkHtml}
      </div>
    </div>
  `;
}
