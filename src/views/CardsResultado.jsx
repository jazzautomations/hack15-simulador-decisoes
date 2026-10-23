import React from "react";
import { formatar, formatarPct } from "../lib/analise.js";

export function CardsResultado({ resultados }) {
  const classeLucro = (l) => l >= 0 ? "metric-positive" : "metric-negative";
  const fmt = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="grid grid-3 mt-3">
      {resultados.map((r) => (
        <div key={r.key} className={`card scenario-card ${r.key}`}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: ".5rem" }}>{r.label}</h2>
          <div className="grid grid-2" style={{ gap: "1rem" }}>
            <div><label>Receita</label><p className="metric">{fmt(r.receita)}</p></div>
            <div><label>Custo Total</label><p className="metric">{fmt(r.custo_total)}</p></div>
          </div>
          <div className="mt-3"><label>Resultado do mês</label><p className={`metric ${classeLucro(r.lucro)}`}>{fmt(r.lucro)}{r.key !== "base" && r.delta !== null ? ` (${r.delta}%)` : ""}</p></div>
          <div className="mt-3"><label>Margem</label><p className="metric">{formatar(r.margem, "pct")}</p></div>
          {r.key === "base" ? (
            <div className="mt-3 destaque"><label>Ponto de equilíbrio</label>
              <p className="metric">{formatar(r.ponto_equilibrio, "qtd")}</p></div>
          ) : (
            <div className="mt-3 destaque"><label>Para empatar com o atual, precisa de</label>
              <p className="metric">{formatar(r.comp.volume_empate.valor, "qtd")}</p>
              {r.comp.volume_empate.valor !== null && (
                <small>{formatarPct(r.comp.volume_empate.pct)} sobre a carteira atual</small>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
