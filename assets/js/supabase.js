// ===========================
// CONFIGURAÇÃO SUPABASE
// ===========================

// Credenciais públicas do Supabase (anon key é segura para frontend)
// O Supabase protege os dados via RLS (Row Level Security)
const SUPABASE_URL = 'https://kfoiorczgjnngnymzhqz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtmb2lvcmN6Z2pubmdueW16aHF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0NDAwMzYsImV4cCI6MjA3NTAxNjAzNn0.cNe_3myVQ9mRxGkZWB1_r_hBpml1Q8YV0PNprdq37Kk';

// Inicializar cliente Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===========================
// FUNÇÕES DE BANCO DE DADOS
// ===========================

/**
 * Busca o status de um dia específico
 * @param {string} data - Data no formato YYYY-MM-DD
 * @returns {Promise<Object|null>} Objeto com {data, status} ou null
 */
async function buscarStatus(data) {
  try {
    const { data: resultado, error } = await supabase
      .from('ciclo_agua')
      .select('*')
      .eq('data', data)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = registro não encontrado
      console.error('Erro ao buscar status:', error);
      throw error;
    }

    return resultado;
  } catch (erro) {
    console.error('Erro na busca:', erro);
    return null;
  }
}

/**
 * Salva ou atualiza o status de um dia
 * @param {string} data - Data no formato YYYY-MM-DD
 * @param {string} status - 'SIM', 'NAO' ou 'PAUSA'
 * @returns {Promise<boolean>} true se sucesso, false se erro
 */
async function salvarStatus(data, status) {
  try {
    // Validar status
    if (!['SIM', 'NAO', 'PAUSA'].includes(status)) {
      throw new Error('Status inválido. Use: SIM, NAO ou PAUSA');
    }

    // Tentar inserir ou atualizar (upsert)
    const { error } = await supabase
      .from('ciclo_agua')
      .upsert({ data, status }, { onConflict: 'data' });

    if (error) {
      console.error('Erro ao salvar status:', error);
      throw error;
    }

    console.log(`Status salvo: ${data} = ${status}`);
    return true;
  } catch (erro) {
    console.error('Erro ao salvar:', erro);
    return false;
  }
}

/**
 * Busca histórico de registros manuais
 * @param {number} limite - Quantidade de registros (padrão: 5)
 * @returns {Promise<Array>} Array de objetos {data, status, created_at}
 */
async function buscarHistorico(limite = 5) {
  try {
    const { data, error } = await supabase
      .from('ciclo_agua')
      .select('*')
      .order('data', { ascending: false })
      .limit(limite);

    if (error) {
      console.error('Erro ao buscar histórico:', error);
      throw error;
    }

    return data || [];
  } catch (erro) {
    console.error('Erro no histórico:', erro);
    return [];
  }
}

/**
 * Busca todos os registros de um mês específico
 * @param {number} mes - Mês (1-12)
 * @param {number} ano - Ano (ex: 2025)
 * @returns {Promise<Array>} Array de objetos {data, status}
 */
async function buscarMes(mes, ano) {
  try {
    // Criar range de datas do mês
    const dataInicio = `${ano}-${String(mes).padStart(2, '0')}-01`;
    const ultimoDia = new Date(ano, mes, 0).getDate();
    const dataFim = `${ano}-${String(mes).padStart(2, '0')}-${ultimoDia}`;

    const { data, error } = await supabase
      .from('ciclo_agua')
      .select('*')
      .gte('data', dataInicio)
      .lte('data', dataFim)
      .order('data', { ascending: true });

    if (error) {
      console.error('Erro ao buscar mês:', error);
      throw error;
    }

    return data || [];
  } catch (erro) {
    console.error('Erro ao buscar mês:', erro);
    return [];
  }
}

/**
 * Busca o último registro confirmado (usado para calcular ciclo)
 * @returns {Promise<Object|null>} Último registro ou null
 */
async function buscarUltimoRegistro() {
  try {
    const { data, error } = await supabase
      .from('ciclo_agua')
      .select('*')
      .order('data', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Erro ao buscar último registro:', error);
      throw error;
    }

    return data;
  } catch (erro) {
    console.error('Erro:', erro);
    return null;
  }
}

/**
 * Seed inicial: popular banco com dados iniciais
 * Ontem = SIM, Hoje = NAO, Amanhã = SIM
 */
async function seedInicial() {
  try {
    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(hoje.getDate() - 1);
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);

    const registros = [
      { data: formatarData(ontem), status: 'SIM' },
      { data: formatarData(hoje), status: 'NAO' },
      { data: formatarData(amanha), status: 'SIM' }
    ];

    for (const registro of registros) {
      await salvarStatus(registro.data, registro.status);
    }

    console.log('Seed inicial concluído!');
    return true;
  } catch (erro) {
    console.error('Erro no seed:', erro);
    return false;
  }
}

/**
 * Formatar Date para string YYYY-MM-DD
 * @param {Date} data
 * @returns {string}
 */
function formatarData(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

// Exportar funções globalmente para uso em outras páginas
window.aguaHoje = {
  buscarStatus,
  salvarStatus,
  buscarHistorico,
  buscarMes,
  buscarUltimoRegistro,
  seedInicial
};
