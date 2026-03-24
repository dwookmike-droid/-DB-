import { buildQueuedDocumentMetadata } from "../../../lib/metadata/infer-metadata.ts";
import { saveUpload } from "../../../lib/storage/save-upload.ts";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return Response.json(
      { ok: false, message: "file is required" },
      { status: 400 },
    );
  }

  const stored = await saveUpload(file);
  const metadata = buildQueuedDocumentMetadata(stored.filename, stored.sourcePath);

  return Response.json({ ok: true, document: metadata }, { status: 201 });
}
