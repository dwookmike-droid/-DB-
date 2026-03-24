export interface EditorAnnotation {
  id: string;
  type: "grammar" | "vocab" | "decode";
  text: string;
}

export interface EditorChunk {
  id: string;
  text: string;
  annotations: EditorAnnotation[];
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function renderAnnotationEditor(chunk: EditorChunk) {
  const cards = chunk.annotations
    .map(
      (annotation) => `
        <section class="editor-card ${annotation.type}">
          <div class="editor-chip">${escapeHtml(annotation.type)}</div>
          <label class="editor-label" for="${escapeHtml(annotation.id)}">설명</label>
          <textarea id="${escapeHtml(annotation.id)}" class="editor-textarea">${escapeHtml(annotation.text)}</textarea>
          <div class="editor-inline">
            <label><input type="checkbox" checked> 보이기</label>
            <label><input type="checkbox"> Deep</label>
          </div>
        </section>
      `,
    )
    .join("");

  return `
    <style>
      .editor-shell {
        display: grid;
        gap: 12px;
      }
      .editor-header {
        padding: 12px 14px;
        border: 1px solid #dbcdb7;
        background: rgba(255,252,246,0.9);
      }
      .editor-title {
        font: 700 18px/1.1 Georgia, serif;
        color: #212933;
      }
      .editor-subtitle {
        margin-top: 6px;
        font: 500 12px/1.5 "Pretendard", "Avenir Next", sans-serif;
        color: #57626c;
      }
      .editor-card {
        padding: 12px;
        border: 1px solid #dbcdb7;
        background: rgba(255,252,246,0.92);
      }
      .editor-card.grammar { box-shadow: inset 3px 0 0 rgba(189,74,68,0.65); }
      .editor-card.vocab { box-shadow: inset 3px 0 0 rgba(52,111,163,0.7); }
      .editor-card.decode { box-shadow: inset 3px 0 0 rgba(77,120,181,0.68); }
      .editor-chip {
        display: inline-block;
        padding: 3px 8px;
        border-radius: 999px;
        background: #f3ecdf;
        font: 700 10px/1 "Avenir Next", sans-serif;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: #7d6b56;
      }
      .editor-label {
        display: block;
        margin-top: 10px;
        font: 700 11px/1.1 "Pretendard", sans-serif;
        color: #49545d;
      }
      .editor-textarea {
        width: 100%;
        min-height: 94px;
        margin-top: 8px;
        padding: 10px;
        box-sizing: border-box;
        border: 1px solid #d9ccb7;
        background: #fffdf8;
        font: 500 12px/1.55 "Pretendard", sans-serif;
        color: #26313b;
        resize: vertical;
      }
      .editor-inline {
        display: flex;
        gap: 18px;
        margin-top: 10px;
        font: 500 11px/1.3 "Pretendard", sans-serif;
        color: #5b6670;
      }
    </style>
    <div class="editor-shell">
      <div class="editor-header">
        <div class="editor-title">Selected Chunk</div>
        <div class="editor-subtitle">${escapeHtml(chunk.text)}</div>
      </div>
      ${cards}
    </div>
  `;
}
