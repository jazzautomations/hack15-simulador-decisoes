import React from "react";
import { cenario } from "../lib/calc.js";
import { AjustesCenario } from "./AjustesCenario.jsx";
import { CardsResultado } from "./CardsResultado.jsx";
import { ExportarBotoes } from "./ExportarBotoes.jsx";

export function Comparador({ base, onReset }) {
  const [ajustes, setAjustes] = React.useState({
    precoDesconto: base.preco * 0.8,
    custoAlto: base.variavel * 1.5
  });
  const cs = cenario(base, ajustes.precoDesconto, ajustes.custoAlto);
  const resultados = [
    { key: "base", label: "Cenário Atual", preco: base.preco, ...cs.base },
    { key: "desconto", label: "Com Desconto", preco: ajustes.precoDesconto, ...cs.desconto },
    { key: "custo", label: "Custo Alto", preco: base.preco, ...cs.custo_alto }
  ];

  return (
    <div>
      <AjustesCenario ajustes={ajustes} onChange={setAjustes} />
      <CardsResultado resultados={resultados} />
      <ExportarBotoes onReset={onReset} base={base} ajustes={ajustes} resultados={resultados} />
    </div>
  );
}

