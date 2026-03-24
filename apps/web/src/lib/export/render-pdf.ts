import { renderInterlinearTemplate } from "@onestop/print-templates";
import type { ExportPayload } from "@onestop/contracts";

export function renderPdf(payload: ExportPayload) {
  const chunkMap = new Map(
    payload.chunks.map((chunk) => [
      chunk.id,
      {
        text: chunk.text,
        annotations: payload.annotations
          .filter((annotation) => annotation.chunkId === chunk.id && annotation.visible)
          .sort((left, right) => left.priority - right.priority)
          .map((annotation) => ({
            type: annotation.type,
            text: annotation.text,
          })),
      },
    ]),
  );

  return renderInterlinearTemplate({
    title: payload.title,
    chunks: [...chunkMap.values()],
  });
}
