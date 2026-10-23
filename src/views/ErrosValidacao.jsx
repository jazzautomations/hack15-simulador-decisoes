import React from "react";

export function ErrosValidacao({ erros }) {
  if (erros.length === 0) return null;
  return (
    <ul className="mb-2" style={{ color: "#f44336" }}>
      {erros.map((e, i) => (<li key={i}>{e}</li>))}
    </ul>
  );
}
