import Link from "next/link";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "40px",
      }}
    >
      <section
        style={{
          width: "min(960px, 100%)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.84), rgba(244,236,223,0.96))",
          border: "1px solid var(--line)",
          boxShadow: "0 28px 80px rgba(50,39,24,0.14)",
          padding: "36px",
        }}
      >
        <p
          style={{
            margin: 0,
            font: '700 11px/1.1 "Avenir Next", sans-serif',
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#8a735b",
          }}
        >
          Onestop Analysis
        </p>
        <h1
          style={{
            margin: "12px 0 14px",
            font: "700 54px/1.02 Georgia, serif",
            color: "#1f252c",
          }}
        >
          Mock Exam
          <br />
          Analysis Workspace
        </h1>
        <p
          style={{
            maxWidth: "700px",
            margin: 0,
            font: '500 16px/1.7 "Pretendard", "Avenir Next", sans-serif',
            color: "#58636d",
          }}
        >
          업로드, 분석 초안, 주석 편집, 인쇄용 PDF 출력을 하나의 흐름으로 묶는
          교사용 워크스페이스의 초기 런타임 스캐폴드입니다.
        </p>
        <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
          <Link
            href="/documents"
            style={{
              padding: "12px 16px",
              background: "rgba(52,111,163,0.12)",
              border: "1px solid rgba(52,111,163,0.2)",
              textDecoration: "none",
              font: '700 12px/1 "Avenir Next", sans-serif',
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Open Documents
          </Link>
          <Link
            href="/documents/g2-2025-09-q20"
            style={{
              padding: "12px 16px",
              background: "rgba(191,75,69,0.12)",
              border: "1px solid rgba(191,75,69,0.2)",
              textDecoration: "none",
              font: '700 12px/1 "Avenir Next", sans-serif',
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Open Editor
          </Link>
        </div>
      </section>
    </main>
  );
}
