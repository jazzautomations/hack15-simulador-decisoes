// #15 "Explicar diferenças": texto curto sobre os cenários, sempre a partir dos números já calculados.
// Usa /api/explicar (OpenAI, só com chave no .env); sem ela, monta o texto pelas regras abaixo.
import { formatar, formatarPct } from "./analise.js";

// Resumo numérico enviado à IA e usado pelas regras locais
export const resumoCenarios = (resultados) => resultados.map((r) => ({
  cenario: r.label,
  contratos: r.quantidade,
  receita: r.receita,
  custo_total: r.custo_total,
  resultado: r.lucro,
  margem_pct: Math.round(r.margem * 10) / 10,
  variacao_resultado_pct: r.key === "base" ? 0 : r.comp.lucro.pct === null ? null : Math.round(r.comp.lucro.pct * 10) / 10,
  ponto_equilibrio: r.ponto_equilibrio,
  contratos_para_empatar: r.key === "base" ? null : r.comp.volume_empate.valor,
  contratos_para_empatar_pct: r.key === "base" || r.comp.volume_empate.pct === null ? null : Math.round(r.comp.volume_empate.pct * 10) / 10
}));

const moeda = (v) => formatar(v, "moeda").replace(",00", "").replace(/\s/g, " ");

export const explicarLocal = (resumo) => {
  const [atual, ...outros] = resumo;
  const frases = [`Hoje a carteira de ${formatar(atual.contratos, "qtd")} gera ${moeda(atual.resultado)} de resultado no mês.`];
  for (const c of outros) {
    const sentido = c.resultado < atual.resultado ? "cai" : c.resultado > atual.resultado ? "sobe" : "fica";
    let f = `${c.cenario}: o resultado ${sentido} para ${moeda(c.resultado)}`;
    if (c.variacao_resultado_pct !== null && c.resultado !== atual.resultado) f += ` (${formatarPct(c.variacao_resultado_pct)})`;
    if (c.contratos !== atual.contratos) f += `, com ${formatar(c.contratos, "qtd")}`;
    f += ".";
    if (c.contratos_para_empatar !== null && c.resultado < atual.resultado) {
      f += ` Para empatar com hoje, seriam necessários ${formatar(c.contratos_para_empatar, "qtd")} (${formatarPct(c.contratos_para_empatar_pct)}).`;
    } else if (c.contratos_para_empatar === null && c.resultado < atual.resultado) {
      f += " Nenhum volume de contratos compensa: cada contrato novo dá prejuízo.";
    }
    frases.push(f);
  }
  if (outros.length === 2 && outros[0].resultado !== outros[1].resultado) {
    const pior = outros[0].resultado < outros[1].resultado ? outros[0] : outros[1];
    frases.push(`Entre as alternativas, o maior impacto é ${pior.cenario.toLowerCase()}.`);
  }
  return frases;
};

export const explicar = async (resultados) => {
  const resumo = resumoCenarios(resultados);
  try {
    const resp = await fetch("/api/explicar", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cenarios: resumo })
    });
    if (resp.ok) return { frases: (await resp.json()).frases, origem: "IA (OpenAI)" };
  } catch { /* sem servidor de IA: segue local */ }
  return { frases: explicarLocal(resumo), origem: "regras locais (sem IA)" };
};
