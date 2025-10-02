// ===========================
// HOME - LÓGICA DA TELA PRINCIPAL
// ===========================

document.addEventListener('DOMContentLoaded', async () => {
  await carregarStatusHoje();
});

/**
 * Carrega e exibe o status de hoje
 */
async function carregarStatusHoje() {
  const statusContainer = document.getElementById('statusContainer');

  try {
    // Mostrar loading
    mostrarLoading(statusContainer);

    // Buscar último registro para calcular ciclo
    const ultimoRegistro = await window.aguaHoje.buscarUltimoRegistro();

    // Buscar status de hoje
    const hoje = window.utils.obterDataHoje();
    const registroHoje = await window.aguaHoje.buscarStatus(hoje);

    // Verificar status
    const info = await window.utils.verificarStatusHoje(registroHoje, ultimoRegistro);

    // Renderizar UI
    renderizarStatus(statusContainer, info);

  } catch (erro) {
    console.error('Erro ao carregar status:', erro);
    mostrarErro(statusContainer, 'Erro ao carregar dados. Verifique sua conexão.');
  }
}

/**
 * Renderiza o status principal na tela
 */
function renderizarStatus(container, info) {
  const { status, mensagem, proxima } = info;
  const hoje = new Date();
  const dataLegivel = window.utils.formatarDataLegivel(hoje);

  // Definir classe e ícone baseado no status
  const statusClass = status.toLowerCase();
  let iconeSrc = 'assets/img/base.png';
  if (status === 'SIM') iconeSrc = 'assets/img/sim.png';
  else if (status === 'NAO') iconeSrc = 'assets/img/nao.png';
  else if (status === 'PAUSA') iconeSrc = 'assets/img/manutencao.png';

  // Exibir com acento
  const statusTexto = status === 'NAO' ? 'NÃO' : status;

  container.innerHTML = `
    <div class="home-content fade-in">
      <div class="status-principal">
        <img
          src="${iconeSrc}"
          alt="Status ${statusTexto}"
          class="icone-gotinha pulse"
          onerror="this.style.display='none'"
        />

        <h1 class="status-texto ${statusClass}">${statusTexto}</h1>

        <div class="data-atual">
          ${dataLegivel}
        </div>
      </div>

      ${status !== 'SIM' ? `
        <div class="proximo-fornecimento">
          <h3>Próximo fornecimento:</h3>
          <p class="data-proxima">${proxima}</p>
        </div>
      ` : ''}
    </div>

    <div class="nav-buttons fade-in">
      <a href="calendario.html" class="btn btn-outline btn-lg">
        Ver Calendário
      </a>
      <a href="ajustar.html" class="btn btn-primary btn-lg">
        Ajustar Ciclo
      </a>
    </div>
  `;
}

/**
 * Mostra loading
 */
function mostrarLoading(container) {
  container.innerHTML = `
    <div class="loading">
      <div class="loading-spinner"></div>
      <p>Carregando...</p>
    </div>
  `;
}

/**
 * Mostra mensagem de erro
 */
function mostrarErro(container, mensagem) {
  container.innerHTML = `
    <div class="error-message">
      <p>${mensagem}</p>
    </div>
    <div class="nav-buttons">
      <button class="btn btn-outline btn-lg btn-block" onclick="location.reload()">
        Tentar Novamente
      </button>
      <a href="ajustar.html" class="btn btn-primary btn-lg btn-block">
        Ajustar Manualmente
      </a>
    </div>
  `;
}
