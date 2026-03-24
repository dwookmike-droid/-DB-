import { renderDocumentTable } from "../../components/documents/document-table";
import { renderRunModeSelector } from "../../components/documents/run-mode-selector";
import { mockDocuments } from "../../lib/mock-data";

export default function DocumentsPage() {
  const tableHtml = renderDocumentTable(mockDocuments);
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
        <div
          dangerouslySetInnerHTML={{ __html: modeHtml }}
          style={{ marginBottom: "20px" }}
        />
        <div dangerouslySetInnerHTML={{ __html: tableHtml }} />
      </section>
    </main>
  );
}
