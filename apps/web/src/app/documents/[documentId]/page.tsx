import { notFound } from "next/navigation";
import { renderAnnotationEditor } from "../../../components/editor/annotation-editor";
import { renderPrintCanvas } from "../../../components/editor/print-canvas";
import { getDocumentRecord } from "../../../lib/documents/store.ts";

export const dynamic = "force-dynamic";

interface DocumentEditorPageProps {
  params: Promise<{ documentId: string }>;
}

export default async function DocumentEditorPage({
  params,
}: DocumentEditorPageProps) {
  const { documentId } = await params;
  const document = await getDocumentRecord(documentId);

  if (!document) {
    notFound();
  }

  const editorChunks = document.analysis.chunks.map((chunk) => ({
    id: chunk.id,
    text: chunk.text,
    annotations: document.analysis.annotations
      .filter((annotation) => annotation.chunkId === chunk.id)
      .sort((left, right) => left.priority - right.priority)
      .map((annotation) => ({
        id: annotation.id,
        type: annotation.type,
        text: annotation.text,
      })),
  }));

  const selectedChunk = editorChunks[0];
  const canvasHtml = renderPrintCanvas(editorChunks);
  const editorHtml = selectedChunk
    ? renderAnnotationEditor(selectedChunk)
    : "<div>No chunk selected</div>";

  return (
    <main style={{ minHeight: "100vh", background: "#f4ecdf", padding: "36px" }}>
      <section style={{ maxWidth: "1320px", margin: "0 auto" }}>
        <p
          style={{
            font: '700 11px/1.1 "Avenir Next",sans-serif',
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#8b735b",
          }}
        >
          Onestop Editor Workspace
        </p>
        <h1
          style={{
            margin: "10px 0 12px",
            font: "700 40px/1.04 Georgia,serif",
            color: "#1d252d",
          }}
        >
          {document.metadata.title}
        </h1>
        <p
          style={{
            maxWidth: "760px",
            margin: "0 0 24px",
            font: '500 14px/1.65 "Pretendard",sans-serif',
            color: "#58636d",
          }}
        >
          좌측은 인쇄용 캔버스, 우측은 선택한 chunk의 문법·어휘·DECODE 설명을 수정하는 편집 패널입니다.
        </p>
        <p
          style={{
            margin: "0 0 18px",
            font: '600 12px/1.5 "Pretendard",sans-serif',
            color: "#7d6b56",
          }}
        >
          상태 {document.metadata.processingState} · 실행모드 {document.metadata.runMode}
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.25fr 0.75fr",
            gap: "18px",
            alignItems: "start",
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: canvasHtml }} />
          <div dangerouslySetInnerHTML={{ __html: editorHtml }} />
        </div>
      </section>
    </main>
  );
}
