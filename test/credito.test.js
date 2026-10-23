import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { perdaEsperada, cenariosCredito, variacao } from '../src/lib/credito.js';

// Dados fictícios do enunciado: contrato R$5.000, receita R$200, 3.000 contratos,
// funding 60 + perda 50 + cobrança 10, fixos 150.000
const base = {
  contrato: 5000, receita: 200, contratos: 3000,
  funding: 60, cobranca: 10, fixo: 150000,
  mix: { A: 40, B: 40, C: 20 }
};

test('mix A/B/C 40/40/20 dá perda esperada de R$50', () => {
  assert.is(perdaEsperada(base.mix), 50);
});

test('cenário atual: resultado R$90.000', () => {
  const cs = cenariosCredito(base);
  assert.is(cs.variavel, 120);
  assert.is(cs.atual.receita, 600000);
  assert.is(cs.atual.lucro, 90000);
});

test('desconto 0,5 p.p.: receita R$175, resultado R$15.000 (-83%)', () => {
  const cs = cenariosCredito(base);
  assert.is(cs.receitaDesconto, 175);
  assert.is(cs.desconto.lucro, 15000);
  assert.is(variacao(cs.desconto.lucro, cs.atual.lucro), -83);
});

test('inadimplência +50%: perda R$75, resultado R$15.000 (-83%)', () => {
  const cs = cenariosCredito(base);
  assert.is(cs.perdaAlta, 75);
  assert.is(cs.inadimplencia.lucro, 15000);
  assert.is(variacao(cs.inadimplencia.lucro, cs.atual.lucro), -83);
});

test('mix que não soma 100% é rejeitado', () => {
  assert.throws(() => perdaEsperada({ A: 50, B: 30, C: 10 }), /somar 100%/);
});

test('mix negativo ou desconto maior que a receita é rejeitado', () => {
  assert.throws(() => perdaEsperada({ A: -10, B: 90, C: 20 }), /inválido/);
  assert.throws(() => cenariosCredito(base, { descontoPP: 5 }), /desconto maior/);
});

test.run();
