export interface DocumentListItem {
  id: string;
  title: string;
  processingState: string;
  runMode: string;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function renderDocumentTable(documents: DocumentListItem[]) {
  const rows = documents
    .map(
      (document) => `
        <tr>
          <td>${escapeHtml(document.title)}</td>
          <td><span class="state-chip">${escapeHtml(document.processingState)}</span></td>
          <td><span class="mode-chip">${escapeHtml(document.runMode)}</span></td>
          <td><a href="/documents/${escapeHtml(document.id)}">Open</a></td>
        </tr>
      `,
    )
    .join("");

  return `
    <style>
      :root {
        --paper: #f8f2e7;
        --ink: #1d2833;
        --line: #dbcdb7;
        --red: #bf4c41;
        --blue: #3a6ea8;
        --sand: #efe4d1;
      }
      .document-table-shell {
        background: linear-gradient(180deg, rgba(255,255,255,0.68), rgba(239,228,209,0.75));
        border: 1px solid var(--line);
        border-radius: 24px;
        box-shadow: 0 18px 40px rgba(54, 42, 27, 0.12);
        overflow: hidden;
      }
      .document-table {
        width: 100%;
        border-collapse: collapse;
        color: var(--ink);
        font-family: Georgia, "Times New Roman", serif;
      }
      .document-table thead {
        background: #f0e6d7;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-size: 12px;
      }
      .document-table th,
      .document-table td {
        padding: 16px 18px;
        border-bottom: 1px solid var(--line);
        text-align: left;
      }
      .document-table tbody tr:last-child td {
        border-bottom: none;
      }
      .state-chip,
      .mode-chip {
        display: inline-block;
        padding: 5px 10px;
        border-radius: 999px;
        font-size: 12px;
        letter-spacing: 0.04em;
      }
      .state-chip {
        background: rgba(58, 110, 168, 0.12);
        color: var(--blue);
        border: 1px solid rgba(58, 110, 168, 0.2);
      }
      .mode-chip {
        background: rgba(191, 76, 65, 0.12);
        color: var(--red);
        border: 1px solid rgba(191, 76, 65, 0.2);
      }
      a {
        color: var(--ink);
        text-decoration: none;
        border-bottom: 1px solid rgba(29, 40, 51, 0.4);
      }
    </style>
    <div class="document-table-shell">
      <table class="document-table">
        <thead>
          <tr>
            <th>Document</th>
            <th>State</th>
            <th>Mode</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;
}
