// #15 Rota /api/explicar: a IA só redige; números vêm do cálculo e são conferidos aqui.
// Sem OPENAI_API_KEY/OPENAI_MODEL, responde 503 e a tela usa as regras locais.

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["frases"],
  properties: { frases: { type: "array", items: { type: "string" }, description: "De 2 a 4 frases curtas em português" } }
};

const INSTRUCOES = `Você explica a um gestor de uma fintech de crédito como cenários mudam o resultado mensal da carteira.
Use somente os números do JSON recebido, sem calcular nem arredondar valores novos. Escreva de 2 a 4 frases curtas, em português, sem jargão.
Destaque quantos contratos seriam necessários para empatar com o cenário atual quando houver esse dado. Não recomende decisões.`;

// Números citados no texto (ex.: "90.000", "46,7", "4.364", "0.5") convertidos para Number
export const numerosNoTexto = (texto) =>
  (texto.match(/\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+\.\d{1,2}(?!\d)|\d+(?:,\d+)?/g) || []).map((s) =>
    /^\d+\.\d{1,2}$/.test(s) ? Number(s) : Number(s.replace(/\./g, "").replace(",", ".")));

// Todo número do texto precisa existir no payload (valor absoluto, tolerância de arredondamento)
export const numerosConferem = (frases, cenarios) => {
  const permitidos = [];
  for (const c of cenarios) for (const v of Object.values(c)) if (typeof v === "number") permitidos.push(Math.abs(v));
  for (const c of cenarios) for (const m of String(c.cenario).match(/\d+(?:[.,]\d+)?/g) || []) permitidos.push(Number(m.replace(",", ".")));
  return frases.every((f) => numerosNoTexto(f).every((n) =>
    permitidos.some((p) => Math.abs(p - n) <= Math.max(0.051, Math.abs(p) * 0.001))));
};

export async function explicarComOpenAI(cenarios, { chave, modelo, fetchFn = fetch }) {
  const resp = await fetchFn("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${chave}` },
    body: JSON.stringify({
      model: modelo,
      store: false,
      input: [{ role: "system", content: INSTRUCOES }, { role: "user", content: JSON.stringify(cenarios) }],
      text: { format: { type: "json_schema", name: "explicacao_cenarios", schema: SCHEMA, strict: true } }
    }),
    signal: AbortSignal.timeout(20000)
  });
  if (!resp.ok) throw new Error(`OpenAI ${resp.status}`);
  const dados = await resp.json();
  const msg = dados.output?.find((o) => o.type === "message");
  const txt = msg?.content?.find((c) => c.type === "output_text")?.text;
  if (!txt) throw new Error("resposta da OpenAI sem texto");
  const { frases } = JSON.parse(txt);
  if (!Array.isArray(frases) || frases.length === 0) throw new Error("explicação vazia");
  if (!numerosConferem(frases, cenarios)) throw new Error("explicação citou número fora do cálculo");
  return { frases };
}

export const rotaExplicar = (env) => ({
  name: "rota-explicar",
  configureServer(server) {
    server.middlewares.use("/api/explicar", async (req, res) => {
      const enviar = (status, corpo) => {
        res.statusCode = status; res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(corpo));
      };
      if (req.method !== "POST") return enviar(405, { erro: "use POST" });
      if (!env.OPENAI_API_KEY || !env.OPENAI_MODEL) return enviar(503, { erro: "IA não configurada" });
      let corpo = "";
      for await (const parte of req) corpo += parte;
      try {
        const { cenarios } = JSON.parse(corpo || "{}");
        if (!Array.isArray(cenarios) || cenarios.length === 0 || cenarios.length > 3) return enviar(400, { erro: "cenários inválidos" });
        enviar(200, await explicarComOpenAI(cenarios, { chave: env.OPENAI_API_KEY, modelo: env.OPENAI_MODEL }));
      } catch (e) {
        enviar(502, { erro: e.message });
      }
    });
  }
});
