import type { RunMode } from "@onestop/contracts";
import type { EditorChunk } from "@/components/editor/annotation-editor";

export interface MockDocument {
  id: string;
  title: string;
  processingState: string;
  runMode: RunMode;
}

export const mockDocuments: MockDocument[] = [
  {
    id: "g2-2025-09-q20",
    title: "고2 2025 9월 20번 waiting passage",
    processingState: "draft_ready",
    runMode: "review_before_export",
  },
  {
    id: "g2-2025-09-q18",
    title: "고2 2025 9월 18번 letter passage",
    processingState: "queued",
    runMode: "draft_only",
  },
  {
    id: "g2-2025-09-q21",
    title: "고2 2025 9월 21번 mirror neurons passage",
    processingState: "exported",
    runMode: "immediate_export",
  },
];

export const mockEditorChunks: EditorChunk[] = [
  {
    id: "chunk_1",
    text: "“Tactics” is a term drawn from military usage.",
    annotations: [
      {
        id: "g1",
        type: "grammar",
        text: "[분사구] a term을 후치 수식하는 분사구. a term (which is) drawn ...으로 복원 가능.",
      },
      {
        id: "v1",
        type: "vocab",
        text: "tactics: 전술, 대처 방식 / 문맥상 핵심 개념어",
      },
      {
        id: "d1",
        type: "decode",
        text: "도입부 개념 정의 문장",
      },
    ],
  },
  {
    id: "chunk_2",
    text: "In response, we must develop tactics for dealing with time and waiting.",
    annotations: [
      {
        id: "g2",
        type: "grammar",
        text: "[for + 동명사] tactics의 적용 범위를 설명하는 기능 표현",
      },
      {
        id: "v2",
        type: "vocab",
        text: "deal with: 다루다 / waiting: 기다림",
      },
      {
        id: "d2",
        type: "decode",
        text: "필자 주장 진입 문장",
      },
    ],
  },
  {
    id: "chunk_3",
    text: "Such renewed perspectives transform waiting from a burden to a springboard.",
    annotations: [
      {
        id: "g3",
        type: "grammar",
        text: "[transform A from B to C] 기다림을 부담에서 도약대로 전환하는 변화 구문",
      },
      {
        id: "v3",
        type: "vocab",
        text: "springboard: 발판, 도약대 / 문맥상 긍정적 전환의 핵심어",
      },
      {
        id: "d3",
        type: "decode",
        text: "결론 핵심 문장",
      },
    ],
  },
];
