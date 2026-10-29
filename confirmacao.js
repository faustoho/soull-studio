(() => {
  const form = document.getElementById('form-ciencia');
  if (!form) return;
  const button = document.getElementById('enviar-ciencia');
  const status = document.getElementById('resultado-ciencia');
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    button.disabled = true;
    status.textContent = 'Registrando sua confirmação...';
    try {
      const response = await fetch('/api/confirmacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          responsavel: String(data.get('responsavel') || '').trim(),
          aluno: String(data.get('aluno') || '').trim(),
          aceite: data.get('aceite') === 'on',
          website: String(data.get('website') || '')
        })
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || 'Não foi possível registrar.');
      status.textContent = 'Leitura confirmada e registrada em ' + new Date(result.confirmadoEm).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }) + ' (horário de Brasília). Protocolo: ' + result.protocolo + '.';
      form.reset();
    } catch (error) {
      status.textContent = 'Confirmação não registrada. ' + error.message + ' Tente novamente.';
    } finally {
      button.disabled = false;
    }
  });
})();
