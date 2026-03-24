# Onestop Analysis Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build V1 of a teacher-facing web system that ingests mock-exam source files, generates non-LLM grammar/vocabulary analysis drafts, and exports premium printable PDFs with interlinear annotations.

**Architecture:** The system consists of a Next.js web app, a Python analysis worker, PostgreSQL for structured data, Redis-backed async jobs, and an HTML/CSS-to-PDF print engine. V1 prioritizes chunk-level annotation drafting and teacher-controlled editing over full semantic automation.

**Tech Stack:** Next.js, TypeScript, Python, PostgreSQL, Redis, Prisma, pytest, Playwright, HTML/CSS print templates

---

## Proposed File Structure

If starting from an empty repository, create the project with this structure:

- `apps/web/`
  - Teacher-facing Next.js app
- `apps/worker/`
  - Python analysis worker and document processing pipeline
- `packages/db/`
  - Prisma schema, migrations, shared DB client
- `packages/contracts/`
  - Shared TypeScript types for API/job payloads
- `packages/print-templates/`
  - HTML/CSS print templates and rendering helpers
- `docs/superpowers/specs/`
  - Approved design docs
- `docs/superpowers/plans/`
  - Implementation plans
- `tests/e2e/`
  - Cross-system Playwright tests

This plan assumes the repository will be initialized around that structure. If an existing app is preferred, adapt the paths but keep the same boundaries.

### Task 1: Scaffold the Repository

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `apps/web/package.json`
- Create: `apps/worker/pyproject.toml`
- Create: `packages/db/package.json`
- Create: `packages/contracts/package.json`
- Create: `packages/print-templates/package.json`
- Create: `.gitignore`
- Create: `README.md`

- [ ] **Step 1: Write the failing test**

Create `README.md` with a checklist section stating the expected top-level folders:

```md
- apps/web
- apps/worker
- packages/db
- packages/contracts
- packages/print-templates
```

- [ ] **Step 2: Run check to verify the folders do not exist yet**

Run: `find . -maxdepth 2 -type d | sort`
Expected: target workspace folders are missing or incomplete

- [ ] **Step 3: Write minimal implementation**

Create the workspace files and directories listed above. Use `pnpm` workspaces for JavaScript packages and a standalone Python worker package.

- [ ] **Step 4: Run check to verify the scaffold exists**

Run: `find . -maxdepth 2 -type d | sort`
Expected: `apps/web`, `apps/worker`, `packages/db`, `packages/contracts`, `packages/print-templates`

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "chore: scaffold onestop monorepo"
```

### Task 2: Define Shared Domain Contracts

**Files:**
- Create: `packages/contracts/src/document.ts`
- Create: `packages/contracts/src/analysis.ts`
- Create: `packages/contracts/src/export.ts`
- Create: `packages/contracts/src/index.ts`
- Test: `packages/contracts/src/index.ts`

- [ ] **Step 1: Write the failing test**

Add TypeScript compile-time expectations in `packages/contracts/src/index.ts`:

```ts
export type RunMode = "draft_only" | "review_before_export" | "immediate_export";
export type AnnotationType = "grammar" | "vocab" | "decode";
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @onestop/contracts build`
Expected: FAIL because package config or source files are missing

- [ ] **Step 3: Write minimal implementation**

Add the shared types:

- `RunMode`
- `ProcessingState`
- `AnnotationType`
- `DecodeRoleColor`
- `DocumentMetadata`
- `ChunkDraft`
- `ExportRequest`

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @onestop/contracts build`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/contracts
git commit -m "feat: add shared domain contracts"
```

### Task 3: Model the Database Schema

**Files:**
- Create: `packages/db/prisma/schema.prisma`
- Create: `packages/db/src/client.ts`
- Create: `packages/db/package.json`
- Test: `packages/db/prisma/schema.prisma`

- [ ] **Step 1: Write the failing test**

Draft the target models in `packages/db/prisma/schema.prisma` comments:

```prisma
// Document
// Sentence
// Chunk
// Annotation
// VocabularyItem
// Export
// Preset
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @onestop/db prisma validate`
Expected: FAIL because schema and package setup are incomplete

- [ ] **Step 3: Write minimal implementation**

Implement Prisma models with:

- `Document`
  - source path, file type, inferred grade/month/year, run mode, processing state
- `Sentence`
  - order, text, optional translation draft, optional decode role
- `Chunk`
  - sentence relation, start/end offsets, text, syntax label, highlight family
- `Annotation`
  - chunk relation, type, text, color family, visibility, priority
- `VocabularyItem`
  - lemma, surface form, pos, meaning candidates, collocation candidates, importance
- `Export`
  - document relation, template version, file path, reviewed flag
- `Preset`
  - template settings, annotation defaults, color defaults

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @onestop/db prisma validate`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/db
git commit -m "feat: add initial database schema"
```

### Task 4: Build the Document Intake API

**Files:**
- Create: `apps/web/src/app/api/documents/route.ts`
- Create: `apps/web/src/lib/storage/save-upload.ts`
- Create: `apps/web/src/lib/metadata/infer-metadata.ts`
- Test: `apps/web/src/lib/metadata/infer-metadata.test.ts`

- [ ] **Step 1: Write the failing test**

Create `apps/web/src/lib/metadata/infer-metadata.test.ts`:

```ts
import { inferMetadataFromFilename } from "./infer-metadata";

