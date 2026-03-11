# AI-Assisted Business Analyst Agent

An LLM-driven agent that transforms Business Requirements Documents (BRDs) into structured delivery artifacts such as summaries, epics, user stories, diagrams, and API specifications.

## Overview

Business analysts, product owners, and delivery teams often spend significant time converting requirement documents into actionable implementation artifacts. This project automates that early analysis phase by reading BRDs and generating delivery-ready outputs that help teams move faster from idea to execution.

The application uses an LLM-based decision layer to determine the workflow dynamically based on the structure, content, and completeness of the uploaded document.

Sample BRD files are included in this repository so reviewers can test the application quickly without needing to prepare their own inputs.

## Problem Statement

Turning a BRD into usable downstream artifacts is usually a manual, repetitive, and time-consuming activity. Teams often need to read long documents, summarize them, identify business capabilities, create epics and user stories, draw process diagrams, and draft API contracts before development can begin.

This project solves that problem by introducing an AI-assisted agent that reads a BRD and decides what outputs should be generated and in what sequence.

## Key Features

- Upload BRD or requirement documents
- Generate executive overview and summary
- Extract business and functional requirements
- Create epics and user stories automatically
- Generate diagrams from identified workflows and system interactions
- Produce API specifications from inferred business flows
- Export stories into CSV format
- Download all generated outputs as a ZIP package
- LLM-driven orchestration for non-deterministic control flow

## How the Agent Works

This application is built as an agentic workflow rather than a fixed sequential pipeline.

Depending on the uploaded document, the LLM decides:
- whether the document first needs summarization
- whether requirements are complete enough for story generation
- whether diagrams should be created
- whether API specs are relevant for the detected use case
- whether outputs should be packaged for export

### Example Decision Flow

1. User uploads a BRD
2. Document is parsed and preprocessed
3. The LLM evaluates document structure, business intent, and requirement coverage
4. The LLM routes the request to relevant generation steps such as:
   - summarization
   - requirement extraction
   - epic and story generation
   - diagram generation
   - API specification generation
   - export packaging
5. Outputs are compiled and made available for download

Because different documents can trigger different paths, the flow is not rigidly hardcoded.

## Why This Fits the Assignment

This project demonstrates agentic behavior because:
- the workflow is not fixed end-to-end
- the LLM decides the next action based on the uploaded BRD
- different documents can trigger different output combinations
- the system dynamically orchestrates multiple downstream generators

This makes it more than a simple prompt-based application. It is an LLM-routed workflow that adapts to the input.

## Example Outputs

- BRD summary
- business overview
- epics and user stories
- process and specification diagrams
- API specification draft
- CSV export for stories
- ZIP bundle containing all generated assets

## Sample Inputs

This repository includes sample BRD files for demonstration and testing purposes.

These files help reviewers understand the expected input format and quickly validate the end-to-end workflow of the agent, including:
- document understanding
- summary generation
- epic and story creation
- diagram generation
- API specification generation
- CSV export
- ZIP download packaging

### Sample Files

- `Sample_BRD_Funds_Transfer_v1.0.pdf`
- `Sample_BRD_AI Receipt Inventory Manager.pdf`

### How to Use the Sample Files

1. Launch the application
2. Upload any file 
3. Click **Generate**
4. Review the generated outputs

## Tech Stack

Update this section to match your actual implementation.

Example stack:
- Python
- FastAPI or Flask
- OpenAI, Azure OpenAI, or Gemini
- LangChain or LangGraph
- Pydantic
- Pandas
- Mermaid, PlantUML, or other diagram generation tools
- React, Next.js, or Streamlit
- Docker

