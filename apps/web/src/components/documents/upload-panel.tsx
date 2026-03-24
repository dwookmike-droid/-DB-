"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import type { RunMode } from "@onestop/contracts";
import { resolveNextDocumentUrl } from "../../lib/documents/navigation.ts";

const RUN_MODE_OPTIONS: Array<{ value: RunMode; label: string; hint: string }> = [
  {
    value: "review_before_export",
    label: "검수 후 출력",
    hint: "초안을 만든 뒤 편집 화면으로 이동합니다.",
  },
  {
    value: "draft_only",
    label: "초안만 생성",
    hint: "문서 등록만 하고 목록에 보관합니다.",
  },
  {
    value: "immediate_export",
    label: "즉시 PDF 준비",
    hint: "현재는 편집 화면으로 이동해 출력 전 상태를 확인합니다.",
  },
];

interface UploadResponse {
  ok: boolean;
  document?: {
    id: string;
  };
  nextAction?: "store_draft" | "open_editor" | "render_pdf";
  message?: string;
}

export function UploadPanel() {
  const router = useRouter();
  const [selectedFileName, setSelectedFileName] = useState("선택된 파일 없음");
  const [runMode, setRunMode] = useState<RunMode>("review_before_export");
  const [statusText, setStatusText] = useState("PDF, DOCX, MD를 업로드하면 문서 레코드를 생성합니다.");
  const [isPending, startTransition] = useTransition();

  return (
    <section
      style={{
        marginBottom: "28px",
        border: "1px solid #dbcdb7",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.82), rgba(241,231,215,0.96))",
        boxShadow: "0 18px 40px rgba(54, 42, 27, 0.1)",
        padding: "22px",
      }}
    >
      <div
        style={{
          display: "grid",
          gap: "18px",
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              font: '700 11px/1.1 "Avenir Next", sans-serif',
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#8c7350",
            }}
          >
            Upload Intake
          </p>
          <h2
            style={{
              margin: "10px 0 8px",
              font: "700 30px/1.08 Georgia, serif",
              color: "#1d2833",
            }}
          >
            새 모의고사 문서 등록
          </h2>
          <p
            style={{
              margin: 0,
              maxWidth: "740px",
              font: '500 13px/1.65 "Pretendard", "Avenir Next", sans-serif',
              color: "#5d6770",
            }}
          >
            파일명에서 학년, 연도, 월, 문서 유형을 추정하고 실행 모드에 따라 초안 보관 또는 편집 화면 이동을 결정합니다.
          </p>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();

            const formData = new FormData(event.currentTarget);
            const file = formData.get("file");

            if (!(file instanceof File) || file.size === 0) {
              setStatusText("업로드할 파일을 먼저 선택해야 합니다.");
              return;
            }

            setStatusText("문서 메타데이터를 추정하고 있습니다.");

            startTransition(async () => {
              try {
                const response = await fetch("/api/documents", {
                  method: "POST",
                  body: formData,
                });
                const payload = (await response.json()) as UploadResponse;

                if (!response.ok || !payload.ok || !payload.document || !payload.nextAction) {
                  setStatusText(payload.message ?? "업로드 처리 중 오류가 발생했습니다.");
                  return;
                }

                setStatusText("문서를 등록했습니다. 작업 화면으로 이동합니다.");
                router.push(resolveNextDocumentUrl(payload.nextAction, payload.document.id));
                router.refresh();
              } catch {
                setStatusText("네트워크 또는 런타임 오류로 업로드를 완료하지 못했습니다.");
              }
            });
          }}
          style={{
            display: "grid",
            gap: "16px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.15fr 0.85fr",
              gap: "16px",
            }}
          >
            <label
              style={{
                display: "grid",
                gap: "10px",
              }}
            >
              <span
                style={{
                  font: '700 11px/1.1 "Pretendard", sans-serif',
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "#5b6670",
                }}
              >
                Source File
              </span>
              <div
                style={{
                  border: "1px dashed #cbb89c",
                  background: "rgba(255,252,246,0.95)",
                  padding: "14px",
                }}
              >
                <input
                  name="file"
                  type="file"
                  accept=".pdf,.docx,.md"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    setSelectedFileName(file?.name ?? "선택된 파일 없음");
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    font: '500 13px/1.4 "Pretendard", sans-serif',
                    color: "#22303b",
                  }}
                />
                <p
                  style={{
                    margin: "10px 0 0",
                    font: '500 12px/1.5 "Pretendard", sans-serif',
                    color: "#6f604f",
                  }}
                >
                  {selectedFileName}
                </p>
              </div>
            </label>

            <label
              style={{
                display: "grid",
                gap: "10px",
              }}
            >
              <span
                style={{
                  font: '700 11px/1.1 "Pretendard", sans-serif',
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "#5b6670",
                }}
              >
                Run Mode
              </span>
              <select
                name="runMode"
                value={runMode}
                onChange={(event) => setRunMode(event.target.value as RunMode)}
                style={{
                  border: "1px solid #d8cbb6",
                  background: "rgba(255,252,246,0.95)",
                  padding: "14px 12px",
                  font: '600 13px/1.4 "Pretendard", sans-serif',
                  color: "#22303b",
                }}
              >
                {RUN_MODE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p
                style={{
                  margin: 0,
                  font: '500 12px/1.5 "Pretendard", sans-serif',
                  color: "#6f604f",
                }}
              >
                {RUN_MODE_OPTIONS.find((option) => option.value === runMode)?.hint}
              </p>
            </label>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <p
              style={{
                margin: 0,
                font: '500 12px/1.6 "Pretendard", sans-serif',
                color: "#6a746c",
              }}
            >
              {statusText}
            </p>
            <button
              type="submit"
              disabled={isPending}
              style={{
                border: "1px solid rgba(191,75,69,0.22)",
                background: isPending ? "rgba(191,75,69,0.08)" : "rgba(191,75,69,0.14)",
                color: "#9d3f37",
                padding: "12px 18px",
                font: '700 12px/1 "Avenir Next", sans-serif',
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: isPending ? "progress" : "pointer",
              }}
            >
              {isPending ? "Processing..." : "Upload Document"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
