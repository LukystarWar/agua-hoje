# 💧 Gotinha - Web App de Ciclo de Água

Web app mobile-first para rastrear ciclo de fornecimento de água alternado (1 dia SIM → 1 dia NÃO), com suporte a pausas por manutenção/quebra de fornecimento.

---

## 🎯 Objetivo

Sistema simples e objetivo para saber se **hoje é dia de água ou não**, com calendário visual e ajustes manuais para quebras de fornecimento.

---

## 📊 Banco de Dados (Supabase)

**Tabela: `ciclo_agua`**
```sql
- id (uuid, primary key)
- data (date, unique)
- status (text: 'SIM' | 'NAO' | 'PAUSA')
- created_at (timestamp)
```

**Lógica:**
- Data inicial: **ontem teve**, **hoje não tem**, **amanhã terá**
- Ciclo automático calcula próximos dias alternando SIM/NÃO
- Usuário pode registrar PAUSA (manutenção/quebra) que interrompe o ciclo
- Quando sair da PAUSA, reinicia ciclo no próximo dia fornecido

---

## 🏗️ Estrutura de Arquivos

```
/gotinha
  index.html              → Tela principal (SIM/NÃO de hoje)
  calendario.html         → Grid de dias do mês
  ajustar.html           → Registrar status ou pausas

  /css
    global.css           → Reset, variáveis CSS, mobile-first base
    home.css             → Estilos da tela principal
    calendario.css       → Grid + estilos do calendário
    ajustar.css          → Formulário de ajuste

  /js
    supabase.js          → Inicialização e funções do Supabase
    utils.js             → Lógica de cálculo de ciclo, formatação de datas
    home.js              → Lógica da tela principal
    calendario.js        → Renderização do calendário
    ajustar.js           → Formulário de ajuste

  /img
    gotinha-sim.svg      → Ícone gotinha feliz (azul)
    gotinha-nao.svg      → Ícone gotinha triste (cinza)

  .gitignore
  README.md
```

---

## 🎨 Design System

**Paleta:**
- Azul principal: `#007BFF`
- Branco: `#FFFFFF`
- SIM (água): `#28a745` (verde)
- NÃO (sem água): `#dc3545` (vermelho)
- PAUSA (manutenção): `#ffc107` (amarelo/laranja)
- Texto: `#212529`

**Tipografia:**
- Font: `system-ui, -apple-system, sans-serif`
- Mobile-first: base 16px, títulos grandes e legíveis

**Responsividade:**
- Mobile: < 768px (padrão)
- Desktop: > 768px (ajustes sutis)

---

## 📄 Páginas

### **1. index.html (Home)**
- Exibe **SIM**, **NÃO** ou **PAUSA** gigante e centralizado
- Ícone da gotinha (feliz/triste) animado
- Data de hoje em destaque
- Botões: "Ver Calendário" | "Ajustar Ciclo"
- Próximo fornecimento previsto (se NÃO ou PAUSA)

### **2. calendario.html**
- Grid de dias do mês atual
- Cores: verde (SIM), vermelho (NÃO), amarelo (PAUSA), cinza (sem registro)
- Navegação: < Mês Anterior | Mês Atual | Próximo Mês >
- Legenda visual das cores
- Botão: "Voltar" | "Ajustar Ciclo"

### **3. ajustar.html**
- 3 botões grandes:
  - ✅ "Hoje teve água" (marca SIM)
  - ❌ "Hoje não teve água" (marca NÃO)
  - ⚠️ "Registrar pausa/manutenção" (marca PAUSA)
- Histórico dos últimos 5 registros manuais
- Botão: "Voltar" | "Ver Calendário"

---

## 🔧 Lógica de Ciclo (utils.js)

**Funções principais:**
1. `calcularProximoDia(ultimoDiaRegistrado)`: Alterna SIM/NÃO baseado no último status
2. `gerarCalendarioMes(mes, ano)`: Preenche array de 30 dias com status previsto
3. `verificarStatus(data)`: Consulta Supabase ou calcula baseado no ciclo
4. `registrarStatus(data, status)`: Salva no Supabase e recalcula próximos dias

**Regra de PAUSA:**
- Quando registrado PAUSA, próximos dias ficam indefinidos
- Ao registrar próximo SIM, ciclo reinicia (SIM → NÃO → SIM...)

---

## 🔌 Supabase (supabase.js)

**Configuração:**
- CDN: `<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>`
- Variáveis de ambiente embutidas (ou `.env` local)
- Funções assíncronas:
  - `buscarStatus(data)`
  - `salvarStatus(data, status)`
  - `buscarHistorico(limite)`
  - `buscarMes(mes, ano)`

---

## 🚀 Deploy (Netlify)

**Processo:**
1. Push no GitHub
2. Conectar repositório no Netlify
3. Build settings: nenhum (HTML puro)
4. Publish directory: `/` (raiz)
5. Variáveis de ambiente: `SUPABASE_URL`, `SUPABASE_ANON_KEY`

**Arquivo `netlify.toml` (opcional):**
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 📝 Ordem de Implementação

1. **Estrutura base** (arquivos vazios + global.css)
2. **supabase.js** (config + funções de banco)
3. **utils.js** (lógica de ciclo)
4. **index.html + home.css + home.js** (tela principal funcional)
5. **calendario.html + calendario.css + calendario.js** (grid do mês)
6. **ajustar.html + ajustar.css + ajustar.js** (formulário de ajuste)
7. **SVGs das gotinhas** (ícones)
8. **Seed inicial** (popular banco com ontem=SIM, hoje=NÃO, amanhã=SIM)
9. **Testes manuais** (fluxo completo mobile)
10. **README.md** (documentação de uso)

---

## 🛠️ Stack Tecnológico

- **Frontend:** HTML5 + CSS3 + JavaScript puro (ES6+)
- **Backend:** Supabase (PostgreSQL + API REST automática)
- **Deploy:** Netlify (hospedagem estática)
- **Versionamento:** Git + GitHub

---

## 📱 Mobile-First

O projeto é desenvolvido **mobile-first** desde o início:
- CSS pensado primeiro para telas pequenas
- Botões e áreas de toque grandes (mínimo 44x44px)
- Tipografia legível em qualquer tamanho de tela
- Grid do calendário responsivo

---

## 🔐 Segurança

- Uso de `SUPABASE_ANON_KEY` (RLS habilitado no Supabase)
- Sem autenticação de usuário (app de uso pessoal/familiar)
- HTTPS obrigatório via Netlify

---

## 📄 Licença

MIT
