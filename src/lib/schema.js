// Schema de validação para o #15
// Tudo em JavaScript puro: sem validação externa, HTML5 + regras simples
export const validarProduto = (data) => {
  const erros = [];
  const p = Number(data.preco); const q = Number(data.quantidade);
  const f = Number(data.fixo); const v = Number(data.variavel);
  if (data.nome.trim() === "") erros.push("nome é obrigatório");
  if (isNaN(p) || p <= 0) erros.push("preço deve ser maior que 0");
  if (isNaN(q) || q < 0) erros.push("quantidade não pode ser negativa");
  if (isNaN(f) || f < 0) erros.push("custo fixo não pode ser negativo");
  if (isNaN(v) || v < 0) erros.push("custo variável não pode ser negativo");
  return erros.length > 0 ? { ok: false, erros } : { ok: true, erros: [] };
};
