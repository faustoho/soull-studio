CREATE TABLE IF NOT EXISTS confirmacoes_leitura (
  protocolo TEXT PRIMARY KEY,
  responsavel TEXT NOT NULL,
  aluno TEXT NOT NULL,
  confirmado_em TEXT NOT NULL,
  versao_orientacoes TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_confirmacoes_aluno ON confirmacoes_leitura(aluno);
CREATE INDEX IF NOT EXISTS idx_confirmacoes_data ON confirmacoes_leitura(confirmado_em);
