# Onestop Analysis Design

Date: 2026-03-24
Scope: V1 design for a web-based one-stop mock-exam analysis system built from the existing 5-year exam archive, with no LLM API usage in V1.

## 1. Goal

Build a teacher-facing web system that ingests new `pdf`, `docx`, or `md` exam materials, analyzes the passage with non-LLM methods, and produces high-quality printable PDF handouts.

The core value of V1 is not fully automatic interpretation. The core value is:

- automatic draft generation
- teacher-controlled editing
- premium print output

The system must let the teacher choose the automation level per document:

- draft only
- review before export
- immediate PDF export

## 2. Product Positioning

This is primarily a print-production tool for academy teachers, not a generic archive browser.

The first priority is student-facing print material quality:

- interlinear annotations above the sentence
- phrase/clause-level segmented explanation
- grammar explanation in red family colors
- vocabulary explanation in blue family colors
- decode blocks aligned to the existing Decode color system

The existing mock exam folder structure remains the canonical source archive. The product sits on top of that archive as an analysis and publishing layer.

## 3. V1 Scope

### Included

- ingest `pdf`, `docx`, `md`
- infer metadata such as grade, month, year, and material type
- extract text and segment sentences
- generate phrase/clause chunks
- run POS tagging and basic syntax analysis
- generate vocabulary candidates
- generate collocation candidates
- create annotation draft slots for grammar, vocabulary, and decode sections
- provide a teacher editing UI
- export high-quality printable PDFs
- save reusable presets/templates
- support per-document run mode selection

### Excluded

- LLM-based explanation generation
- automatic Decode-level meaning analysis
- fully autonomous high-quality interpretation
- native HWP generation as the primary export path
- mobile-first workflow

## 4. User Modes

The teacher chooses one of three execution modes per document.

### 4.1 Draft Only

The system parses the source, extracts structure, and prepares annotation candidates, but does not finalize a print file.

Use when:

- the document is important
- the teacher wants high manual control
- the format is unusual

### 4.2 Review Before Export

The system creates a draft and opens the document in the editing workflow. Export happens after teacher confirmation.

Use when:

- the teacher wants speed but still wants to check the result
- the material type is routine

### 4.3 Immediate PDF Export

The system applies stored presets and directly renders a printable PDF.

Use when:

- the document type is standardized
- the preset quality is already trusted

## 5. Information Architecture

The system is composed of three main layers:

1. web application for upload, review, editing, export
2. analysis pipeline for extraction and non-LLM NLP
3. print rendering engine for final PDF output

### 5.1 Web Application

The web application handles:

- uploads
- metadata confirmation
- document review
- phrase/clause-level editing
- preset selection
- export actions
- processing status and re-run controls

### 5.2 Analysis Pipeline

The pipeline handles:

- file intake
- format parsing
- OCR fallback where necessary
- sentence segmentation
- tokenization
- POS tagging
- dependency/basic syntax analysis
- chunk generation
- vocabulary/collocation candidate generation
- draft annotation slot generation

### 5.3 Print Rendering Engine

The rendering engine handles:

- interlinear layout generation
- highlight placement
- side panels and teacher notes
- color application rules
- print-safe PDF rendering

## 6. Editing Experience

The editing UI is a two-panel workspace.

### 6.1 Left Panel: Print Canvas

Shows the page nearly as it will appear in the final PDF:

- main passage text
- phrase/clause highlights
- interlinear notes above the corresponding text
- side boxes for vocabulary, notes, and decode references

### 6.2 Right Panel: Annotation Editor

Lets the teacher modify:

- grammar note text
- vocabulary note text
- highlight ranges
- annotation order
- visibility on/off
- section inclusion
- teacher-only note blocks

The teacher should be able to click a chunk on the left and edit its properties on the right.

## 7. Annotation System

The annotation model must operate at the chunk level, not only at the sentence level.

This is required because the target print style uses multiple short explanations above one sentence.

Each chunk can hold one or more annotation entries:

- grammar
- vocabulary
- decode

Each annotation has:

- content
- type
- display color family
- position priority
- visibility flag

## 8. Visual Language

The print style is lecture-oriented, color-partitioned, and optimized for student readability.

### 8.1 Color Rules

- grammar explanation: red family
- vocabulary explanation: blue family
- decode blocks: follow the established Decode scheme

### 8.2 Decode Color Mapping Reference

Based on the current Decode master:

- blue: core claim / main sentence
- green: paraphrasing
- yellow: example / evidence
- red: contrast / reversal
- orange: supplement / transition

