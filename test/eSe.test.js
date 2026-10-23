import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { interpretarLocal, paraAjustes } from '../src/lib/eSe.js';
import { interpretarComOpenAI } from '../server/interpretar.js';

const base = { contratos: 3000 };

test('desconto em p.p. e crescimento da carteira', () => {
  const i = interpretarLocal('e se eu der 0,5 p.p. de desconto e a carteira crescer 20%?');
  assert.is(i.desconto_pp, 0.5);
  assert.is(i.contratos_pct, 20);
  assert.equal(paraAjustes(i, base), { descontoPP: 0.5, contratosDesconto: 3600 });
});
test('desconto de X% e contratos absolutos', () => {
  const i = interpretarLocal('desconto de 1% com 4.000 contratos');
  assert.equal(paraAjustes(i, base), { descontoPP: 1, contratosDesconto: 4000 });
});
test('inadimplência sobe', () => {
  assert.equal(paraAjustes(interpretarLocal('e se a inadimplência subir 30%?'), base), { choqueInad: 30 });
  assert.equal(paraAjustes(interpretarLocal('25% a mais de inadimplência'), base), { choqueInad: 25 });
});
test('fora do escopo', () => {
  const i = interpretarLocal('qual a cor do logo?');
  assert.ok(i.fora_do_escopo);
  assert.equal(paraAjustes(i, base), {});
});
test('OpenAI: envia schema estrito e lê output_text', async () => {
  let enviado;
  const fetchFn = async (url, opts) => {
    enviado = JSON.parse(opts.body);
    const json = { desconto_pp: 0.5, contratos_pct: null, contratos: null, inadimplencia_pct: null, resumo: 'ok', fora_do_escopo: false };
    return { ok: true, json: async () => ({ output: [{ type: 'message', content: [{ type: 'output_text', text: JSON.stringify(json) }] }] }) };
  };
  const r = await interpretarComOpenAI('0,5 p.p.', { chave: 'x', modelo: 'm', fetchFn });
  assert.is(r.desconto_pp, 0.5);
  assert.is(enviado.model, 'm');
  assert.is(enviado.text.format.strict, true);
});
test('OpenAI: erro HTTP vira exceção', async () => {
  const fetchFn = async () => ({ ok: false, status: 401 });
  try { await interpretarComOpenAI('x', { chave: 'x', modelo: 'm', fetchFn }); assert.unreachable(); }
  catch (e) { assert.ok(e.message.includes('401')); }
});

test.run();
