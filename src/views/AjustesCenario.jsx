import React from "react";

export function AjustesCenario({ ajustes, onChange }) {
  const set = (k) => (e) => onChange((a) => ({ ...a, [k]: e.target.value === "" ? "" : Number(e.target.value) }));
  return (
    <div className="grid grid-3 mt-3">
      <div className="mb-2">
        <label htmlFor="aj-desconto">Desconto na taxa (p.p. ao mês sobre o contrato)</label>
        <input id="aj-desconto" type="number" step="0.1" min="0" value={ajustes.descontoPP} onChange={set("descontoPP")} />
      </div>
      <div className="mb-2">
        <label htmlFor="aj-contratos">Contratos esperados com o desconto</label>
        <input id="aj-contratos" type="number" step="50" min="0" value={ajustes.contratosDesconto} onChange={set("contratosDesconto")} />
      </div>
      <div className="mb-2">
        <label htmlFor="aj-inad">Aumento da inadimplência (%)</label>
        <input id="aj-inad" type="number" step="5" min="0" value={ajustes.choqueInad} onChange={set("choqueInad")} />
      </div>
    </div>
  );
}
