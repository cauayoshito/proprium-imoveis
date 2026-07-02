# Proprium — Risk Analyzer

Microserviço Python (FastAPI) que gera o **resumo de risco** de editais de
leilão: ocupação, aceitação de financiamento e débitos mencionados — **citando
os trechos do edital** que embasam cada campo (explicável e auditável).

Abordagem v0: **regras + regex** sobre o texto (sem LLM, sem chamadas
externas, custo zero por análise). O campo `extractor_version` acompanha cada
resultado para rastreabilidade quando as regras evoluírem.

> ⚠️ O resumo é automático e **não é parecer jurídico**. Confira sempre o
> edital original.

## Rodando

```bash
cd services/risk-analyzer
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Endpoints

| Método | Rota            | Entrada                          |
| ------ | --------------- | -------------------------------- |
| GET    | `/health`       | —                                |
| POST   | `/analyze/text` | JSON `{ "texto": "..." }`        |
| POST   | `/analyze/pdf`  | multipart, campo `file` (≤20 MB) |

Resposta (ambos os `analyze`): campos compatíveis com o modelo `RiskAnalysis`
do Prisma — `ocupacao`, `aceita_financiamento`, `dividas[]`, `resumo`,
`trechos_fonte[]` (com página, quando PDF), `confianca`, `extractor_version`.

## Testes

```bash
pip install pytest
pytest
```

## Evolução planejada

- Mais padrões (praça única/segunda praça, comissão do leiloeiro, prazos).
- spaCy (pt) para sentenciação e entidades mais robustas.
- Classificador ML treinado quando houver corpus rotulado de editais.
