# app/main.py — API do serviço de resumo de risco do Proprium.
#
#   uvicorn app.main:app --reload --port 8000
#
# Endpoints:
#   GET  /health        — liveness + versão do extrator
#   POST /analyze/text  — analisa o texto do edital (JSON {"texto": "..."})
#   POST /analyze/pdf   — analisa um PDF de edital (multipart, campo "file")
from __future__ import annotations

import io
from dataclasses import asdict

from fastapi import FastAPI, File, HTTPException, UploadFile
from pydantic import BaseModel, Field

from .extractor import EXTRACTOR_VERSION, analisar_paginas, analisar_texto

MAX_PDF_BYTES = 20 * 1024 * 1024  # 20 MB

app = FastAPI(
    title="Proprium — Risk Analyzer",
    description=(
        "Extrai um resumo de risco EXPLICÁVEL do texto de editais de leilão "
        "(ocupação, financiamento, débitos), citando os trechos-fonte. "
        "Informa e organiza; não é parecer jurídico."
    ),
    version=EXTRACTOR_VERSION,
)


class AnalyzeTextIn(BaseModel):
    texto: str = Field(min_length=1, description="Texto integral do edital")


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "extractor_version": EXTRACTOR_VERSION}


@app.post("/analyze/text")
def analyze_text(body: AnalyzeTextIn) -> dict:
    return asdict(analisar_texto(body.texto))


@app.post("/analyze/pdf")
async def analyze_pdf(file: UploadFile = File(...)) -> dict:
    # Import adiado: deixa o serviço subir mesmo sem a dependência de PDF
    # (útil em ambientes que só usam /analyze/text).
    try:
        import pdfplumber
    except ImportError as exc:  # pragma: no cover
        raise HTTPException(
            status_code=501, detail="Suporte a PDF indisponível (instale pdfplumber)"
        ) from exc

    conteudo = await file.read()
    if len(conteudo) > MAX_PDF_BYTES:
        raise HTTPException(status_code=413, detail="PDF acima de 20 MB")

    try:
        paginas: list[tuple[int, str]] = []
        with pdfplumber.open(io.BytesIO(conteudo)) as pdf:
            for i, page in enumerate(pdf.pages, start=1):
                paginas.append((i, page.extract_text() or ""))
    except Exception as exc:
        raise HTTPException(status_code=422, detail="PDF inválido ou ilegível") from exc

    return asdict(analisar_paginas(paginas))
