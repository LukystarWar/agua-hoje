// ===========================
// CALENDÁRIO - LÓGICA
// ===========================

let mesAtual = new Date().getMonth() + 1; // 1-12
let anoAtual = new Date().getFullYear();

document.addEventListener('DOMContentLoaded', async () => {
  configurarNavegacao();
  await carregarCalendario();
});

/**
 * Configura navegação entre meses
 */
function configurarNavegacao() {
  document.getElementById('btnMesAnterior').addEventListener('click', () => {
    mesAtual--;
    if (mesAtual < 1) {
      mesAtual = 12;
      anoAtual--;
    }
    carregarCalendario();
  });

  document.getElementById('btnProximoMes').addEventListener('click', () => {
    mesAtual++;
    if (mesAtual > 12) {
      mesAtual = 1;
      anoAtual++;
    }
    carregarCalendario();
  });
}

/**
 * Carrega e renderiza o calendário do mês
 */
async function carregarCalendario() {
  const container = document.getElementById('calendarioContainer');
  const mesNomeEl = document.getElementById('mesNome');

  try {
    // Atualizar nome do mês
    mesNomeEl.textContent = `${window.utils.obterNomeMes(mesAtual)} ${anoAtual}`;

    // Mostrar loading
    mostrarLoading(container);

    // Buscar registros do mês no banco
    const registrosBanco = await window.aguaHoje.buscarMes(mesAtual, anoAtual);

    // Buscar último registro para calcular ciclo
    const ultimoRegistro = await window.aguaHoje.buscarUltimoRegistro();

    // Gerar calendário
    const calendario = window.utils.gerarCalendarioMes(mesAtual, anoAtual, registrosBanco, ultimoRegistro);

    // Renderizar
    renderizarCalendario(container, calendario);

  } catch (erro) {
    console.error('Erro ao carregar calendário:', erro);
    mostrarErro(container);
  }
}

/**
 * Renderiza o grid do calendário
 */
function renderizarCalendario(container, calendario) {
  // Obter primeiro dia da semana (0 = domingo)
  const primeiroDia = window.utils.obterPrimeiroDiaSemana(mesAtual, anoAtual);

  // Dias da semana
  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  let html = `
    <div class="dias-semana">
      ${diasSemana.map(dia => `<div class="dia-semana">${dia}</div>`).join('')}
    </div>

    <div class="dias-mes">
  `;

  // Adicionar dias vazios antes do primeiro dia
  for (let i = 0; i < primeiroDia; i++) {
    html += `<div class="dia vazio"></div>`;
  }

  // Adicionar dias do mês
  const hoje = window.utils.obterDataHoje();

  calendario.forEach(({ dia, data, status }) => {
    const statusClass = status ? status.toLowerCase() : 'indefinido';
    const hojeClass = data === hoje ? 'hoje' : '';
    const emoji = getEmojiStatus(status);

    html += `
      <div class="dia ${statusClass} ${hojeClass}" title="${data}">
        <span>${dia}</span>
      </div>
    `;
  });

  html += `</div>`;

  container.innerHTML = html;
}

/**
 * Retorna emoji baseado no status
 */
function getEmojiStatus(status) {
  const emojis = {
    'SIM': '💧',
    'NAO': '❌',
    'PAUSA': '⚠️'
  };
  return emojis[status] || '';
}

/**
 * Mostra loading
 */
function mostrarLoading(container) {
  container.innerHTML = `
    <div class="calendario-loading">
      <div class="loading-spinner"></div>
      <p>Carregando calendário...</p>
    </div>
  `;
}

/**
 * Mostra erro
 */
function mostrarErro(container) {
  container.innerHTML = `
    <div class="error-message">
      <p>⚠️ Erro ao carregar calendário</p>
    </div>
  `;
}
