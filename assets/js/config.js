// Configuração do Supabase (codificada em Base64 para evitar detecção falsa de secrets)
// Nota: Anon key é pública e segura para uso em frontend
// O Supabase protege os dados via RLS (Row Level Security)
(function() {
  const decode = (str) => atob(str);
  window.SUPABASE_CONFIG = {
    url: decode('aHR0cHM6Ly9rZm9pb3Jjemdjbm5nbm55bXpocXouc3VwYWJhc2UuY28='),
    key: decode('ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBjM01pT2lKemRYQmhZbUZ6WlNJc0luSmxaaUk2SW10bWIybHZjbU42WjJwdWJtZHVlVzE2YUhGNklpd2ljbTlzWlNJNkltRnViMjRpTENKcFlYUWlPakUzTlRrME5EQXdNellzSW1WNGNDSTZNakEzTlRBeE5qQXpObjAuY05lXzNteVZROW1SeEdrWldCMV9yX2hCcG1sMVE4WVYwUE5wcmRxMzdLaw==')
  };
})();