V1 should use this mapping as a visual system for layout and teacher tagging, even if V1 does not automatically generate Decode meaning analysis.

### 8.3 Print Principle

The layout must favor:

- high scanability
- clear visual grouping
- controlled color usage
- premium academy handout aesthetics

It must avoid:

- dense gray blocks of text
- uncontrolled color noise
- fragile layouts that break under long notes

## 9. Data Model

The core database entities are:

### 9.1 documents

- source file metadata
- inferred grade/month/year/type
- processing state
- chosen run mode
- selected preset

### 9.2 sentences

- document relation
- sentence order
- original text
- optional translation draft
- sentence-level role tag

### 9.3 chunks

- sentence relation
- start/end offsets
- chunk text
- syntax labels
- highlight style
- display ordering data

### 9.4 annotations

- chunk relation
- annotation type
- annotation text
- color family
- visibility
- teacher revision state

### 9.5 vocabulary_items

- lemma
- surface form
- POS
- meaning candidates
- collocation candidates
- importance level
- source sentence/chunk relation

### 9.6 exports

- rendered file path
- template version
- export timestamp
- whether teacher-reviewed

## 10. Ingestion Pipeline

The processing flow is:

1. intake
2. extraction
3. analysis
4. layout preparation
5. export or review handoff

### 10.1 Intake

Input methods:

- upload from web
- watched folder drop

The intake stage infers:

- grade
- month
- year
- material type

The system should use both filename patterns and internal content clues.

### 10.2 Extraction

- `pdf`: text extraction first, OCR fallback if needed
- `docx`: paragraph/XML extraction
- `md`: direct structural parse

### 10.3 Analysis

- sentence segmentation
- tokenization
- POS tagging
- basic syntax/dependency parsing
- phrase/clause chunk candidate generation
- vocabulary and collocation candidate generation

### 10.4 Layout Preparation

- assign grammar/vocab/decode note slots
- map color families
- prepare print-safe line layout

### 10.5 Output Routing

Based on selected mode:

- save as draft only
- open in review flow
- render immediate PDF

## 11. Recommended Technical Stack

### 11.1 Web

- Next.js for the main application

### 11.2 API / Processing

- Python-based analysis workers
- API either in Next.js or separated FastAPI service

### 11.3 Storage

- PostgreSQL for application data
- filesystem or object storage for originals and exports

### 11.4 Queue

- Redis + worker model for async processing

### 11.5 Rendering

- HTML/CSS print composition
- server-side PDF rendering from HTML

### 11.6 NLP

- open-source English NLP for POS and syntax
- rule-based chunking layer
- dictionary/corpus-based vocabulary and collocation support

## 12. Why This Is Feasible Without LLM in V1

The following are feasible without LLM:

- structured ingest
- metadata inference
- text extraction
- sentence segmentation
- POS tagging
- basic syntax analysis
- phrase/clause chunking
- vocabulary/collocation candidate generation
- teacher-editable annotation drafting
- premium PDF output

The following are intentionally deferred:

- human-like interpretive explanation
- reliable automatic discourse analysis
- automatic Decode-quality meaning structure generation

Therefore, V1 succeeds by automating preparation and formatting, not deep semantic interpretation.

## 13. Risks and Controls

### 13.1 Parsing Instability

Risk:

- PDFs may have broken text order or OCR noise

Control:

- preserve raw extraction
- allow chunk-level manual correction
- support re-run with alternate parser/OCR path

### 13.2 Chunk Layout Breakage

Risk:

- interlinear annotation can become visually unstable with long notes

Control:

- enforce note length guidance
- support overflow handling
- allow fallback to side note style per chunk

### 13.3 Over-Automation

Risk:

- immediate export may produce poor materials on hard passages

Control:

- keep mode selection explicit
- allow teacher-specific trusted presets
- default new document types to review-before-export

## 14. Delivery Strategy

Build V1 in this order:

1. ingest and document registration
2. sentence/chunk data model
3. POS/basic syntax analysis
4. vocabulary and collocation candidate generation
5. editing workspace
6. print template engine
7. presets and execution modes
8. reprocessing and admin controls

## 15. Success Criteria

V1 is successful if:

- teachers can ingest new exam materials without manual folder restructuring
- the system produces useful chunk-level grammar/vocabulary drafts
- the teacher can quickly revise and export a polished handout
- the final PDF feels like a premium academy print, not a generic software report

## 16. Immediate Next Step

After this design is approved, the next artifact should be an implementation plan covering:

- database schema
- parser pipeline
- editor interaction model
- print rendering strategy
- milestone breakdown
