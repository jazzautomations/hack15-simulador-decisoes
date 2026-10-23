import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { calc, cenario } from '../src/lib/calc.js';

test('fórmula: receita - custo_total', () => {
  const r = calc(50, 2000, 20, 100);
  assert.is(r.custo_total, 4000); assert.is(r.receita, 5000); assert.is(r.lucro, 1000);
});
test('3 cenários diferem', () => {
  const cs = cenario({ preco: 50, fixo: 2000, variavel: 20, quantidade: 100 }, 40, 30);
  assert.ok(cs.base.lucro !== cs.desconto.lucro);
  assert.is(cs.desconto.lucro, 0);
  assert.is(cs.custo_alto.lucro, 0);
});
test('input negativo é rejeitado', () => {
  try { calc(-100, 2000, 20, 100); assert.ok(false); } catch(e) { assert.ok(e.message.includes("inválido")); }
});
test('qtd zero: lucro = -fixo', () => {
  const r = calc(50, 2000, 20, 0); assert.is(r.lucro, -2000); assert.is(r.receita, 0);
});
test('margem = lucro/receita * 100', () => {
  const r = calc(50, 2000, 20, 100); assert.is(Math.round(r.margem), 20);
});

test.run();
