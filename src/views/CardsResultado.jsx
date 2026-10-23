import React from "react";

export function CardsResultado({ resultados }) {
  const classeLucro = (l) => l >= 0 ? "metric-positive" : "metric-negative";
  const fmt = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="grid mt-3">
      {resultados.map((r) => (
        <div key={r.key} className={`card scenario-card ${r.key}`}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: ".5rem" }}>{r.label}</h2>
          <div className="grid-2" style={{ gap: "1rem" }}>
            <div><label>Receita</label><p className="metric">{fmt(r.receita)}</p></div>
            <div><label>Custo Total</label><p className="metric">{fmt(r.custo_total)}</p></div>
          </div>
          <div className="mt-3"><label>Resultado do mês</label><p className={`metric ${classeLucro(r.lucro)}`}>{fmt(r.lucro)}{r.key !== "base" && r.delta !== null ? ` (${r.delta}%)` : ""}</p></div>
          <div className="mt-3"><label>Margem</label><p className="metric">{Math.round(r.margem)}%</p></div>
        </div>
      ))}
    </div>
  );
}
