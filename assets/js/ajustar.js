// ===========================
// AJUSTAR CICLO - LÓGICA
// ===========================

document.addEventListener('DOMContentLoaded', async () => {
  configurarBotoes();
  await carregarHistorico();
});

/**
 * Configura eventos dos botões de ajuste
 */
function configurarBotoes() {
  document.getElementById('btnTevAgua').addEventListener('click', () => {
    registrarStatusHoje('SIM');
  });

  document.getElementById('btnNaoTevAgua').addEventListener('click', () => {
    registrarStatusHoje('NAO');
  });

  document.getElementById('btnPausa').addEventListener('click', () => {
    registrarStatusHoje('PAUSA');
  });
}

/**
 * Registra status de hoje
 */
async function registrarStatusHoje(status) {
  const feedbackContainer = document.getElementById('feedbackContainer');
  const botoes = document.querySelectorAll('.botoes-ajuste .btn');

  try {
    // Desabilitar botões durante salvamento
    botoes.forEach(btn => btn.classList.add('btn-loading'));

    const hoje = window.utils.obterDataHoje();
    const sucesso = await window.aguaHoje.salvarStatus(hoje, status);

    if (sucesso) {
      mostrarSucesso(feedbackContainer, status);
      await carregarHistorico();

      // Redirecionar para home após 2 segundos
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    } else {
      throw new Error('Erro ao salvar status');
    }

  } catch (erro) {
    console.error('Erro:', erro);
    mostrarErro(feedbackContainer);
    botoes.forEach(btn => btn.classList.remove('btn-loading'));
  }
}

/**
 * Carrega e exibe histórico de ajustes
 */
async function carregarHistorico() {
  const container = document.getElementById('historicoLista');

  try {
    const historico = await window.aguaHoje.buscarHistorico(5);

    if (historico.length === 0) {
      container.innerHTML = `
        <div class="historico-vazio">
          Nenhum ajuste registrado ainda
        </div>
      `;
      return;
    }

    let html = '';
    historico.forEach(registro => {
      const dataFormatada = formatarDataHistorico(registro.data);
      const statusClass = registro.status.toLowerCase();
      const statusTexto = getStatusTexto(registro.status);

      html += `
        <div class="historico-item fade-in">
          <span class="data">${dataFormatada}</span>
          <span class="status ${statusClass}">${statusTexto}</span>
        </div>
      `;
    });

    container.innerHTML = html;

  } catch (erro) {
    console.error('Erro ao carregar histórico:', erro);
    container.innerHTML = `
      <div class="historico-vazio">
        Erro ao carregar histórico
      </div>
    `;
  }
}

/**
 * Formata data para histórico (ex: "02/01")
 */
function formatarDataHistorico(data) {
  const d = new Date(data + 'T00:00:00');
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  return `${dia}/${mes}`;
}

/**
 * Retorna texto do status
 */
function getStatusTexto(status) {
  const textos = {
    'SIM': 'TEM',
    'NAO': 'SEM',
    'PAUSA': 'PAUSA'
  };
  return textos[status] || status;
}

/**
 * Mostra feedback de sucesso
 */
function mostrarSucesso(container, status) {
  const mensagens = {
    'SIM': '✅ Registrado: Hoje TEM água!',
    'NAO': '❌ Registrado: Hoje NÃO tem água',
    'PAUSA': '⚠️ Registrado: Fornecimento em PAUSA'
  };

  container.innerHTML = `
    <div class="sucesso-feedback">
      ${mensagens[status]}
    </div>
  `;
}

/**
 * Mostra erro
 */
function mostrarErro(container) {
  container.innerHTML = `
    <div class="error-message">
      <p>⚠️ Erro ao salvar. Tente novamente.</p>
    </div>
  `;

  // Remover mensagem após 3s
  setTimeout(() => {
    container.innerHTML = '';
  }, 3000);
}
