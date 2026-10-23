// #15 "E se…": transforma uma pergunta em ajustes de cenário.
// Usa /api/interpretar (OpenAI, só com chave no .env) e cai no interpretador local sem ela.
// O resultado é só uma sugestão: a tela pede confirmação antes de aplicar.

// Formato comum às duas fontes (igual ao JSON Schema de server/interpretar.js)
// { desconto_pp, contratos_pct, contratos, inadimplencia_pct, resumo, fora_do_escopo }

const n = (s) => Number(String(s).replace(/\./g, "").replace(",", "."));
const dec = (s) => Number(String(s).replace(",", "."));
const NUM = "(\\d+(?:[.,]\\d+)?)";

export const interpretarLocal = (texto) => {
  const t = texto.toLowerCase();
  const achar = (...res) => {
    for (const re of res) { const m = t.match(re); if (m) return m[1]; }
    return null;
  };
  const desconto = achar(
    new RegExp(`desconto\\s+(?:de\\s+)?${NUM}\\s*(?:p\\.?\\s*p\\.?|pontos?|%)`),
    new RegExp(`${NUM}\\s*(?:p\\.?\\s*p\\.?|pontos? percentuais?)\\s+(?:de\\s+)?desconto`),
    new RegExp(`(?:baixar|reduzir|cortar)\\s+(?:a\\s+)?taxa\\s+(?:em\\s+)?${NUM}`)
  );
  const contratosPct = achar(
    new RegExp(`${NUM}\\s*%\\s+(?:a\\s+)?mais\\s+(?:de\\s+)?contratos`),
    new RegExp(`contratos?\\s+(?:sobem|subir|aumentam|aumentar|crescem|crescer)\\s+(?:em\\s+)?${NUM}\\s*%`),
    new RegExp(`(?:carteira|base)\\s+(?:cresce|crescer|aumenta|aumentar)\\s+(?:em\\s+)?${NUM}\\s*%`)
  );
  const contratosAbs = contratosPct ? null : achar(/(\d{1,3}(?:\.\d{3})+|\d+)\s+contratos/);
  const inad = achar(
    new RegExp(`inadimpl[eê]ncia\\s+(?:sobe|subir|aumenta|aumentar|cresce|crescer|piora|piorar)?\\s*(?:em\\s+|de\\s+|\\+\\s*)?${NUM}\\s*%`),
    new RegExp(`${NUM}\\s*%\\s+(?:a\\s+mais\\s+)?(?:de\\s+|na\\s+)?inadimpl[eê]ncia`)
  );

  const r = {
    desconto_pp: desconto === null ? null : dec(desconto),
    contratos_pct: contratosPct === null ? null : dec(contratosPct),
    contratos: contratosAbs === null ? null : n(contratosAbs),
    inadimplencia_pct: inad === null ? null : dec(inad)
  };
  const vazio = Object.values(r).every((v) => v === null);
  return { ...r, resumo: vazio ? "Não reconheci desconto, contratos ou inadimplência na pergunta." : "", fora_do_escopo: vazio };
};

// Converte a interpretação em novos valores de ajuste (só os campos citados)
export const paraAjustes = (i, base) => {
  const out = {};
  if (i.desconto_pp !== null) out.descontoPP = i.desconto_pp;
  if (i.contratos !== null) out.contratosDesconto = Math.round(i.contratos);
  else if (i.contratos_pct !== null) out.contratosDesconto = Math.round(base.contratos * (1 + i.contratos_pct / 100));
  if (i.inadimplencia_pct !== null) out.choqueInad = i.inadimplencia_pct;
  return out;
};

export const interpretar = async (texto) => {
  try {
    const resp = await fetch("/api/interpretar", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ texto })
    });
    if (resp.ok) return { ...(await resp.json()), origem: "IA (OpenAI)" };
  } catch { /* sem servidor de IA: segue local */ }
  return { ...interpretarLocal(texto), origem: "regras locais (sem IA)" };
};