it("infers grade, month, year, and type from a canonical filename", () => {
  expect(
    inferMetadataFromFilename("고2_2025_06월_문제.pdf")
  ).toMatchObject({ grade: "고2", year: 2025, month: "06월", type: "question" });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter web test infer-metadata`
Expected: FAIL because parser is missing

- [ ] **Step 3: Write minimal implementation**

Implement:

- upload endpoint for `pdf`, `docx`, `md`
- file persistence
- filename-based metadata inference
- DB document row creation with `queued` processing state

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter web test infer-metadata`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/web packages/contracts packages/db
git commit -m "feat: add document intake api"
```

### Task 5: Add the Job Queue and Processing Trigger

**Files:**
- Create: `apps/web/src/lib/jobs/enqueue-document.ts`
- Create: `apps/worker/src/jobs/process_document.py`
- Create: `apps/worker/src/jobs/queue.py`
- Test: `apps/worker/tests/test_queue_payload.py`

- [ ] **Step 1: Write the failing test**

Create `apps/worker/tests/test_queue_payload.py`:

```python
from onestop.jobs.process_document import build_job_payload

def test_build_job_payload_contains_document_id():
    payload = build_job_payload("doc_123")
    assert payload["document_id"] == "doc_123"
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest apps/worker/tests/test_queue_payload.py -v`
Expected: FAIL because worker job module is missing

- [ ] **Step 3: Write minimal implementation**

Implement:

- enqueue helper from web app
- Redis-backed queue payload format
- Python worker entrypoint for `document_id`

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest apps/worker/tests/test_queue_payload.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/web apps/worker
git commit -m "feat: add document processing queue"
```

### Task 6: Implement Source Extraction

**Files:**
- Create: `apps/worker/src/extract/pdf.py`
- Create: `apps/worker/src/extract/docx.py`
- Create: `apps/worker/src/extract/md.py`
- Create: `apps/worker/src/extract/router.py`
- Test: `apps/worker/tests/test_extract_router.py`

- [ ] **Step 1: Write the failing test**

Create `apps/worker/tests/test_extract_router.py`:

```python
from onestop.extract.router import get_extractor

def test_get_extractor_returns_pdf_extractor():
    extractor = get_extractor("pdf")
    assert extractor.__name__ == "extract_pdf_text"
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest apps/worker/tests/test_extract_router.py -v`
Expected: FAIL because extractor router is missing

- [ ] **Step 3: Write minimal implementation**

Implement:

- `extract_pdf_text`
- `extract_docx_text`
- `extract_md_text`
- format router
- placeholder OCR fallback hook for future hard PDFs

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest apps/worker/tests/test_extract_router.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/worker
git commit -m "feat: add document extraction pipeline"
```

### Task 7: Implement Sentence Segmentation and Chunking

**Files:**
- Create: `apps/worker/src/analyze/sentences.py`
- Create: `apps/worker/src/analyze/chunks.py`
- Test: `apps/worker/tests/test_chunks.py`

- [ ] **Step 1: Write the failing test**

Create `apps/worker/tests/test_chunks.py`:

```python
from onestop.analyze.chunks import split_sentence_into_chunks

def test_split_sentence_into_chunks_returns_multiple_segments():
    sentence = "The way we remember shapes the way we act in the future."
    chunks = split_sentence_into_chunks(sentence)
    assert len(chunks) >= 2
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest apps/worker/tests/test_chunks.py -v`
Expected: FAIL because chunker is missing

- [ ] **Step 3: Write minimal implementation**

Implement:

- sentence segmentation
- syntax-aware chunk draft generation
- offset calculation for each chunk
- deterministic fallback rules when parsing confidence is low

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest apps/worker/tests/test_chunks.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/worker
git commit -m "feat: add sentence segmentation and chunking"
```

### Task 8: Implement POS and Basic Syntax Analysis

**Files:**
- Create: `apps/worker/src/analyze/pos.py`
- Create: `apps/worker/src/analyze/syntax.py`
- Test: `apps/worker/tests/test_pos_syntax.py`

- [ ] **Step 1: Write the failing test**

Create `apps/worker/tests/test_pos_syntax.py`:

```python
from onestop.analyze.pos import tag_tokens

def test_tag_tokens_marks_main_verb():
    tags = tag_tokens("Memory shapes behavior.")
    assert any(token["pos"] == "VERB" for token in tags)
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest apps/worker/tests/test_pos_syntax.py -v`
Expected: FAIL because tagging module is missing

- [ ] **Step 3: Write minimal implementation**

Implement:

- tokenization
- POS tagging
- basic dependency or syntax labeling
- helper to attach syntax labels to chunk drafts

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest apps/worker/tests/test_pos_syntax.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/worker
git commit -m "feat: add pos and syntax analysis"
```

### Task 9: Generate Vocabulary and Collocation Drafts

**Files:**
- Create: `apps/worker/src/analyze/vocab.py`
- Create: `apps/worker/src/analyze/collocations.py`
- Test: `apps/worker/tests/test_vocab.py`

- [ ] **Step 1: Write the failing test**

Create `apps/worker/tests/test_vocab.py`:

```python
from onestop.analyze.vocab import extract_vocabulary_candidates

def test_extract_vocabulary_candidates_returns_content_words():
    items = extract_vocabulary_candidates("Memory shapes future behavior.")
    lemmas = [item["lemma"] for item in items]
    assert "memory" in lemmas
    assert "shape" in lemmas
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest apps/worker/tests/test_vocab.py -v`
Expected: FAIL because vocabulary extractor is missing

- [ ] **Step 3: Write minimal implementation**

Implement:

- lemma extraction
- POS-based filtering
- collocation candidate generation
- importance scoring heuristics
- dictionary hook for future meaning enrichment

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest apps/worker/tests/test_vocab.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/worker
git commit -m "feat: add vocabulary and collocation analysis"
```

### Task 10: Generate Annotation Drafts

**Files:**
- Create: `apps/worker/src/analyze/annotations.py`
- Test: `apps/worker/tests/test_annotations.py`

- [ ] **Step 1: Write the failing test**

Create `apps/worker/tests/test_annotations.py`:

```python
from onestop.analyze.annotations import build_annotation_drafts

def test_build_annotation_drafts_creates_grammar_and_vocab_slots():
    drafts = build_annotation_drafts(
        chunk_text="The way we remember",
        syntax_label="noun_clause",
        vocab_items=[{"lemma": "way"}],
    )
    kinds = [draft["type"] for draft in drafts]
    assert "grammar" in kinds
    assert "vocab" in kinds
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest apps/worker/tests/test_annotations.py -v`
Expected: FAIL because annotation draft builder is missing

- [ ] **Step 3: Write minimal implementation**

Implement:

- grammar draft slot creation
- vocab draft slot creation
- decode tag slot creation using visual system only
- default color family mapping

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest apps/worker/tests/test_annotations.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/worker
git commit -m "feat: add annotation draft generation"
```

### Task 11: Persist Worker Results

**Files:**
- Create: `apps/worker/src/persist/save_analysis.py`
- Test: `apps/worker/tests/test_save_analysis.py`

- [ ] **Step 1: Write the failing test**

Create `apps/worker/tests/test_save_analysis.py`:

```python
from onestop.persist.save_analysis import normalize_document_result

def test_normalize_document_result_contains_sentences_chunks_and_annotations():
    result = normalize_document_result({"sentences": [], "chunks": [], "annotations": []})
    assert set(result.keys()) >= {"sentences", "chunks", "annotations"}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest apps/worker/tests/test_save_analysis.py -v`
Expected: FAIL because persistence module is missing

- [ ] **Step 3: Write minimal implementation**

Implement:

- normalization layer
- upsert logic for sentences, chunks, annotations, vocab items
- processing state transitions

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest apps/worker/tests/test_save_analysis.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/worker packages/db
git commit -m "feat: persist analysis results"
```

### Task 12: Build the Document List and Status Dashboard

**Files:**
- Create: `apps/web/src/app/documents/page.tsx`
- Create: `apps/web/src/components/documents/document-table.tsx`
- Test: `apps/web/src/components/documents/document-table.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `apps/web/src/components/documents/document-table.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { DocumentTable } from "./document-table";

it("renders processing state and run mode", () => {
  render(<DocumentTable documents={[{
    id: "1",
    title: "고2 2025 6월 문제",
    processingState: "draft_ready",
    runMode: "review_before_export",
  }]} />);
  expect(screen.getByText("draft_ready")).toBeInTheDocument();
  expect(screen.getByText("review_before_export")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter web test document-table`
Expected: FAIL because component is missing

- [ ] **Step 3: Write minimal implementation**

Implement:

- document list page
- processing state badges
- run mode labels
- links to review/export pages

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter web test document-table`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/web
git commit -m "feat: add document dashboard"
```

### Task 13: Build the Two-Panel Editing Workspace

**Files:**
- Create: `apps/web/src/app/documents/[documentId]/page.tsx`
- Create: `apps/web/src/components/editor/print-canvas.tsx`
- Create: `apps/web/src/components/editor/annotation-editor.tsx`
- Create: `apps/web/src/components/editor/chunk-list.tsx`
- Test: `apps/web/src/components/editor/annotation-editor.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `apps/web/src/components/editor/annotation-editor.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { AnnotationEditor } from "./annotation-editor";

it("shows grammar and vocabulary controls for the selected chunk", () => {
  render(<AnnotationEditor chunk={{
    id: "chunk_1",
    text: "The way we remember",
    annotations: [
      { id: "a1", type: "grammar", text: "주어구" },
      { id: "a2", type: "vocab", text: "기억하는 방식" },
    ],
  }} />);
  expect(screen.getByDisplayValue("주어구")).toBeInTheDocument();
  expect(screen.getByDisplayValue("기억하는 방식")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter web test annotation-editor`
Expected: FAIL because editor components are missing

- [ ] **Step 3: Write minimal implementation**

Implement:

- left print-preview canvas
- chunk click selection
- right-side annotation editor
- grammar/vocab/decode toggles
- visibility and ordering controls

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter web test annotation-editor`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/web
git commit -m "feat: add annotation editing workspace"
```

### Task 14: Implement Color Presets and Decode Visual Mapping

**Files:**
- Create: `apps/web/src/lib/presets/color-presets.ts`
- Create: `apps/web/src/components/editor/color-legend.tsx`
- Test: `apps/web/src/lib/presets/color-presets.test.ts`

- [ ] **Step 1: Write the failing test**

Create `apps/web/src/lib/presets/color-presets.test.ts`:

```ts
import { defaultColorPreset } from "./color-presets";

it("maps grammar to a red family and vocab to a blue family", () => {
  expect(defaultColorPreset.grammar.base).toMatch(/#|rgb/);
  expect(defaultColorPreset.vocab.base).toMatch(/#|rgb/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter web test color-presets`
Expected: FAIL because preset module is missing

- [ ] **Step 3: Write minimal implementation**

Implement:

- grammar red family palette
- vocabulary blue family palette
- decode visual legend
- teacher preset save/load support

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter web test color-presets`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/web packages/contracts
git commit -m "feat: add color presets and decode visual mapping"
```

### Task 15: Implement Print Templates and PDF Rendering

**Files:**
- Create: `packages/print-templates/src/templates/interlinear.ts`
- Create: `packages/print-templates/src/styles/lecture-theme.css`
- Create: `apps/web/src/lib/export/render-pdf.ts`
- Test: `packages/print-templates/src/templates/interlinear.test.ts`

- [ ] **Step 1: Write the failing test**

Create `packages/print-templates/src/templates/interlinear.test.ts`:

```ts
import { renderInterlinearTemplate } from "./interlinear";

it("renders grammar and vocab annotations into separate visual blocks", () => {
  const html = renderInterlinearTemplate({
    title: "Sample",
    chunks: [{
      text: "The way we remember",
      annotations: [
        { type: "grammar", text: "주어구" },
        { type: "vocab", text: "기억하는 방식" },
      ],
    }],
  });
  expect(html).toContain("주어구");
  expect(html).toContain("기억하는 방식");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @onestop/print-templates test interlinear`
Expected: FAIL because template module is missing

- [ ] **Step 3: Write minimal implementation**

Implement:

- lecture-oriented print HTML template
- interlinear note rendering
- side panels for vocabulary and notes
- PDF rendering adapter

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @onestop/print-templates test interlinear`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/print-templates apps/web
git commit -m "feat: add print template and pdf rendering"
```

### Task 16: Implement Run Modes and Export Flow

**Files:**
- Create: `apps/web/src/lib/run-modes/execute-document-mode.ts`
- Create: `apps/web/src/components/documents/run-mode-selector.tsx`
- Test: `apps/web/src/lib/run-modes/execute-document-mode.test.ts`

- [ ] **Step 1: Write the failing test**

Create `apps/web/src/lib/run-modes/execute-document-mode.test.ts`:

```ts
import { getNextActionForRunMode } from "./execute-document-mode";

it("routes review_before_export documents into the editor", () => {
  expect(getNextActionForRunMode("review_before_export")).toBe("open_editor");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter web test execute-document-mode`
Expected: FAIL because mode handler is missing

- [ ] **Step 3: Write minimal implementation**

Implement:

- `draft_only`
- `review_before_export`
- `immediate_export`
- UI selector and server-side branching

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter web test execute-document-mode`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/web packages/contracts
git commit -m "feat: add document run modes"
```

### Task 17: Add End-to-End Review and Export Tests

**Files:**
- Create: `tests/e2e/document-review-export.spec.ts`
- Modify: `apps/web/package.json`
- Test: `tests/e2e/document-review-export.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/e2e/document-review-export.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("teacher can review a document and export a pdf", async ({ page }) => {
  await page.goto("/documents");
  await expect(page.getByText("Documents")).toBeVisible();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm playwright test tests/e2e/document-review-export.spec.ts`
Expected: FAIL because app/test harness is not fully wired

- [ ] **Step 3: Write minimal implementation**

Wire:

- app boot instructions
- seed data or fixture upload
- review flow navigation
- export trigger visibility

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm playwright test tests/e2e/document-review-export.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/e2e apps/web
git commit -m "test: cover review and export flow"
```

### Task 18: Add Operator Documentation

**Files:**
- Modify: `README.md`
- Create: `docs/operator-runbook.md`
- Test: `docs/operator-runbook.md`

- [ ] **Step 1: Write the failing test**

Add a missing-coverage checklist in `docs/operator-runbook.md`:

```md
- upload flow
- processing states
- rerun behavior
- export modes
```

- [ ] **Step 2: Run check to verify documentation is missing**

Run: `rg -n "processing states|export modes" README.md docs || true`
Expected: missing or incomplete operator guidance

- [ ] **Step 3: Write minimal implementation**

Document:

- local setup
- queue/worker startup
- upload behavior
- review modes
- export behavior
- recovery steps for failed jobs

- [ ] **Step 4: Run check to verify docs are present**

Run: `rg -n "processing states|export modes" README.md docs`
Expected: matching lines in documentation

- [ ] **Step 5: Commit**

```bash
git add README.md docs
git commit -m "docs: add operator runbook"
```

## Verification Checklist

Before considering V1 complete, run:

```bash
pnpm --filter @onestop/contracts build
pnpm --filter @onestop/db prisma validate
pnpm --filter web test
pytest apps/worker/tests -v
pnpm --filter @onestop/print-templates test
pnpm playwright test
```

Expected:

- shared types build successfully
- database schema validates
- web unit tests pass
- worker unit tests pass
- print template tests pass
- end-to-end export test passes

## Notes for the Implementer

- Keep chunk-level boundaries stable. Interlinear layout quality depends on those offsets.
- Do not over-automate Decode semantics in V1. Use Decode only as a visual tagging system unless a human adds content.
- Prefer short annotation text. Long notes should be supported, but the default UX should discourage layout-breaking notes.
- Make the `review_before_export` path the safest default for new presets.

## Review Status

Manual review completed in-session against the approved spec at `docs/superpowers/specs/2026-03-24-onestop-analysis-design.md`.

Subagent review was not dispatched because this session did not include explicit permission to delegate to subagents.
