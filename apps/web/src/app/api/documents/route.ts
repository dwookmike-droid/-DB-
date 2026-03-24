import { buildQueuedDocumentMetadata } from "../../../lib/metadata/infer-metadata.ts";
import { createDocumentRecord } from "../../../lib/documents/store.ts";
import { executeDocumentMode } from "../../../lib/run-modes/execute-document-mode.ts";
import { saveUpload } from "../../../lib/storage/save-upload.ts";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const runModeValue = formData.get("runMode");

  if (!(file instanceof File)) {
    return Response.json(
      { ok: false, message: "file is required" },
      { status: 400 },
    );
  }

  const stored = await saveUpload(file);
  const metadata = buildQueuedDocumentMetadata(
    stored.filename,
    stored.sourcePath,
    runModeValue === "draft_only" ||
      runModeValue === "review_before_export" ||
      runModeValue === "immediate_export"
      ? runModeValue
      : undefined,
  );
  const document = await createDocumentRecord(metadata);
  const execution = executeDocumentMode(document.metadata.runMode);

  return Response.json(
    { ok: true, document, nextAction: execution.nextAction },
    { status: 201 },
  );
}
