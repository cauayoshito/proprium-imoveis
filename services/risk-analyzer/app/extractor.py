# app/extractor.py
# Extrator de risco v0 (regras + regex). Filosofia: EXPLICÁVEL — cada campo
# extraído cita o trecho do edital que o embasa. Quando há conflito ou nada é
# encontrado, o campo fica como desconhecido (o Proprium informa, não opina).
#
# Sem LLM e sem chamadas externas: roda offline e a custo zero.
from __future__ import annotations

import re
import unicodedata
from dataclasses import dataclass, field

EXTRACTOR_VERSION = "rules-0.1.0"

# ---------------------------------------------------------------------------
# Normalização e utilidades
# ---------------------------------------------------------------------------


def _sem_acentos(texto: str) -> str:
    return "".join(
        c for c in unicodedata.normalize("NFD", texto) if unicodedata.category(c) != "Mn"
    )


def _normalizar(texto: str) -> str:
    """minúsculas + sem acentos, para casar padrões de forma robusta."""
    return _sem_acentos(texto).lower()


def _frases(texto: str) -> list[str]:
    """Divide o texto em frases simples (ponto, ponto-e-vírgula ou quebra)."""
    partes = re.split(r"(?<=[.;])\s+|\n+", texto)
    return [p.strip() for p in partes if p.strip()]


def parse_valor_brl(bruto: str) -> float | None:
    """Converte '3.500,00' (pt-BR) em 3500.0."""
    limpo = bruto.strip().replace(".", "").replace(",", ".")
    try:
        return float(limpo)
    except ValueError:
        return None


_RE_VALOR = re.compile(r"r\$\s*([\d.]+(?:,\d{1,2})?)")

# ---------------------------------------------------------------------------
# Padrões (sobre texto normalizado: minúsculas, sem acentos)
# ---------------------------------------------------------------------------

_DESOCUPADO = [
    r"\bdesocupado\b",
    r"\blivre de pessoas e coisas\b",
    r"\blivre de ocupacao\b",
    r"\bimovel vago\b",
    r"\bencontra-?se vago\b",
    r"\bdesimpedido\b",
]

# (?<!des) impede que "desocupado" case como "ocupado".
_OCUPADO = [
    r"\b(?<!des)ocupado\b",
    r"\bcom ocupantes?\b",
    r"\bposse precaria\b",
    r"\binvadido\b",
    r"\balugado a terceiros\b",
    r"\blocado\b",
]

_NAO_FINANCIA = [
    r"\bnao aceita financiamento\b",
    r"\bnao sera aceito financiamento\b",
    r"\bvedado o financiamento\b",
    r"\bsomente a vista\b",
    r"\bexclusivamente a vista\b",
    r"\bnao aceita (?:a )?utilizacao de fgts\b",
]

_FINANCIA = [
    r"\baceita financiamento\b",
    r"\badmite financiamento\b",
    r"\bpodera ser financiado\b",
    r"\bfinanciamento habitacional\b",
    r"\butilizacao de fgts\b",
]

# Palavras que indicam frase falando de dívida/ônus.
_DIVIDA_GATILHO = re.compile(
    r"\b(debitos?|dividas?|inadimpl\w+|em atraso|onus)\b"
)
_SEM_DIVIDA = [
    r"\blivre de debitos\b",
    r"\bsem debitos\b",
    r"\bquitado\b",
    r"\blivre de onus\b",
]
_TIPOS_DIVIDA = [
    (re.compile(r"\biptu\b"), "IPTU"),
    (re.compile(r"\bcondomini\w+\b"), "Condomínio"),
]

# ---------------------------------------------------------------------------
# Resultado
# ---------------------------------------------------------------------------


@dataclass
class Trecho:
    campo: str
    trecho: str
    pagina: int | None = None


@dataclass
class Divida:
    tipo: str
    valor: float | None = None
    descricao: str | None = None


@dataclass
class RiskReport:
    ocupacao: str = "DESCONHECIDO"  # OCUPADO | DESOCUPADO | DESCONHECIDO
    aceita_financiamento: bool | None = None
    dividas: list[Divida] = field(default_factory=list)
    resumo: str = ""
    trechos_fonte: list[Trecho] = field(default_factory=list)
    confianca: float = 0.0
    extractor_version: str = EXTRACTOR_VERSION


# ---------------------------------------------------------------------------
# Núcleo
# ---------------------------------------------------------------------------


def _procurar(padroes: list[str], frase_norm: str) -> bool:
    return any(re.search(p, frase_norm) for p in padroes)


