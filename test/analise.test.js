import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { analisar, comparar, volumeEmpate, memoria } from '../src/lib/analise.js';

// Carteira fictícia do README: receita R$ 200/contrato, 3.000 contratos, variável R$ 120, fixos R$ 150.000
const atual = { preco: 200, quantidade: 3000, fixo: 150000, variavel: 120 };
const desconto = { ...atual, preco: 175 };        // 0,5 p.p. sobre contrato de R$ 5.000
const inadimplencia = { ...atual, variavel: 145 }; // perda esperada +50%

test('ponto de equilíbrio = ⌈fixo ÷ (receita − custo por contrato)⌉', () => {
  assert.is(analisar(atual).ponto_equilibrio, 1875);   // 150.000 / 80, divisão exata
  assert.is(analisar(desconto).ponto_equilibrio, 2728); // 150.000 / 55 = 2.727,3
});
test('contratos para empatar com o atual', () => {
  assert.is(volumeEmpate(atual, desconto), 4364);  // (90.000 + 150.000) / 55
  assert.is(volumeEmpate(atual, inadimplencia), 4364);
});
test('sem equilíbrio quando receita ≤ custo por contrato', () => {
  const ruim = { ...atual, preco: 120 };
  assert.is(analisar(ruim).ponto_equilibrio, null);
  assert.is(volumeEmpate(atual, ruim), null);
});
test('Δ e Δ% do resultado', () => {
  const c = comparar(atual, desconto);
  assert.is(c.lucro.valor, 15000);
  assert.is(c.lucro.delta, -75000);
  assert.ok(Math.abs(c.lucro.pct + 83.33) < 0.01);
  assert.is(c.volume_empate.valor, 4364);
});
test('Δ% nulo quando a base é zero', () => {
  const zero = { ...atual, fixo: 240000 }; // resultado 0
  assert.is(comparar(zero, desconto).lucro.pct, null);
});
test('desconto com mais contratos', () => {
  const c = comparar(atual, { ...desconto, quantidade: 3600 });
  assert.is(c.lucro.valor, 48000); // 3.600 × 55 − 150.000
});
test('memória de cálculo com números substituídos', () => {
  assert.is(memoria('lucro', desconto, atual), 'Resultado = receita − custo total = 525.000 − 510.000 = 15.000');
  assert.ok(memoria('volume_empate', desconto, atual).endsWith('= 4.364 contratos'));
  assert.ok(memoria('volume_empate', atual, atual).includes('referência'));
});

test.run();
