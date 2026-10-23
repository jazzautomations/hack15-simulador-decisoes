import React from "react";

export function AjustesCenario({ ajustes, onChange }) {
  const set = (k) => (e) => onChange((a) => ({ ...a, [k]: e.target.value === "" ? "" : Number(e.target.value) }));
  return (
    <div className="grid-2 mt-3">
      <div className="mb-2">
        <label>Desconto na taxa (p.p. ao mês sobre o contrato)</label>
        <input type="number" step="0.1" min="0" value={ajustes.descontoPP} onChange={set("descontoPP")} />
      </div>
      <div className="mb-2">
        <label>Aumento da inadimplência (%)</label>
        <input type="number" step="5" min="0" value={ajustes.choqueInad} onChange={set("choqueInad")} />
      </div>
    </div>
  );
}
