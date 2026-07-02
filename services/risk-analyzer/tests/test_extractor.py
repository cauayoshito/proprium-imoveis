# tests/test_extractor.py
# Fixtures SINTÉTICAS com frases típicas de edital, usadas apenas para testar
# as regras de extração — não são dados de imóveis reais.
from app.extractor import (
    EXTRACTOR_VERSION,
    analisar_paginas,
    analisar_texto,
    parse_valor_brl,
)


def test_desocupado_detectado():
    rep = analisar_texto("O imóvel encontra-se desocupado, livre de pessoas e coisas.")
    assert rep.ocupacao == "DESOCUPADO"
    assert any(t.campo == "ocupacao" for t in rep.trechos_fonte)


def test_ocupado_detectado():
    rep = analisar_texto("O imóvel está ocupado por terceiros.")
    assert rep.ocupacao == "OCUPADO"


def test_desocupado_nao_vira_ocupado():
    # "desocupado" contém "ocupado" — o lookbehind deve impedir o falso positivo.
    rep = analisar_texto("Imóvel desocupado.")
    assert rep.ocupacao == "DESOCUPADO"


def test_conflito_vira_desconhecido():
    rep = analisar_texto(
        "O imóvel encontra-se desocupado. Contudo, o anexo informa que está ocupado por terceiros."
    )
    assert rep.ocupacao == "DESCONHECIDO"
    # Os dois trechos conflitantes devem ser citados para o usuário decidir.
    assert sum(1 for t in rep.trechos_fonte if t.campo == "ocupacao") >= 2


def test_sem_informacao_de_ocupacao():
    rep = analisar_texto("Leilão de bem imóvel conforme condições do presente edital.")
    assert rep.ocupacao == "DESCONHECIDO"


def test_nao_aceita_financiamento():
    rep = analisar_texto("A venda será realizada somente à vista, não aceita financiamento.")
    assert rep.aceita_financiamento is False


def test_aceita_financiamento_e_fgts():
    rep = analisar_texto("O arrematante poderá optar pela utilização de FGTS e financiamento habitacional.")
    assert rep.aceita_financiamento is True


def test_negativa_tem_prioridade_sobre_positiva():
    rep = analisar_texto("Não será aceito financiamento em nenhuma hipótese.")
    assert rep.aceita_financiamento is False


def test_divida_iptu_com_valor():
    rep = analisar_texto("Constam débitos de IPTU no valor de R$ 3.500,00, de responsabilidade do arrematante.")
    assert len(rep.dividas) == 1
    assert rep.dividas[0].tipo == "IPTU"
    assert rep.dividas[0].valor == 3500.0


def test_divida_condominio_sem_valor():
    rep = analisar_texto("Há dívidas condominiais em aberto junto à administradora.")
    assert any(d.tipo == "Condomínio" for d in rep.dividas)


def test_livre_de_debitos_nao_gera_divida():
    rep = analisar_texto("O imóvel será entregue livre de débitos e livre de ônus.")
    assert rep.dividas == []
    # Mas conta como campo determinado (aumenta a confiança).
    assert rep.confianca > 0


def test_paginas_sao_citadas():
    rep = analisar_paginas(
        [
            (1, "Condições gerais do leilão."),
            (3, "O imóvel encontra-se desocupado."),
        ]
    )
    trechos = [t for t in rep.trechos_fonte if t.campo == "ocupacao"]
    assert trechos and trechos[0].pagina == 3


def test_confianca_total():
    rep = analisar_texto(
        "Imóvel desocupado. Aceita financiamento habitacional. "
        "Constam débitos de IPTU de R$ 1.200,00."
    )
    assert rep.confianca == 1.0
    assert rep.extractor_version == EXTRACTOR_VERSION


def test_resumo_sempre_tem_disclaimer():
    rep = analisar_texto("Qualquer texto.")
    assert "não é parecer jurídico" in rep.resumo


def test_parse_valor_brl():
    assert parse_valor_brl("3.500,00") == 3500.0
    assert parse_valor_brl("1.234.567,89") == 1234567.89
    assert parse_valor_brl("950") == 950.0
    assert parse_valor_brl("abc") is None
