import React from "react";
import { LINHAS, formatar, formatarDelta, formatarPct, memoria } from "../lib/analise.js";

// Verde = melhor que o atual, vermelho = pior (custos e volumes: aumento é ruim)
const classe = (delta, menorMelhor) => {
  if (!delta) return "metric-neutral";
  return (delta > 0) !== Boolean(menorMelhor) ? "metric-positive" : "metric-negative";
};

export function TabelaComparativa({ resultados, atual }) {
  const [aberta, setAberta] = React.useState(null);

  return (
    <div className="card mt-3 tabela-wrap">
      <h2 style={{ fontSize: "1.1rem", marginBottom: ".5rem" }}>Cálculos e diferenças</h2>
      <small>Clique em uma linha para ver a memória de cálculo.</small>
      <table className="tabela mt-3">
        <thead>
          <tr>
            <th scope="col">Linha</th>
            {resultados.map((r) => <th scope="col" key={r.key}>{r.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {LINHAS.map((l) => (
            <React.Fragment key={l.id}>
              <tr className={l.destaque ? "linha-destaque" : ""}>
                <th scope="row">
                  <button className="linha-btn" aria-expanded={aberta === l.id}
                    onClick={() => setAberta(aberta === l.id ? null : l.id)}>
                    {aberta === l.id ? "▾" : "▸"} {l.rotulo}
                  </button>
                </th>
                {resultados.map((r) => {
                  const d = r.comp[l.id];
                  return (
                    <td key={r.key}>
                      {formatar(r.key === "base" && l.id === "volume_empate" ? null : d.valor, l.formato)}
                      {r.key !== "base" && d.delta !== null && (
                        <small className={`delta ${classe(d.delta, l.menor_melhor)}`}>
                          {formatarDelta(d.delta, l.formato)}
                          {l.formato !== "pct" && ` (${formatarPct(d.pct)})`}
                        </small>
                      )}
                    </td>
                  );
                })}
              </tr>
              {aberta === l.id && (
                <tr className="memoria">
                  <td colSpan={resultados.length + 1}>
                    {resultados.map((r) => (
                      <p key={r.key}><strong>{r.label}:</strong> <code>{memoria(l.id, r.entradas, atual)}</code></p>
                    ))}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
