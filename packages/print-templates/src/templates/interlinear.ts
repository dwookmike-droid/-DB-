export interface TemplateAnnotation {
  type: "grammar" | "vocab" | "decode";
  text: string;
}

export interface TemplateChunk {
  text: string;
  annotations: TemplateAnnotation[];
}

export interface InterlinearTemplateInput {
  title: string;
  chunks: TemplateChunk[];
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderAnnotationBlock(annotation: TemplateAnnotation) {
  const className =
    annotation.type === "grammar"
      ? "annotation grammar"
      : annotation.type === "vocab"
        ? "annotation vocab"
        : "annotation decode";

  return `<div class="${className}">${escapeHtml(annotation.text)}</div>`;
}

function renderChunk(chunk: TemplateChunk) {
  const annotations = chunk.annotations.map(renderAnnotationBlock).join("");
  return `
    <section class="chunk">
      <div class="note-stack">${annotations}</div>
      <div class="chunk-text">${escapeHtml(chunk.text)}</div>
    </section>
  `;
}

export function renderInterlinearTemplate(input: InterlinearTemplateInput) {
  const body = input.chunks.map(renderChunk).join("");

  return `
    <style>
      :root {
        --paper: #fbf7ef;
        --ink: #1f2933;
        --line: #dbcdb8;
        --grammar: #bf4b45;
        --grammar-soft: rgba(191, 75, 69, 0.12);
        --vocab: #346fa3;
        --vocab-soft: rgba(52, 111, 163, 0.12);
        --decode: #4d78b5;
        --decode-soft: rgba(77, 120, 181, 0.12);
      }
      .page {
        background: linear-gradient(180deg, #fdf9f1, #f3ecdf);
        border: 1px solid var(--line);
        padding: 28px;
        color: var(--ink);
        font-family: Georgia, "Times New Roman", serif;
      }
      .title {
        margin: 0 0 18px;
        font: 700 32px/1.04 Georgia, serif;
      }
      .chunk {
        margin-bottom: 18px;
        padding-bottom: 16px;
        border-bottom: 1px dashed #e3d8c8;
        break-inside: avoid;
      }
      .note-stack {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 7px;
      }
      .annotation {
        padding: 3px 8px;
        border-radius: 999px;
        font: 600 12px/1.25 "Pretendard", "Avenir Next", sans-serif;
      }
      .annotation.grammar {
        color: var(--grammar);
        background: var(--grammar-soft);
        border: 1px solid rgba(191, 75, 69, 0.2);
      }
      .annotation.vocab {
        color: var(--vocab);
        background: var(--vocab-soft);
        border: 1px solid rgba(52, 111, 163, 0.2);
      }
      .annotation.decode {
        color: var(--decode);
        background: var(--decode-soft);
        border: 1px solid rgba(77, 120, 181, 0.2);
      }
      .chunk-text {
        font: 400 19px/1.68 Georgia, serif;
      }
    </style>
    <div class="page">
      <h1 class="title">${escapeHtml(input.title)}</h1>
      ${body}
    </div>
  `;
}
