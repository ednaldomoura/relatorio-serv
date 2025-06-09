// Função para exportar os dados do formulário para CSV
function exportarCSV() {
  const servico = document.getElementById('servico').value;
  const executado = document.getElementById('executado').value;
  const finalizado = document.getElementById('finalizado').value;
  const obs = document.getElementById('obs').value;
  const csv = `Serviço a ser realizado,Serviço executado por,Serviço finalizado,Observações\n"${servico}","${executado}","${finalizado}","${obs}"`;
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'relatorio-servico.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// Função para exportar os dados do formulário para PDF
function exportarPDF() {
  const servico = document.getElementById('servico').value;
  const executado = document.getElementById('executado').value;
  const finalizado = document.getElementById('finalizado').value;
  const obs = document.getElementById('obs').value;
  const win = window.open('', '', 'width=800,height=600');
  win.document.write('<html><head><title>Relatório de Serviços</title></head><body>');
  win.document.write('<h2>Relatório de Serviços</h2>');
  win.document.write(`<p><b>Serviço a ser realizado:</b> ${servico}</p>`);
  win.document.write(`<p><b>Serviço executado por:</b> ${executado}</p>`);
  win.document.write(`<p><b>Serviço finalizado:</b> ${finalizado}</p>`);
  win.document.write(`<p><b>Observações:</b> ${obs}</p>`);
  win.document.write('</body></html>');
  win.document.close();
  win.print();
}

// Função para exportar por e-mail (Gmail)
function exportarEmail() {
  const servico = document.getElementById('servico').value;
  const executado = document.getElementById('executado').value;
  const finalizado = document.getElementById('finalizado').value;
  const obs = document.getElementById('obs').value;
  const subject = encodeURIComponent('Relatório de Serviços');
  const body = encodeURIComponent(
    `Serviço a ser realizado: ${servico}\nServiço executado por: ${executado}\nServiço finalizado: ${finalizado}\nObservações: ${obs}`
  );
  window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=&su=${subject}&body=${body}`);
}

let indiceEdicao = null;

function salvarRelatorioNaTela(e) {
  if (e) e.preventDefault();
  const servico = document.getElementById('servico').value;
  const executado = document.getElementById('executado').value;
  const dataInicio = document.getElementById('data-inicio').value;
  const dataFinalizado = document.getElementById('data-finalizado').value;
  const obs = document.getElementById('obs').value;
  const novoRelatorio = { servico, executado, dataInicio, dataFinalizado, obs };
  let relatorios = JSON.parse(localStorage.getItem('relatoriosServicos')) || [];
  if (indiceEdicao !== null) {
    relatorios[indiceEdicao] = novoRelatorio;
    indiceEdicao = null;
  } else {
    relatorios.push(novoRelatorio);
  }
  localStorage.setItem('relatoriosServicos', JSON.stringify(relatorios));
  mostrarRelatoriosNaTela(relatorios);
  // Limpa o formulário após salvar/editar
  document.getElementById('servico').value = '';
  document.getElementById('executado').value = '';
  document.getElementById('data-inicio').value = '';
  document.getElementById('data-finalizado').value = '';
  document.getElementById('obs').value = '';
}

function mostrarRelatoriosNaTela(relatorios) {
  const container = document.getElementById('relatorios-salvos');
  if (!container) return;
  if (relatorios.length === 0) {
    container.classList.add('hidden');
    return;
  }
  container.classList.remove('hidden');
  let html = `<h2 class='text-xl font-bold mb-4'>Relatórios Salvos</h2>`;
  relatorios.forEach((dados, idx) => {
    html += `
      <div class="bg-gray-100 p-4 rounded-lg shadow-inner mb-4">
        <p class="text-gray-700"><span class="font-semibold">Serviço:</span> ${dados.servico}</p>
        <p class="text-gray-700"><span class="font-semibold">Executado por:</span> ${dados.executado}</p>
        <p class="text-gray-700"><span class="font-semibold">Data de Início:</span> ${dados.dataInicio || ''}</p>
        <p class="text-gray-700"><span class="font-semibold">Data da Finalização:</span> ${dados.dataFinalizado || ''}</p>
        <p class="text-gray-700"><span class="font-semibold">Observações:</span> ${dados.obs}</p>
        <div class="flex gap-2 mt-2">
          <button type="button" onclick="editarRelatorio(${idx})" class="bg-blue-500 text-white font-bold py-1 px-4 rounded hover:bg-blue-600 transition">Editar</button>
          <button type="button" onclick="excluirRelatorio(${idx})" class="bg-red-500 text-white font-bold py-1 px-4 rounded hover:bg-red-600 transition">Excluir</button>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
}

function carregarRelatoriosSalvos() {
  let relatorios = JSON.parse(localStorage.getItem('relatoriosServicos')) || [];
  mostrarRelatoriosNaTela(relatorios);
}

window.editarRelatorio = function(idx) {
  let relatorios = JSON.parse(localStorage.getItem('relatoriosServicos')) || [];
  const dados = relatorios[idx];
  document.getElementById('servico').value = dados.servico;
  document.getElementById('executado').value = dados.executado;
  document.getElementById('data-inicio').value = dados.dataInicio || '';
  document.getElementById('data-finalizado').value = dados.dataFinalizado || '';
  document.getElementById('obs').value = dados.obs;
  indiceEdicao = idx;
  document.querySelector('form').scrollIntoView({ behavior: 'smooth' });
}

window.excluirRelatorio = function(idx) {
  let relatorios = JSON.parse(localStorage.getItem('relatoriosServicos')) || [];
  relatorios.splice(idx, 1);
  localStorage.setItem('relatoriosServicos', JSON.stringify(relatorios));
  mostrarRelatoriosNaTela(relatorios);
}

document.addEventListener('DOMContentLoaded', function() {
  carregarRelatoriosSalvos();
  document.querySelector('form').addEventListener('submit', salvarRelatorioNaTela);
});
