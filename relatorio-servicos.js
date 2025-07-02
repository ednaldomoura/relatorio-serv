// Function to get form data
function getFormData() {
    const dataInicio = document.getElementById('data-inicio').value;
    const obs = document.getElementById('obs').value;
    const reportId = document.getElementById('report-id').value; // Get the hidden report ID

    return {
        id: reportId || Date.now().toString() + Math.random().toString(36).substr(2, 9), // Ensure unique ID for new reports
        dataInicio: dataInicio,
        observacoes: obs || 'Nenhuma observação',
        timestamp: new Date().toISOString() // Always update timestamp on save/edit
    };
}

// Function to save or update a report to localStorage
function salvarRelatorio() {
    const reportData = getFormData();
    if (!reportData.dataInicio) {
        alert("Por favor, preencha a Data de Início.");
        return;
    }

    let reports = JSON.parse(localStorage.getItem('serviceReports')) || [];
    let reportFoundAndUpdated = false;

    // Check if we are editing an existing report by its unique ID
    if (reportData.id) {
        for (let i = 0; i < reports.length; i++) {
            if (reports[i].id === reportData.id) {
                reports[i] = reportData; // Update the existing report with new data
                reportFoundAndUpdated = true;
                break;
            }
        }
    }

    // If the report was not found (meaning it's new or had an invalid ID), add it
    if (!reportFoundAndUpdated) {
        reports.push(reportData);
    }
    
    localStorage.setItem('serviceReports', JSON.stringify(reports));

    alert(reportFoundAndUpdated ? "Relatório atualizado com sucesso!" : "Relatório salvo com sucesso!");
    
    // Clear the form and the hidden ID field after saving/updating
    document.getElementById('reportForm').reset();
    document.getElementById('report-id').value = ""; 
    
    displaySavedReports(); // Update the displayed list
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
                <button onclick="editarRelatorio('${report.id}')" class="bg-blue-400 text-white px-3 py-1 rounded hover:bg-blue-500 transition text-sm">Editar</button>
                <button onclick="excluirRelatorio('${report.id}')" class="bg-red-400 text-white px-3 py-1 rounded hover:bg-red-500 transition text-sm">Excluir</button>
            </div>
        `;
        savedReportsList.appendChild(reportCard);
    });
}

// Function to edit a specific report
function editarRelatorio(reportId) {
    let reports = JSON.parse(localStorage.getItem('serviceReports')) || [];
    const reportToEdit = reports.find(report => report.id === reportId);

    if (reportToEdit) {
        document.getElementById('data-inicio').value = reportToEdit.dataInicio;
        document.getElementById('obs').value = reportToEdit.observacoes;
        document.getElementById('report-id').value = reportToEdit.id; // Crucial: Store the report's ID in the hidden field
        document.getElementById('reportForm').scrollIntoView({ behavior: 'smooth' }); // Scroll to the form
    } else {
        alert("Relatório não encontrado para edição.");
    }
}

// Function to delete a specific report by ID
function excluirRelatorio(reportId) {
    let reports = JSON.parse(localStorage.getItem('serviceReports')) || [];
    
    if (confirm("Tem certeza que deseja excluir este relatório?")) {
        // Filter out the report with the matching ID
        reports = reports.filter(report => report.id !== reportId);
        localStorage.setItem('serviceReports', JSON.stringify(reports));
        displaySavedReports(); // Refresh the list
        
        // If the deleted report was the one currently being edited, clear the form
        if (document.getElementById('report-id').value === reportId) {
            document.getElementById('reportForm').reset();
            document.getElementById('report-id').value = "";
        }
        alert("Relatório excluído com sucesso!");
    }
}

// Function to clear all saved reports
function limparRelatorios() {
    if (confirm("Tem certeza que deseja limpar TODOS os relatórios salvos?")) {
        localStorage.removeItem('serviceReports');
        displaySavedReports(); // Update the display
        document.getElementById('reportForm').reset(); // Clear form as well
        document.getElementById('report-id').value = ""; // Clear hidden ID
        alert("Todos os relatórios foram limpos.");
    }
}

// Function to export current form data to CSV
function exportarCSV() {
    const report = getFormData(); // Get data from the form
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
    const report = getFormData(); // Get data from the form
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
    const report = getFormData(); // Get data from the form
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