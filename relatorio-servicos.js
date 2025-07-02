// Function to get form data
function getFormData() {
    const dataInicio = document.getElementById('data-inicio').value;
    const obs = document.getElementById('obs').value;

    return {
        dataInicio: dataInicio,
        observacoes: obs || 'Nenhuma observação', // Default if not provided
        timestamp: new Date().toISOString() // To uniquely identify and sort reports
    };
}

// Function to save a report to localStorage
function salvarRelatorio() {
    const report = getFormData();
    if (!report.dataInicio) {
        alert("Por favor, preencha a Data de Início.");
        return;
    }

    let reports = JSON.parse(localStorage.getItem('serviceReports')) || [];
    reports.push(report);
    localStorage.setItem('serviceReports', JSON.stringify(reports));

    alert("Relatório salvo com sucesso!");
    displaySavedReports(); // Update the displayed list
    document.getElementById('reportForm').reset(); // Clear the form
}

// Function to display saved reports on the screen
function displaySavedReports() {
    const savedReportsList = document.getElementById('saved-reports-list');
    savedReportsList.innerHTML = ''; // Clear previous entries

    let reports = JSON.parse(localStorage.getItem('serviceReports')) || [];

    if (reports.length === 0) {
        savedReportsList.innerHTML = '<p class="text-center text-gray-500">Nenhum relatório salvo ainda.</p>';
        return;
    }

    // Sort reports by timestamp, newest first
    reports.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    reports.forEach((report, index) => {
        const reportCard = document.createElement('div');
        reportCard.className = 'bg-gray-50 p-4 rounded-md shadow-sm border border-gray-200';
        reportCard.innerHTML = `
            <p class="font-semibold text-lg text-blue-700">Relatório #${reports.length - index}</p>
            <p><span class="font-medium">Início:</span> ${report.dataInicio}</p>
            <p><span class="font-medium">Obs:</span> ${report.observacoes}</p>
            <div class="mt-3 flex gap-2 justify-end">
                <button onclick="excluirRelatorio(${index})" class="bg-red-400 text-white px-3 py-1 rounded hover:bg-red-500 transition text-sm">Excluir</button>
            </div>
        `;
        savedReportsList.appendChild(reportCard);
    });
}

// Function to delete a specific report
function excluirRelatorio(indexToRemove) {
    let reports = JSON.parse(localStorage.getItem('serviceReports')) || [];
    reports.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Sort the array as it's displayed
    if (confirm("Tem certeza que deseja excluir este relatório?")) {
        reports.splice(indexToRemove, 1); // Remove the item at the given index
        localStorage.setItem('serviceReports', JSON.stringify(reports));
        displaySavedReports(); // Refresh the list
    }
}

// Function to clear all saved reports
function limparRelatorios() {
    if (confirm("Tem certeza que deseja limpar TODOS os relatórios salvos?")) {
        localStorage.removeItem('serviceReports');
        displaySavedReports(); // Update the display
        alert("Todos os relatórios foram limpos.");
    }
}

// Function to export current form data to CSV
function exportarCSV() {
    const report = getFormData();
    const csvContent = "data:text/csv;charset=utf-8,"
        + "Data de Início,Observações\n"
        + `"${report.dataInicio}","${report.observacoes.replace(/"/g, '""')}"`; // Handle quotes in observations

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "relatorio_servico.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert("Relatório exportado como CSV!");
}

// Function to export current form data to PDF
async function exportarPDF() {
    const report = getFormData();
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Relatório de Serviço", 10, 10);

    doc.setFontSize(12);
    doc.text(`Data de Início: ${report.dataInicio}`, 10, 30);
    doc.text("Observações:", 10, 40);

    const splitObs = doc.splitTextToSize(report.observacoes, 180);
    doc.text(splitObs, 10, 50);

    doc.save("relatorio_servico.pdf");
    alert("Relatório exportado como PDF!");
}

// Function to export current form data via Email
function exportarEmail() {
    const report = getFormData();
    const subject = encodeURIComponent("Relatório de Serviço");
    const body = encodeURIComponent(
        `Detalhes do Relatório:\n\n` +
        `Data de Início: ${report.dataInicio}\n` +
        `Observações: ${report.observacoes}`
    );

    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    alert("Seu cliente de e-mail será aberto com o relatório preenchido.");
}

// Load saved reports when the page loads
document.addEventListener('DOMContentLoaded', displaySavedReports);