// Schema de validação para o #15 (nicho fintech de crédito)
// Tudo em JavaScript puro: sem validação externa, HTML5 + regras simples
const POSITIVOS = { contrato: "contrato médio", receita: "receita por contrato", contratos: "contratos ativos" };
const NAO_NEGATIVOS = { funding: "funding", cobranca: "custo de cobrança", fixo: "custos fixos" };

export const validarCarteira = (data) => {
  const erros = [];
  if (String(data.nome ?? "").trim() === "") erros.push("nome do produto é obrigatório");
  for (const [k, nome] of Object.entries(POSITIVOS)) {
    const n = Number(data[k]); if (data[k] === "" || isNaN(n) || n <= 0) erros.push(`${nome} deve ser maior que 0`);
  }
  for (const [k, nome] of Object.entries(NAO_NEGATIVOS)) {
    const n = Number(data[k]); if (data[k] === "" || isNaN(n) || n < 0) erros.push(`${nome} não pode ser negativo`);
  }
  const mix = ["A", "B", "C"].map((f) => data.mix?.[f] === "" ? NaN : Number(data.mix?.[f]));
  if (mix.some((x) => isNaN(x) || x < 0 || x > 100)) erros.push("cada faixa do mix deve ficar entre 0% e 100%");
  else if (Math.abs(mix.reduce((a, b) => a + b, 0) - 100) > 1e-9) erros.push("mix A/B/C deve somar 100%");
  return erros.length > 0 ? { ok: false, erros } : { ok: true, erros: [] };
};
