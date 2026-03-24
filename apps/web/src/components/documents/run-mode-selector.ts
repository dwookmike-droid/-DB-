import type { RunMode } from "@onestop/contracts";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const MODE_LABELS: Record<RunMode, string> = {
  draft_only: "Draft Only",
  review_before_export: "Review Before Export",
  immediate_export: "Immediate Export",
};

export function renderRunModeSelector(selected: RunMode) {
  return `
    <style>
      .run-mode-shell {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
      .run-mode-chip {
        padding: 6px 10px;
        border-radius: 999px;
        border: 1px solid #dbcdb7;
        background: #f5ede0;
        font: 700 10px/1 "Avenir Next", sans-serif;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: #6f604f;
      }
      .run-mode-chip.active {
        background: rgba(191, 75, 69, 0.12);
        color: #bf4b45;
        border-color: rgba(191, 75, 69, 0.2);
      }
    </style>
    <div class="run-mode-shell">
      ${(["draft_only", "review_before_export", "immediate_export"] as RunMode[])
        .map(
          (mode) => `
            <span class="run-mode-chip ${mode === selected ? "active" : ""}">
              ${escapeHtml(MODE_LABELS[mode])}
            </span>
          `,
        )
        .join("")}
    </div>
  `;
}
