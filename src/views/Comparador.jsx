import React from "react";
import { cenariosCredito, variacao } from "../lib/credito.js";
import { analisar, comparar } from "../lib/analise.js";
import { AjustesCenario } from "./AjustesCenario.jsx";
import { PerguntaESe } from "./PerguntaESe.jsx";
import { CardsResultado } from "./CardsResultado.jsx";
import { TabelaComparativa } from "./TabelaComparativa.jsx";
import { ExplicacaoCenarios } from "./ExplicacaoCenarios.jsx";
import { ExportarBotoes } from "./ExportarBotoes.jsx";

export function Comparador({ base, onReset }) {
  const [ajustes, setAjustes] = React.useState({ descontoPP: 0.5, choqueInad: 50, contratosDesconto: base.contratos });
  let cs = null, erro = null;
  try {
    if (ajustes.descontoPP === "" || ajustes.choqueInad === "" || ajustes.contratosDesconto === "") throw new Error("preencha os três ajustes");
    cs = cenariosCredito(base, ajustes);
  } catch (e) { erro = e.message; }

  // Mapeia a carteira na fórmula genérica: preço = receita/contrato, quantidade = contratos
  const atual = cs && { preco: base.receita, quantidade: base.contratos, fixo: base.fixo, variavel: cs.variavel };
  const resultados = cs ? [
    { key: "base", label: "Atual", entradas: atual },
    { key: "desconto", label: `Desconto de ${String(ajustes.descontoPP).replace(".", ",")} p.p.`, entradas: { ...atual, preco: cs.receitaDesconto, quantidade: ajustes.contratosDesconto } },
    { key: "custo", label: `Inadimplência +${ajustes.choqueInad}%`, entradas: { ...atual, variavel: cs.variavelAlta } }
  ].map((c) => {
    const r = analisar(c.entradas);
    return {
      ...c, ...r,
      preco: c.entradas.preco, variavel: c.entradas.variavel, quantidade: c.entradas.quantidade,
      comp: comparar(atual, c.entradas)
    };
  }).map((r, _, todos) => ({ ...r, delta: variacao(r.lucro, todos[0].lucro) })) : [];

  return (
    <div>
      <PerguntaESe base={base} onAplicar={(novos) => setAjustes((a) => ({ ...a, ...novos }))} />
      <AjustesCenario ajustes={ajustes} onChange={setAjustes} />
      {erro ? <p style={{ color: "#f44336" }}>{erro}</p> : <>
        <CardsResultado resultados={resultados} />
        <p className="mt-3"><strong>Insight:</strong> {ajustes.descontoPP} p.p. de desconto muda o resultado em {resultados[1].delta ?? "—"}%; inadimplência +{ajustes.choqueInad}% muda em {resultados[2].delta ?? "—"}%.</p>
        <ExplicacaoCenarios resultados={resultados} />
        <TabelaComparativa resultados={resultados} atual={atual} />
      </>}
      {cs && <ExportarBotoes onReset={onReset} base={base} ajustes={ajustes} resultados={resultados} />}
      {!cs && <button className="secondary mt-3" onClick={onReset}>← Voltar</button>}
    </div>
  );
}
