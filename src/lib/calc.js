// #15 Simulador de decisões - validação de fórmulas + input
const validar = (v, nome) => {
  const n = Number(v);
  if (isNaN(n) || n < 0) throw new Error(`${nome} inválido: ${v}`);
  return n;
};
// custo_total = fixo + variável * quantidade
// lucro = receita - custo_total = (preço * quantidade) - custo_total
export const calc = (preco, fixo, variavel, quantidade) => {
  const p = validar(preco, "preço"), f = validar(fixo, "fixo"),
        v = validar(variavel, "variável"), q = validar(quantidade, "quantidade");
  const custo_total = f + (v * q);
  const receita = p * q;
  const lucro = receita - custo_total;
  return {
    custo_total,
    receita,
    lucro,
    margem: (receita !== 0 ? (lucro / receita) * 100 : 0)
  };
};
export const cenario = (base, preco_ajustado, custo_variavel_ajustado) => ({
  base: calc(base.preco, base.fixo, base.variavel, base.quantidade),
  desconto: calc(preco_ajustado ?? base.preco, base.fixo, base.variavel, base.quantidade),
  custo_alto: calc(base.preco, base.fixo, custo_variavel_ajustado ?? base.variavel, base.quantidade)
});
