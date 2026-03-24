import { UploadPanel } from "../../components/documents/upload-panel";
import { renderDocumentTable } from "../../components/documents/document-table";
import { renderRunModeSelector } from "../../components/documents/run-mode-selector";
import { listDocumentRecords } from "../../lib/documents/store.ts";

export const dynamic = "force-dynamic";

export default async function DocumentsPage() {
  const documents = await listDocumentRecords();
  const tableHtml = renderDocumentTable(
    documents.map((document) => ({
      id: document.id,
      title: document.metadata.title,
      processingState: document.metadata.processingState,
      runMode: document.metadata.runMode,
    })),
  );
  const modeHtml = renderRunModeSelector("review_before_export");

  return (
    <main style={{ minHeight: "100vh", background: "#f6efe3", padding: "48px" }}>
      <section style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <p
          style={{
            font: '700 11px/1.1 "Avenir Next", sans-serif',
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#8c7350",
          }}
        >
          Onestop Analysis
        </p>
        <h1
          style={{
            margin: "10px 0 14px",
            font: "700 52px/1.02 Georgia, serif",
            color: "#1d2833",
          }}
        >
          Documents
        </h1>
        <p
          style={{
            maxWidth: "720px",
            margin: "0 0 22px",
            font: '500 15px/1.7 "Pretendard", "Avenir Next", sans-serif',
            color: "#4e5b66",
          }}
        >
          업로드된 모의고사 문서를 상태와 실행 모드 기준으로 관리하는 교사용
          대시보드.
        </p>
        <UploadPanel />
        <p
          style={{
            margin: "0 0 16px",
            font: '600 12px/1.5 "Pretendard", "Avenir Next", sans-serif',
            color: "#7b6651",
          }}
        >
          현재 문서 수 {documents.length}건
        </p>
        <div
          dangerouslySetInnerHTML={{ __html: modeHtml }}
          style={{ marginBottom: "20px" }}
        />
        <div dangerouslySetInnerHTML={{ __html: tableHtml }} />
      </section>
    </main>
  );
}
