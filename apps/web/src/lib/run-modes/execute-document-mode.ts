import type { RunMode } from "@onestop/contracts";

export type DocumentAction = "store_draft" | "open_editor" | "render_pdf";

export interface ModeExecutionResult {
  runMode: RunMode;
  nextAction: DocumentAction;
}

export function executeDocumentMode(runMode: RunMode): ModeExecutionResult {
  if (runMode === "draft_only") {
    return { runMode, nextAction: "store_draft" };
  }

  if (runMode === "immediate_export") {
    return { runMode, nextAction: "render_pdf" };
  }

  return { runMode, nextAction: "open_editor" };
}
