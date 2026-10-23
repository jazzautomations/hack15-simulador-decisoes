import React from "react";
import { cenariosCredito, variacao } from "../lib/credito.js";
import { AjustesCenario } from "./AjustesCenario.jsx";
import { CardsResultado } from "./CardsResultado.jsx";
import { ExportarBotoes } from "./ExportarBotoes.jsx";

export function Comparador({ base, onReset }) {
  const [ajustes, setAjustes] = React.useState({ descontoPP: 0.5, choqueInad: 50 });
  let cs = null, erro = null;
  try {
    if (ajustes.descontoPP === "" || ajustes.choqueInad === "") throw new Error("preencha os dois ajustes");
    cs = cenariosCredito(base, ajustes);
  } catch (e) { erro = e.message; }

  const resultados = cs ? [
    { key: "base", label: "Atual", preco: base.receita, variavel: cs.variavel, ...cs.atual },
    { key: "desconto", label: `Desconto de ${ajustes.descontoPP} p.p.`, preco: cs.receitaDesconto, variavel: cs.variavel, ...cs.desconto },
    { key: "custo", label: `Inadimplência +${ajustes.choqueInad}%`, preco: base.receita, variavel: cs.variavelAlta, ...cs.inadimplencia }
  ].map((r) => ({ ...r, delta: variacao(r.lucro, cs.atual.lucro) })) : [];

  return (
    <div>
      <AjustesCenario ajustes={ajustes} onChange={setAjustes} />
      {erro ? <p style={{ color: "#f44336" }}>{erro}</p> : <>
        <CardsResultado resultados={resultados} />
        <p className="mt-3"><strong>Insight:</strong> {ajustes.descontoPP} p.p. de desconto muda o resultado em {resultados[1].delta ?? "—"}%; inadimplência +{ajustes.choqueInad}% muda em {resultados[2].delta ?? "—"}%.</p>
      </>}
      {cs && <ExportarBotoes onReset={onReset} base={base} ajustes={ajustes} resultados={resultados} />}
      {!cs && <button className="secondary mt-3" onClick={onReset}>← Voltar</button>}
    </div>
  );
}

