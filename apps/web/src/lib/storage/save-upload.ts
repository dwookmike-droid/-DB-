import path from "node:path";

export interface StoredUpload {
  filename: string;
  sourcePath: string;
}

function sanitizeFilename(filename: string) {
  return filename.replaceAll(/[^\w.-가-힣]/g, "_");
}

export async function saveUpload(file: File): Promise<StoredUpload> {
  const filename = sanitizeFilename(file.name || "upload.pdf");

  return {
    filename,
    sourcePath: path.posix.join("/uploads", filename),
  };
}
