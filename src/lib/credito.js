// #15 nicho Fintech de crédito: mapeia a carteira na fórmula genérica de calc.js
// preço = receita/contrato/mês · quantidade = contratos ativos
// variável = funding + perda esperada + cobrança · fixo = time + tecnologia + compliance
import { calc } from "./calc.js";

// Política "sem IA": perda esperada tabelada por faixa de score (R$/contrato/mês, dados fictícios)
export const PERDA_POR_FAIXA = { A: 20, B: 50, C: 110 };

const cents = (x) => Math.round(x * 100) / 100;

export const perdaEsperada = (mix) => {
  const faixas = Object.keys(PERDA_POR_FAIXA);
  let soma = 0, total = 0;
  for (const f of faixas) {
    const pct = Number(mix?.[f]);
    if (isNaN(pct) || pct < 0 || pct > 100) throw new Error(`mix ${f} inválido: ${mix?.[f]}`);
    soma += pct; total += pct * PERDA_POR_FAIXA[f];
  }
  if (Math.abs(soma - 100) > 1e-9) throw new Error(`mix da carteira deve somar 100% (soma ${soma}%)`);
  return cents(total / 100);
};

// descontoPP: pontos percentuais/mês sobre o contrato médio · choqueInad: % de aumento da perda
export const cenariosCredito = (b, { descontoPP = 0.5, choqueInad = 50 } = {}) => {
  if (Number(descontoPP) < 0 || Number(choqueInad) < 0) throw new Error("ajuste inválido: use valores ≥ 0");
  const perda = perdaEsperada(b.mix);
  const variavel = cents(b.funding + perda + b.cobranca);
  const receitaDesconto = cents(b.receita - b.contrato * descontoPP / 100);
  const perdaAlta = cents(perda * (1 + choqueInad / 100));
  const variavelAlta = cents(b.funding + perdaAlta + b.cobranca);
  if (receitaDesconto < 0) throw new Error("desconto maior que a receita por contrato");
  return {
    perda, variavel, receitaDesconto, perdaAlta, variavelAlta,
    atual: calc(b.receita, b.fixo, variavel, b.contratos),
    desconto: calc(receitaDesconto, b.fixo, variavel, b.contratos),
    inadimplencia: calc(b.receita, b.fixo, variavelAlta, b.contratos)
  };
};

// variação % do resultado vs cenário atual (null se o atual for zero)
export const variacao = (lucro, lucroAtual) =>
  lucroAtual === 0 ? null : Math.round(((lucro - lucroAtual) / Math.abs(lucroAtual)) * 100);