def analisar_paginas(paginas: list[tuple[int, str]]) -> RiskReport:
    """Analisa o texto do edital página a página (para citar a página no trecho)."""
    rep = RiskReport()

    achou_desocupado: list[Trecho] = []
    achou_ocupado: list[Trecho] = []
    achou_sem_divida = False

    for num_pagina, texto in paginas:
        for frase in _frases(texto):
            norm = _normalizar(frase)
            trecho_curto = frase if len(frase) <= 300 else frase[:297] + "…"

            # Ocupação — desocupado testado primeiro (padrões mais específicos)
            if _procurar(_DESOCUPADO, norm):
                achou_desocupado.append(Trecho("ocupacao", trecho_curto, num_pagina))
            elif _procurar(_OCUPADO, norm):
                achou_ocupado.append(Trecho("ocupacao", trecho_curto, num_pagina))

            # Financiamento — negativas primeiro (são mais específicas)
            if rep.aceita_financiamento is None:
                if _procurar(_NAO_FINANCIA, norm):
                    rep.aceita_financiamento = False
                    rep.trechos_fonte.append(
                        Trecho("aceitaFinanciamento", trecho_curto, num_pagina)
                    )
                elif _procurar(_FINANCIA, norm):
                    rep.aceita_financiamento = True
                    rep.trechos_fonte.append(
                        Trecho("aceitaFinanciamento", trecho_curto, num_pagina)
                    )

            # Dívidas
            if _procurar(_SEM_DIVIDA, norm):
                achou_sem_divida = True
                rep.trechos_fonte.append(Trecho("dividas", trecho_curto, num_pagina))
            elif _DIVIDA_GATILHO.search(norm):
                tipo = "Outros débitos"
                for padrao, nome in _TIPOS_DIVIDA:
                    if padrao.search(norm):
                        tipo = nome
                        break
                valor_m = _RE_VALOR.search(norm)
                valor = parse_valor_brl(valor_m.group(1)) if valor_m else None
                rep.dividas.append(Divida(tipo=tipo, valor=valor, descricao=trecho_curto))
                rep.trechos_fonte.append(Trecho("dividas", trecho_curto, num_pagina))

    # Consolida ocupação: achados conflitantes => DESCONHECIDO (não opinamos).
    if achou_desocupado and not achou_ocupado:
        rep.ocupacao = "DESOCUPADO"
        rep.trechos_fonte.extend(achou_desocupado)
    elif achou_ocupado and not achou_desocupado:
        rep.ocupacao = "OCUPADO"
        rep.trechos_fonte.extend(achou_ocupado)
    elif achou_ocupado and achou_desocupado:
        rep.ocupacao = "DESCONHECIDO"
        rep.trechos_fonte.extend(achou_desocupado + achou_ocupado)

    # Confiança = fração de campos que conseguimos determinar.
    determinados = sum(
        [
            rep.ocupacao != "DESCONHECIDO",
            rep.aceita_financiamento is not None,
            bool(rep.dividas) or achou_sem_divida,
        ]
    )
    rep.confianca = round(determinados / 3, 2)

    rep.resumo = _montar_resumo(rep, achou_sem_divida)
    return rep


def analisar_texto(texto: str) -> RiskReport:
    """Analisa o edital como texto único (sem números de página)."""
    return analisar_paginas([(0, texto)])


def _montar_resumo(rep: RiskReport, sem_divida: bool) -> str:
    """Resumo por template a partir dos achados — nada é inventado."""
    partes: list[str] = []

    if rep.ocupacao == "DESOCUPADO":
        partes.append("O edital indica imóvel desocupado.")
    elif rep.ocupacao == "OCUPADO":
        partes.append("O edital indica imóvel ocupado.")
    else:
        partes.append("Não foi possível determinar a ocupação pelo texto analisado.")

    if rep.aceita_financiamento is True:
        partes.append("Menciona possibilidade de financiamento.")
    elif rep.aceita_financiamento is False:
        partes.append("Indica que NÃO aceita financiamento.")
    else:
        partes.append("Condições de financiamento não identificadas.")

    if rep.dividas:
        tipos = ", ".join(sorted({d.tipo for d in rep.dividas}))
        partes.append(f"Foram mencionados débitos ({tipos}) — confira valores e responsabilidade no edital.")
    elif sem_divida:
        partes.append("O texto menciona ausência de débitos/ônus.")
    else:
        partes.append("Nenhuma menção a débitos foi identificada.")

    partes.append("Confira sempre o edital original; este resumo é automático e não é parecer jurídico.")
    return " ".join(partes)
