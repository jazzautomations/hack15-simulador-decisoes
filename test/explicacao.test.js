import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { analisar, comparar } from '../src/lib/analise.js';
import { explicarLocal, resumoCenarios } from '../src/lib/explicacao.js';
import { explicarComOpenAI, numerosConferem, numerosNoTexto } from '../server/explicar.js';

// Carteira do README com 3.600 contratos no desconto
const atual = { preco: 200, quantidade: 3000, fixo: 150000, variavel: 120 };
const cen = [
  { key: 'base', label: 'Atual', entradas: atual },
  { key: 'desconto', label: 'Desconto de 0,5 p.p.', entradas: { ...atual, preco: 175, quantidade: 3600 } },
  { key: 'custo', label: 'Inadimplência +50%', entradas: { ...atual, variavel: 145 } }
].map((c) => ({ ...c, ...analisar(c.entradas), quantidade: c.entradas.quantidade, comp: comparar(atual, c.entradas) }));
const resumo = resumoCenarios(cen);

test('regras locais citam resultado, variação e contratos para empatar', () => {
  const f = explicarLocal(resumo);
  assert.is(f[0], 'Hoje a carteira de 3.000 contratos gera R$ 90.000 de resultado no mês.');
  assert.ok(f[1].includes('cai para R$ 48.000 (−46,7%), com 3.600 contratos'));
  assert.ok(f[1].includes('4.364 contratos (+45,5%)'));
  assert.ok(f[3].includes('inadimplência +50%'));
});
test('regras locais só citam números do resumo', () => {
  assert.ok(numerosConferem(explicarLocal(resumo), resumo));
});
test('números no texto em formato pt-BR', () => {
  assert.equal(numerosNoTexto('R$ 90.000 caiu 46,7% para 4.364'), [90000, 46.7, 4364]);
});
test('rejeita número que não está no cálculo', () => {
  assert.not.ok(numerosConferem(['O resultado cai para R$ 47.500.'], resumo));
  assert.ok(numerosConferem(['O resultado cai para R$ 48.000 (−46,7%).'], resumo));
});
const resposta = (frases) => async () => ({ ok: true, json: async () => ({ output: [{ type: 'message', content: [{ type: 'output_text', text: JSON.stringify({ frases }) }] }] }) });
test('OpenAI: aceita texto com números conferidos', async () => {
  const r = await explicarComOpenAI(resumo, { chave: 'x', modelo: 'm', fetchFn: resposta(['Com desconto, o resultado vai a R$ 48.000.']) });
  assert.is(r.frases.length, 1);
});
test('OpenAI: rejeita número inventado', async () => {
  try { await explicarComOpenAI(resumo, { chave: 'x', modelo: 'm', fetchFn: resposta(['Lucro de R$ 1.234.567.']) }); assert.unreachable(); }
  catch (e) { assert.ok(e.message.includes('fora do cálculo')); }
});

test.run();
