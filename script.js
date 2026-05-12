/* AgroCarbon - Lógica de Cálculo e Gráficos
    Desenvolvido para o Concurso Agrinho 2026
*/

// Variável global para controlar a instância do gráfico (evita sobreposição)
let chartInstance = null;

function gerarSimulacao() {
    // 1. Captura de dados do formulário
    const area = parseFloat(document.getElementById('area').value);
    const diesel = parseFloat(document.getElementById('diesel').value);
    const fert = parseFloat(document.getElementById('fertilizante').value);
    const pratica = document.getElementById('pratica').value;

    // Validação simples
    if (isNaN(area) || isNaN(diesel) || isNaN(fert) || area <= 0) {
        alert("Por favor, insira valores válidos para calcular.");
        return;
    }

    // 2. Definição de Fatores de Emissão (kg CO2eq por unidade)
    // Diesel: ~2.68 kg CO2 por litro
    // Fertilizante Nitrogenado: ~5.85 kg CO2eq por kg aplicado
    const emissaoDiesel = diesel * 2.68;
    const emissaoFert = fert * 5.85;
    
    // Cálculo da emissão bruta em Toneladas (dividir por 1000)
    const emissaoBruta = (emissaoDiesel + emissaoFert) / 1000;
    
    let fatorMitigacao = 1.0;
    let mensagem = "";
    let statusClass = "";

    // 3. Lógica de Práticas Sustentáveis (Equilíbrio e Futuro)
    if (pratica === "direto") {
        fatorMitigacao = 0.8; // Reduz 20% das emissões
        mensagem = "O Plantio Direto mantém a palhada no solo, evitando a liberação de carbono!";
    } else if (pratica === "ilpf") {
        fatorMitigacao = 0.4; // Reduz 60% (simulando sequestro florestal)
        mensagem = "A Integração Lavoura-Pecuária-Floresta é altamente sustentável: as árvores compensam as emissões!";
    } else {
        mensagem = "Cuidado: O manejo convencional expõe o solo e aumenta a pegada de carbono.";
    }

    const emissaoFinal = emissaoBruta * fatorMitigacao;
    const emissaoPorHa = emissaoFinal / area;

    // 4. Atualização da Interface (UI)
    const section = document.getElementById('results-section');
    section.style.display = 'block';
    
    document.getElementById('emissao-valor').innerText = emissaoFinal.toFixed(2);
    document.getElementById('feedback-texto').innerText = mensagem;

    // Define a cor do card com base na eficiência (Ton CO2/Hectare)
    const card = document.getElementById('status-card');
    if (emissaoPorHa < 0.5) {
        card.className = "card sustentavel";
    } else if (emissaoPorHa < 1.5) {
        card.className = "card alerta";
    } else {
        card.className = "card critico";
    }

    // 5. Renderização do Gráfico
    atualizarGrafico(emissaoBruta, emissaoFinal);
}

function atualizarGrafico(bruta, liquida) {
    const ctx = document.getElementById('meuGrafico').getContext('2d');
    
    // Destrói gráfico anterior para não bugar ao clicar várias vezes
    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Manejo Convencional', 'Seu Manejo Atual'],
            datasets: [{
                label: 'Toneladas de CO₂eq',
                data: [bruta.toFixed(2), liquida.toFixed(2)],
                backgroundColor: ['#e74c3c', '#2d5a27'], // Vermelho vs Verde
                borderWidth: 1,
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Comparativo de Emissões (Toneladas CO2eq)'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Ton CO2eq' }
                }
            }
        }
    });
}