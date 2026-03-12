# AI-Assisted Business Analyst Agent

An LLM-controlled agent that transforms Business Requirements Documents (BRDs) into structured delivery artifacts such as summaries, requirement insights, epics, user stories, diagrams, and API-related specifications.

## Overview

Business analysts, product owners, and delivery teams often spend significant time converting requirement documents into implementation-ready artifacts. This project automates that early analysis phase by reading uploaded BRDs and generating delivery-ready outputs that help teams move faster from idea to execution.

The application now uses an **LLM-controlled orchestration layer** rather than a fixed generation pipeline. Instead of always following the same sequence for every uploaded file, the model first evaluates the document, determines whether it is a valid BRD, assesses its completeness, and then decides which artifact should be generated next.

Sample BRD and supporting QA files are included in this repository so reviewers can test the application quickly without needing to prepare their own inputs.

## Problem Statement

Turning a BRD into usable downstream artifacts is usually a manual, repetitive, and time-consuming activity. Teams often need to:
- read long business documents
- summarize requirements
- identify capabilities and flows
- create epics and user stories
- draw process or specification diagrams
- draft API-related artifacts
- prepare exportable outputs for delivery teams

This project solves that problem by introducing an AI-assisted business analysis agent that dynamically decides what should be generated and in what sequence based on the uploaded document.

## Key Features

- Upload BRD or requirement documents
- Validate whether the uploaded file is actually a BRD / requirements artifact
- Generate executive overview and summary
- Extract business and functional requirements
- Create epics and user stories automatically
- Generate diagrams from identified workflows and system interactions
- Produce API-related specifications when relevant
- Export stories into CSV format
- Download generated outputs as a ZIP package
- LLM-controlled orchestration for non-deterministic workflow routing
- Agent reasoning log / decision visibility

## How the Agent Works

This application is built as an **agentic workflow** rather than a fixed sequential pipeline.

Depending on the uploaded document, the LLM decides:
- whether the uploaded file is actually a BRD
- whether the document needs summarization first
- whether requirement extraction should happen before story generation
- whether the BRD is detailed enough for epics and stories
- whether diagrams are relevant
- whether API-related artifacts are relevant
- whether the document is too weak and the user should provide more detail
- whether outputs should be exported

### Example Decision Flow

1. User uploads a document
2. Document is parsed and preprocessed
3. The LLM validates document type and requirement quality
4. The LLM routes the request to relevant generation steps such as:
   - BRD validation
   - summarization
   - requirement extraction
   - epic generation
   - user story generation
   - diagram generation
   - API specification generation
   - export packaging
5. Outputs are compiled and made available for review and download

Because different documents can trigger different paths, the workflow is not rigidly hardcoded.

## Why This Fits the Assignment

This project demonstrates agentic behavior because:
- the workflow is not fixed end-to-end
- the LLM decides the next action based on the uploaded document
- different documents can trigger different output combinations
- the system dynamically orchestrates multiple downstream generators
- weak or non-BRD documents can be rejected or handled differently instead of being processed blindly

This makes it more than a simple document-to-text generator. It is an LLM-routed business analysis workflow that adapts to the input.

## Example Outputs

- BRD summary
- business overview
- extracted requirements
- epics and user stories
- process and specification diagrams
- API-related specification draft
- CSV export
- ZIP package of generated artifacts

## Sample Inputs

This repository includes sample BRD and supporting QA documents for demonstration and testing purposes.

These files help reviewers understand the expected input format and quickly validate the end-to-end workflow of the agent, including:
- document validation
- summary generation
- epic and story creation
- diagram generation
- API specification generation
- CSV export
- ZIP packaging
- non-BRD rejection behavior

### Sample Files

- `sample_brd_ai_receipt_inventory_manager.pdf`
- `sample_brd_funds_transfer_v1_0.pdf`

### Testing Report

- `qa_report.pdf`

### How to Use the Sample Files

1. Launch the application
2. Upload any file from the `samples/brd/` folder
3. Click **Generate**
4. Review the generated outputs and agent decision flow

### Note

The sample BRD and QA documents are included only for demonstration purposes and do not contain confidential or proprietary business information.

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- HTML5
- CSS3
- Responsive Web UI

### AI / LLM Layer
- Google Gemini
- `@google/genai`
- Gemini Flash family
- LLM-controlled orchestration
- Structured JSON decision routing
- Prompt-engineered workflow control

### Agent Architecture
- Agentic orchestration pattern
- Decision router
- Tool executor
- Workflow state management
- Agent reasoning / decision logging

### BRD / Requirements Processing
- BRD validation
- Requirement extraction
- Summary generation
- Epic generation
- User story generation
- Diagram generation
- API specification / artifact generation

### Export / Output
- CSV generation
- ZIP packaging
- Structured artifact export

### Application Design
- Modular service-based architecture
- Reusable generation services
- State-driven workflow control
- Graceful handling of weak or non-BRD documents
- Backward-compatible integration with existing generators

### Testing / QA
- Manual testing
- Antigravity QA automation
- Regression testing
- LLM control-flow validation
