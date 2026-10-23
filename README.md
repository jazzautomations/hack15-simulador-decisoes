# #15 Simulador de Decisões

**Objetivo:** Simular como mudanças comerciais afetam o resultado mensal de um negócio, comparando 3 cenários. Produto único, um mês, fórmulas determinísticas.

## Tech Stack
- **Vite + React 18** (dev server, HMR, build estático)
- **CSS puro** (sem Tailwind/bootstrap — bundle leve)
- **uvu** (testes — 5 assertions validam fórmula + input)
- Zero deps externas em runtime (offline-first)

## Setup
```bash
npm install
npm run dev      # http://localhost:3001
npm run build    # gera /dist
```

## Spec
### Entradas
- **Nome do produto** (string)
- **Preço unitário** (R$)
- **Quantidade vendida** (unidades/mês)
- **Custo fixo total** (R$/mês)
- **Custo variável/unitário** (R$)

### Cálculos
```
custo_total   = fixo + (variavel * quantidade)
receita       = preco * quantidade
lucro         = receita - custo_total
margem        = (lucro / receita) * 100
```

### 3 Cenários
1. **Cenário Atual** (base)
2. **Com Desconto** (preço unitário reduzido)
3. **Custo Alto** (custo variável aumentado)

### Exportações
- **JSON:** `{ base, ajustes, resultados }` → download automático
- **CSV:** colunas `cenario,preco,quantidade,custo_total,receita,lucro,margem_pct`

## Demo Flow (≤ 3 cliques)
1. `/#` preencher form → `Simular` → `/comparador`
2. Ajustar sliders → ver 3 cards atualizarem em tempo real
3. `Exportar CSV` → salvar → abrir no Excel/Sheets

## Testes
```bash
node test/calc.test.js
# 5 pass / 0 fail
```

## Estrutura
```
src/
├── main.jsx          # App root (form ↔ comparador)
├── lib/calc.js       # fórmulas + validação input
├── lib/schema.js     # validação produto
├── views/
│   ├── FormularioBase.jsx
│   └── Comparador.jsx
└── styles.css        # design system minimal
```

## Pendências (hackathon)
- [ ] Pitch deck: 3 cliques → 3 cenários → insight de margem
- [ ] GitHub repo + Actions deploy

## Metodologia do time

Como o squad multi-agente se organiza (worktrees, board, red team, cronograma 24h): [METODOLOGIA.md](METODOLOGIA.md)
