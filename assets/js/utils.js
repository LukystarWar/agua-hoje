// ===========================
// UTILITÁRIOS E LÓGICA DE CICLO
// ===========================

/**
 * Formata data para YYYY-MM-DD
 * @param {Date} data
 * @returns {string}
 */
function formatarData(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

/**
 * Formata data para exibição (ex: "Quinta, 2 de Janeiro")
 * @param {Date|string} data
 * @returns {string}
 */
function formatarDataLegivel(data) {
  const d = typeof data === 'string' ? new Date(data + 'T00:00:00') : data;

  const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const diaSemana = dias[d.getDay()];
  const dia = d.getDate();
  const mes = meses[d.getMonth()];

  return `${diaSemana}, ${dia} de ${mes}`;
}

/**
 * Obter data de hoje no formato YYYY-MM-DD
 * @returns {string}
 */
function obterDataHoje() {
  return formatarData(new Date());
}

/**
 * Obter data de amanhã no formato YYYY-MM-DD
 * @returns {string}
 */
function obterDataAmanha() {
  const amanha = new Date();
  amanha.setDate(amanha.getDate() + 1);
  return formatarData(amanha);
}

/**
 * Calcula o próximo dia com água baseado no último registro
 * @param {Object} ultimoRegistro - {data: 'YYYY-MM-DD', status: 'SIM'|'NAO'|'PAUSA'}
 * @returns {string} Data do próximo dia com água (YYYY-MM-DD)
 */
function calcularProximoDiaComAgua(ultimoRegistro) {
  if (!ultimoRegistro) {
    return obterDataAmanha();
  }

  const data = new Date(ultimoRegistro.data + 'T00:00:00');

  // Se última foi PAUSA, não sabemos quando será o próximo
  if (ultimoRegistro.status === 'PAUSA') {
    return 'Indefinido';
  }

  // Se última foi SIM, próximo será daqui a 2 dias
  if (ultimoRegistro.status === 'SIM') {
    data.setDate(data.getDate() + 2);
    return formatarData(data);
  }

  // Se última foi NAO, próximo será amanhã
  if (ultimoRegistro.status === 'NAO') {
    data.setDate(data.getDate() + 1);
    return formatarData(data);
  }

  return 'Indefinido';
}

/**
 * Calcula o status esperado para uma data baseado no ciclo
 * Assume ciclo: SIM → NAO → SIM → NAO...
 * @param {string} data - Data alvo (YYYY-MM-DD)
 * @param {Object} ultimoRegistro - {data: 'YYYY-MM-DD', status: 'SIM'|'NAO'|'PAUSA'}
 * @returns {string} 'SIM', 'NAO' ou null (se não pode calcular)
 */
function calcularStatusEsperado(data, ultimoRegistro) {
  if (!ultimoRegistro || ultimoRegistro.status === 'PAUSA') {
    return null; // Não pode calcular durante pausa
  }

  const dataAlvo = new Date(data + 'T00:00:00');
  const dataBase = new Date(ultimoRegistro.data + 'T00:00:00');

  // Calcular diferença em dias
  const diferencaDias = Math.floor((dataAlvo - dataBase) / (1000 * 60 * 60 * 24));

  if (diferencaDias < 0) {
    return null; // Data no passado antes do último registro
  }

  // Se diferença é par, status é o mesmo; se ímpar, status é alternado
  if (diferencaDias % 2 === 0) {
    return ultimoRegistro.status;
  } else {
    return ultimoRegistro.status === 'SIM' ? 'NAO' : 'SIM';
  }
}

/**
 * Gera array de dias do mês com seus status (confirmados ou calculados)
 * @param {number} mes - Mês (1-12)
 * @param {number} ano - Ano (ex: 2025)
 * @param {Array} registrosBanco - Registros confirmados do banco
 * @param {Object} ultimoRegistro - Último registro para calcular ciclo
 * @returns {Array} Array de {dia: number, data: string, status: string|null}
 */
function gerarCalendarioMes(mes, ano, registrosBanco = [], ultimoRegistro = null) {
  const calendario = [];
  const ultimoDiaMes = new Date(ano, mes, 0).getDate();

  // Criar map de registros do banco para acesso rápido
  const mapRegistros = {};
  registrosBanco.forEach(reg => {
    mapRegistros[reg.data] = reg.status;
  });

  // Gerar cada dia do mês
  for (let dia = 1; dia <= ultimoDiaMes; dia++) {
    const data = `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;

    // Status confirmado no banco tem prioridade
    let status = mapRegistros[data] || null;

    // Se não tem no banco, tentar calcular pelo ciclo
    if (!status && ultimoRegistro) {
      status = calcularStatusEsperado(data, ultimoRegistro);
    }

    calendario.push({
      dia,
      data,
      status
    });
  }

  return calendario;
}

/**
 * Verifica se uma data é hoje
 * @param {string} data - YYYY-MM-DD
 * @returns {boolean}
 */
function ehHoje(data) {
  return data === obterDataHoje();
}

/**
 * Verifica se uma data é no futuro
 * @param {string} data - YYYY-MM-DD
 * @returns {boolean}
 */
function ehFuturo(data) {
  const hoje = new Date(obterDataHoje() + 'T00:00:00');
  const dataAlvo = new Date(data + 'T00:00:00');
  return dataAlvo > hoje;
}

/**
 * Verifica se uma data é no passado
 * @param {string} data - YYYY-MM-DD
 * @returns {boolean}
 */
function ehPassado(data) {
  const hoje = new Date(obterDataHoje() + 'T00:00:00');
  const dataAlvo = new Date(data + 'T00:00:00');
  return dataAlvo < hoje;
}

/**
 * Obter nome do mês
 * @param {number} mes - 1-12
 * @returns {string}
 */
function obterNomeMes(mes) {
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return meses[mes - 1];
}

/**
 * Obter primeiro dia da semana do mês (0 = domingo, 6 = sábado)
 * @param {number} mes - 1-12
 * @param {number} ano
 * @returns {number}
 */
function obterPrimeiroDiaSemana(mes, ano) {
  return new Date(ano, mes - 1, 1).getDay();
}

/**
 * Verificar status de hoje e retornar objeto completo
 * @param {Object} registroHoje - Registro do banco para hoje ou null
 * @param {Object} ultimoRegistro - Último registro para calcular
 * @returns {Object} {status: string, mensagem: string, proxima: string}
 */
async function verificarStatusHoje(registroHoje, ultimoRegistro) {
  const hoje = obterDataHoje();

  let status = registroHoje?.status || null;

  // Se não tem registro confirmado, calcular pelo ciclo
  if (!status && ultimoRegistro) {
    status = calcularStatusEsperado(hoje, ultimoRegistro);
  }

  // Padrão: não sabemos
  if (!status) {
    status = 'NAO'; // Assumir que não tem água por segurança
  }

  // Mensagens
  const mensagens = {
    'SIM': 'Hoje TEM água! 💧',
    'NAO': 'Hoje NÃO tem água 😔',
    'PAUSA': 'Fornecimento em pausa ⚠️'
  };

  // Calcular próxima data com água
  let proxima = 'Calculando...';
  if (status === 'SIM') {
    const dataAmanha = new Date();
    dataAmanha.setDate(dataAmanha.getDate() + 2);
    proxima = formatarDataLegivel(dataAmanha);
  } else if (status === 'NAO') {
    const dataAmanha = new Date();
    dataAmanha.setDate(dataAmanha.getDate() + 1);
    proxima = formatarDataLegivel(dataAmanha);
  } else {
    proxima = 'Indefinido';
  }

  return {
    status,
    mensagem: mensagens[status],
    proxima
  };
}

// Exportar funções globalmente
window.utils = {
  formatarData,
  formatarDataLegivel,
  obterDataHoje,
  obterDataAmanha,
  calcularProximoDiaComAgua,
  calcularStatusEsperado,
  gerarCalendarioMes,
  ehHoje,
  ehFuturo,
  ehPassado,
  obterNomeMes,
  obterPrimeiroDiaSemana,
  verificarStatusHoje
};
