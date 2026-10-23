// #15 Análise de cenários (carteira de crédito: preço = receita/contrato, qtd = contratos): diferenças vs. atual, ponto de equilíbrio,
// volume para empatar e memória de cálculo. Usa as mesmas fórmulas de calc.js.
import { calc } from "./calc.js";

// Tolerância para o ceil não somar 1 unidade por erro de ponto flutuante
const teto = (x) => Math.ceil(x - 1e-9);

// e = { preco, quantidade, fixo, variavel }
export const analisar = (e) => {
  const r = calc(e.preco, e.fixo, e.variavel, e.quantidade);
  const mc_unit = e.preco - e.variavel;
  return {
    ...r,
    custo_variavel: e.variavel * e.quantidade,
    custo_fixo: Number(e.fixo),
    mc_unit,
    ponto_equilibrio: mc_unit > 0 ? teto(e.fixo / mc_unit) : null
  };
};

// Quantidade que o cenário precisa vender para igualar o lucro do atual
export const volumeEmpate = (atual, cen) => {
  const mc = cen.preco - cen.variavel;
  if (mc <= 0) return null;
  return Math.max(0, teto((analisar(atual).lucro + Number(cen.fixo)) / mc));
};

const dif = (valor, base) => {
  if (valor === null || base === null) return { valor, delta: null, pct: null };
  const delta = valor - base;
  return { valor, delta, pct: base === 0 ? null : (delta / Math.abs(base)) * 100 };
};

export const comparar = (atual, cen) => {
  const a = analisar(atual), c = analisar(cen);
  const out = {};
  for (const k of Object.keys(c)) out[k] = dif(c[k], a[k]);
  out.volume_empate = dif(volumeEmpate(atual, cen), Number(atual.quantidade));
  return out;
};

// Linhas da tabela comparativa. menor_melhor: aumento é ruim (vermelho).
export const LINHAS = [
  { id: "receita", rotulo: "Receita", formato: "moeda" },
  { id: "custo_variavel", rotulo: "Custo variável", formato: "moeda", menor_melhor: true },
  { id: "custo_fixo", rotulo: "Custo fixo", formato: "moeda", menor_melhor: true },
  { id: "custo_total", rotulo: "Custo total", formato: "moeda", menor_melhor: true },
  { id: "lucro", rotulo: "Resultado do mês", formato: "moeda", destaque: true },
  { id: "margem", rotulo: "Margem", formato: "pct" },
  { id: "ponto_equilibrio", rotulo: "Ponto de equilíbrio", formato: "qtd", menor_melhor: true },
  { id: "volume_empate", rotulo: "Contratos para empatar com o atual", formato: "qtd", menor_melhor: true }
];

const num = (v) => Number(v).toLocaleString("pt-BR", { maximumFractionDigits: 2 });

// Fórmula da linha com os números substituídos
export const memoria = (id, cen, atual) => {
  const r = analisar(cen);
  const P = num(cen.preco), Q = num(cen.quantidade), CV = num(cen.variavel), CF = num(cen.fixo);
  const semMc = "Sem valor: receita/contrato ≤ custo/contrato, cada contrato novo dá prejuízo";
  switch (id) {
    case "receita": return `Receita = receita/contrato × contratos = ${P} × ${Q} = ${num(r.receita)}`;
    case "custo_variavel": return `Custo variável = custo/contrato × contratos = ${CV} × ${Q} = ${num(r.custo_variavel)}`;
    case "custo_fixo": return `Custo fixo = ${CF} (informado)`;
    case "custo_total": return `Custo total = fixo + variável = ${CF} + ${num(r.custo_variavel)} = ${num(r.custo_total)}`;
    case "lucro": return `Resultado = receita − custo total = ${num(r.receita)} − ${num(r.custo_total)} = ${num(r.lucro)}`;
    case "margem": return r.receita === 0
      ? "Sem valor: receita igual a zero"
      : `Margem = resultado ÷ receita = ${num(r.lucro)} ÷ ${num(r.receita)} = ${num(r.margem)}%`;
    case "ponto_equilibrio": return r.ponto_equilibrio === null
      ? semMc
      : `Equilíbrio = ⌈fixo ÷ (receita/contrato − custo/contrato)⌉ = ⌈${CF} ÷ ${num(r.mc_unit)}⌉ = ${num(r.ponto_equilibrio)} contratos`;
    case "volume_empate": {
      if (cen === atual) return "Sem valor: este é o cenário de referência";
      const v = volumeEmpate(atual, cen);
      return v === null
        ? semMc
        : `Contratos p/ empatar = ⌈(resultado atual + fixo) ÷ (receita/contrato − custo/contrato)⌉ = ⌈(${num(analisar(atual).lucro)} + ${CF}) ÷ ${num(r.mc_unit)}⌉ = ${num(v)} contratos`;
    }
    default: return "";
  }
};

const BRL = { style: "currency", currency: "BRL" };
export const formatar = (v, formato) => {
  if (v === null || v === undefined) return "—";
  if (formato === "moeda") return v.toLocaleString("pt-BR", BRL);
  if (formato === "pct") return `${num(Math.round(v * 10) / 10)}%`;
  return `${num(v)} contratos`;
};
export const formatarDelta = (v, formato) => {
  if (v === null || v === undefined) return "—";
  if (formato === "pct") v = Math.round(v * 10) / 10; // Δ de margem em pontos percentuais
  const s = formatar(Math.abs(v), formato).replace("%", formato === "pct" ? " p.p." : "%");
  return v > 0 ? `+${s}` : v < 0 ? `−${s}` : s;
};
export const formatarPct = (v) => (v === null ? "—" : `${v > 0 ? "+" : v < 0 ? "−" : ""}${num(Math.abs(Math.round(v * 10) / 10))}%`);
