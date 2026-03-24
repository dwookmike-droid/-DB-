# Onestop Analysis 업데이트

작성일: 2026-03-24

## 현재 상태

- `Onestop Analysis` 웹/앱형 솔루션의 V1 방향을 확정했다.
- V1은 `LLM API 없이` 진행한다.
- 범위는 `어휘 추출 + 기본 구문 분석 + 교사 편집 + 인쇄용 PDF 출력`까지다.
- `DECODE`는 V1에서 자동 의미 분석이 아니라 `색상 체계와 시각 규칙`만 우선 반영한다.

## 확정된 제품 방향

- 메인 형태: `웹 관리자`
- 핵심 산출물: `학생 배포용 PDF 프린트물`
- 주석 방식: `문장 위 인터리니어 주석`
- 설명 단위: `구/절 단위의 여러 조각 설명`
- 자동화 수준: 문서별로 선택
  - `초안만 생성`
  - `검수 후 출력`
  - `즉시 PDF 생성`

## 시각 규칙

- 어법 설명: `붉은색 계열`
- 어휘 설명: `푸른색 계열`
- 독해/DECODE: 기존 `DECODE마스터` 색상 체계 반영

현재 반영 기준:

- 🔵 파랑: 핵심 문장
- 🟢 초록: 패러프레이징
- 🟡 노랑: 예시/근거
- 🔴 빨강: 대조/반전
- 🟠 오렌지: 부연/전환

## 문서화 결과

다음 문서를 작성 완료:

- 설계 문서
  - `/Users/mikekangmoltbot/Library/Mobile Documents/com~apple~CloudDocs/00.모의고사 편집/[DB]모의고사/docs/superpowers/specs/2026-03-24-onestop-analysis-design.md`
- 구현 계획서
  - `/Users/mikekangmoltbot/Library/Mobile Documents/com~apple~CloudDocs/00.모의고사 편집/[DB]모의고사/docs/superpowers/plans/2026-03-24-onestop-analysis-implementation.md`

## 오늘 실행한 구현 작업

- 작업 폴더를 Git 저장소로 초기화
- 기본 모노레포 스캐폴드 생성
  - `apps/web`
  - `apps/worker`
  - `packages/db`
  - `packages/contracts`
  - `packages/print-templates`
  - `tests/e2e`
- 기본 설정 파일 추가
  - `package.json`
  - `pnpm-workspace.yaml`
  - `.gitignore`
  - `README.md`

## 다음 구현 순서

1. 공유 타입 정의
2. DB 스키마 작성
3. 문서 업로드/메타데이터 추정
4. 파이프라인 큐 연결
5. 텍스트 추출
6. 문장 분리/구절 chunking
7. 품사/기본 구문 분석
8. 어휘/동반어 초안 생성
9. 편집기
10. PDF 렌더링

## 메모

- V1의 핵심은 `완전 자동 해석`이 아니라 `교사가 바로 다듬을 수 있는 고급 초안 생성기`다.
- 품질을 위해 기본 동작은 `검수 후 출력`이 가장 안전하다.
