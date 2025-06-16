// Business Model Data
const businessModel = {
    baseScenario: {
        revenue: 10000000,
        ebitda: 3200000,
        transactions: 1200000,
        costPercentage: 60,
        expensePercentage: 8,
        successRate: 98,
        nps: 65,
        churnRate: 5,
        uptime: 99.95
    },
    optimisticScenario: {
        revenue: 12000000,
        ebitda: 4200000,
        transactions: 1500000,
        costPercentage: 55,
        expensePercentage: 7,
        successRate: 99,
        nps: 70,
        churnRate: 4,
        uptime: 99.98
    },
    pessimisticScenario: {
        revenue: 8000000,
        ebitda: 2200000,
        transactions: 900000,
        costPercentage: 65,
        expensePercentage: 9,
        successRate: 95,
        nps: 60,
        churnRate: 7,
        uptime: 99.90
    },
    bcgMatrix: {
        remesas: { marketShare: 3, growth: 300, size: 10 },
        cripto: { marketShare: 15, growth: 120, size: 15 },
        transferenciasPull: { marketShare: 35, growth: 70, size: 20 },
        pagos: { marketShare: 25, growth: 5, size: 15 },
        transferenciasRecurrentes: { marketShare: 8, growth: -10, size: 8 },
        serviciosPSP: { marketShare: 20, growth: 15, size: 25 }, // Estrella
        extraccion: { marketShare: 5, growth: -15, size: 5 }, // Perro
        tarjetas: { marketShare: 25, growth: 5, size: 15 }, // Vaca Lechera
    },
    porterForces: {
        entrantes: { intensity: 4, impact: "Fintechs como Nubank" },
        proveedores: { intensity: 3, impact: "Dependencia de ACI" },
        clientes: { intensity: 4, impact: "Meli tiene gran poder" },
        sustitutos: { intensity: 3, impact: "Criptomonedas" },
        rivalidad: { intensity: 4, impact: "Coelsa y Link dominan" }
    },
    pestelAnalysis: {
        politico: { impact: 7, items: [
            "Apertura financiera en Argentina",
            "Nuevas regulaciones de pagos",
            "Presión para inclusión financiera"
        ]},
        economico: { impact: 8, items: [
            "Crecimiento del 70% YoY en transacciones",
            "Inflación impacta costos",
            "Oportunidad en remesas"
        ]},
        social: { impact: 9, items: [
            "Demanda de inmediatez (Gen Z)",
            "Adopción masiva de móviles",
            "Desconfianza en bancos tradicionales"
        ]},
        tecnologico: { impact: 8, items: [
            "Blockchain para remesas",
            "APIs abiertas (Open Finance)",
            "IA para prevención de fraude"
        ]},
        ecologico: { impact: 4, items: [
            "Huella de carbono en data centers",
            "Presión por operaciones paperless",
            "Energías renovables para infraestructura"
        ]},
        legal: { impact: 6, items: [
            "Regulación de criptoactivos",
            "Leyes de protección de datos",
            "Nuevas normas contra lavado"
        ]}
    },
    opportunities: [
        { title: "Remesas con Cripto", description: "Aprovechar la nueva regulación para capturar el mercado de remesas USA-Latam (crecimiento del 300%)" },
        { title: "Open Finance", description: "Posicionarse como plataforma de integración para fintechs y bancos tradicionales" }
    ]
};

// Current state
let currentScenario = 'base';
let editableActive = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScenarioControls();
    initPLControls();
    initBCGControls();
    initPorterControls();
    initPESTELControls();
    initSimulatorControls();
    initEditableCells();
    initEditableListItems();
    updateAllCharts();
    updateDashboard();
});

// Initialize navigation
function initNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active link
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Hide all sections
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.add('hidden');
            });
            
            // Show selected section
            const sectionId = this.getAttribute('data-section') + '-section';
            document.getElementById(sectionId).classList.remove('hidden');
        });
    });
}

// Initialize scenario controls
function initScenarioControls() {
    document.querySelectorAll('.scenario-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.scenario-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            currentScenario = this.getAttribute('data-scenario');
            updateDashboard();
        });
    });
}

// Initialize P&L controls
function initPLControls() {
    // Transaction volume input
    document.getElementById('transaction-volume').addEventListener('input', function() {
        const volume = parseFloat(this.value) || 0;
        updatePL(volume);
    });
    
    // Percentage inputs
    document.getElementById('income-percent').addEventListener('input', function() {
        updatePLPercentages();
    });
    
    document.getElementById('cost-percent').addEventListener('input', function() {
        updatePLPercentages();
    });
    
    document.getElementById('expense-percent').addEventListener('input', function() {
        updatePLPercentages();
    });
}

// Initialize BCG controls
function initBCGControls() {
    // Update BCG button
    document.getElementById('update-bcg').addEventListener('click', function() {
        const product = document.getElementById('bcg-product').value;
        const marketShare = parseFloat(document.getElementById('bcg-market-share').value) || 0;
        const growth = parseFloat(document.getElementById('bcg-growth').value) || 0;
        
        if (marketShare && growth) {
            updateBCGProduct(product, marketShare, growth);
        }
    });
    
    // Populate BCG inputs when product changes
    document.getElementById('bcg-product').addEventListener('change', function() {
        const product = this.value;
        const productData = businessModel.bcgMatrix[product];
        
        document.getElementById('bcg-market-share').value = productData.marketShare;
        document.getElementById('bcg-growth').value = productData.growth;
    });
}

// Initialize Porter controls
function initPorterControls() {
    // No additional controls needed beyond editable cells
}

// Initialize PESTEL controls
function initPESTELControls() {
    document.getElementById('update-pestel').addEventListener('click', function() {
        updatePESTELImpacts();
    });
}

// Initialize Simulator controls
function initSimulatorControls() {
    // Scenario selector
    document.getElementById('decision-scenario').addEventListener('change', function() {
        document.querySelectorAll('.scenario-options').forEach(opt => {
            opt.classList.add('hidden');
        });
        
        document.getElementById(this.value + '-options').classList.remove('hidden');
    });
    
    // Crypto simulation
    document.getElementById('simulate-crypto').addEventListener('click', simulateCrypto);
    document.getElementById('apply-crypto').addEventListener('click', applyCryptoChanges);
    
    // Fintech simulation
    document.getElementById('simulate-fintech').addEventListener('click', simulateFintech);
    document.getElementById('apply-fintech').addEventListener('click', applyFintechChanges);
    
    // Product simulation
    document.getElementById('simulate-product').addEventListener('click', simulateProduct);
    document.getElementById('apply-product').addEventListener('click', applyProductChanges);
    
    // BCG simulation
    document.getElementById('simulate-bcg').addEventListener('click', simulateBCG);
    document.getElementById('apply-bcg').addEventListener('click', applyBCGChanges);
    
    // PESTEL simulation
    document.getElementById('simulate-pestel').addEventListener('click', simulatePESTEL);
    document.getElementById('apply-pestel').addEventListener('click', applyPESTELChanges);
}

// Initialize editable cells
function initEditableCells() {
    document.querySelectorAll('.editable-cell').forEach(cell => {
        cell.addEventListener('click', function(e) {
            if (editableActive) return;
            
            const originalContent = this.textContent;
            const isCurrency = originalContent.includes('$');
            const isPercentage = originalContent.includes('%');
            const isPorterIntensity = this.closest('tr') && this.closest('tr').dataset.force && !originalContent.includes('%');
            
            let inputType = 'text';
            if (isCurrency || isPercentage || isPorterIntensity) {
                let value = originalContent.replace(/[^0-9.-]/g, '');
                if (isCurrency) {
                    value = value || '0';
                } else if (isPercentage) {
                    value = value || '0';
                } else if (isPorterIntensity) {
                    value = value || '1';
                }
                
                const input = document.createElement('input');
                input.type = 'number';
                input.value = value;
                input.classList.add('editable-input');
                if (isPercentage) {
                    input.min = -100;
                    input.max = 1000;
                } else if (isPorterIntensity) {
                    input.min = 1;
                    input.max = 5;
                    input.step = 1;
                } else {
                    input.min = 0;
                }
                
                input.addEventListener('blur', function() {
                    finishEditing(cell, input.value, isCurrency, isPercentage, isPorterIntensity);
                });
                
                input.addEventListener('keyup', function(e) {
                    if (e.key === 'Enter') {
                        finishEditing(cell, input.value, isCurrency, isPercentage, isPorterIntensity);
                    } else if (e.key === 'Escape') {
                        cancelEditing(cell, originalContent);
                    }
                });
                
                this.innerHTML = '';
                this.appendChild(input);
                input.focus();
                editableActive = cell;
            } else {
                const textarea = document.createElement('textarea');
                textarea.value = originalContent;
                textarea.classList.add('editable-textarea');
                
                textarea.addEventListener('blur', function() {
                    finishTextEditing(cell, textarea.value);
                });
                
                textarea.addEventListener('keyup', function(e) {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        finishTextEditing(cell, textarea.value);
                    } else if (e.key === 'Escape') {
                        cancelEditing(cell, originalContent);
                    }
                });
                
                this.innerHTML = '';
                this.appendChild(textarea);
                textarea.focus();
                editableActive = cell;
            }
        });
    });
}

// Initialize editable list items
function initEditableListItems() {
    document.querySelectorAll('.editable-list-item').forEach(item => {
        item.addEventListener('click', function(e) {
            if (editableActive) return;
            
            const originalContent = this.textContent;
            const input = document.createElement('input');
            input.type = 'text';
            input.value = originalContent;
            input.classList.add('editable-input');
            
            input.addEventListener('blur', function() {
                finishTextEditing(item, input.value);
            });
            
            input.addEventListener('keyup', function(e) {
                if (e.key === 'Enter') {
                    finishTextEditing(item, input.value);
                } else if (e.key === 'Escape') {
                    cancelEditing(item, originalContent);
                }
            });
            
            this.innerHTML = '';
            this.appendChild(input);
            input.focus();
            editableActive = item;
        });
    });
}

// Finish editing a cell
function finishEditing(cell, value, isCurrency, isPercentage, isPorterIntensity = false) {
    let displayValue = value;
    
    if (isCurrency) {
        const numValue = parseFloat(value) || 0;
        displayValue = formatCurrency(numValue);
        
        // Update business model if this is a P&L cell
        if (cell.id === 'operating-income') {
            getCurrentScenarioData().revenue = numValue;
        } else if (cell.id === 'direct-costs') {
            getCurrentScenarioData().costPercentage = (numValue / getCurrentScenarioData().revenue) * 100;
        } else if (cell.id === 'operating-expenses') {
            getCurrentScenarioData().expensePercentage = (numValue / getCurrentScenarioData().revenue) * 100;
        }
    } else if (isPercentage) {
        const numValue = parseFloat(value) || 0;
        displayValue = numValue + '%';
        
        // Update BCG matrix if this is a BCG cell
        const row = cell.closest('tr');
        if (row && row.dataset.product) {
            if (cell.textContent.includes('%') && cell.textContent.includes('.')) {
                // Market share
                businessModel.bcgMatrix[row.dataset.product].marketShare = numValue;
            } else {
                // Growth rate
                businessModel.bcgMatrix[row.dataset.product].growth = numValue;
            }
            updateBCGChart();
        }
    } else if (isPorterIntensity) {
        const numValue = parseInt(value) || 1;
        displayValue = getPorterIntensityLabel(numValue);
        
        // Update Porter forces
        const row = cell.closest('tr');
        if (row && row.dataset.force) {
            businessModel.porterForces[row.dataset.force].intensity = numValue;
            updatePorterChart();
        }
    }
    
    cell.textContent = displayValue;
    editableActive = null;
    
    // Update dashboard if any financial metric changed
    if (cell.id === 'operating-income' || cell.id === 'direct-costs' || cell.id === 'operating-expenses' || 
        cell.id === 'gross-margin' || cell.id === 'ebitda') {
        updateDashboard();
    }
}

// Get Porter intensity label
function getPorterIntensityLabel(value) {
    const labels = {
        1: 'Muy Bajo',
        2: 'Bajo',
        3: 'Medio',
        4: 'Alto',
        5: 'Muy Alto'
    };
    return labels[value] || value;
}

// Finish text editing
function finishTextEditing(element, value) {
    element.textContent = value;
    editableActive = null;
    
    // Update business model if this is a Porter impact
    const row = element.closest('tr');
    if (row && row.dataset.force) {
        businessModel.porterForces[row.dataset.force].impact = value;
    }
    
    // Update business model if this is a PESTEL item
    const list = element.closest('ul');
    if (list) {
        const listId = list.id;
        if (listId && listId.includes('-list')) {
            const category = listId.replace('-list', '');
            if (businessModel.pestelAnalysis[category]) {
                const items = Array.from(list.querySelectorAll('li')).map(li => li.textContent);
                businessModel.pestelAnalysis[category].items = items;
            }
        }
    }
    
    // Update business model if this is an opportunity
    const opportunityCard = element.closest('.kpi-card');
    if (opportunityCard) {
        const title = opportunityCard.querySelector('h4');
        const description = opportunityCard.querySelector('p');
        if (element === title) {
            businessModel.opportunities[0].title = value;
        } else if (element === description) {
            businessModel.opportunities[0].description = value;
        }
    }
}

// Cancel editing
function cancelEditing(element, originalContent) {
    element.textContent = originalContent;
    editableActive = null;
}

// Update P&L based on volume
function updatePL(volume) {
    const scenarioData = getCurrentScenarioData();
    const baseVolume = 1.2;
    const income = (volume / baseVolume) * scenarioData.revenue;
    const costs = income * (scenarioData.costPercentage / 100);
    const expenses = income * (scenarioData.expensePercentage / 100);
    const ebitda = income - costs - expenses;
    
    document.getElementById('operating-income').textContent = formatCurrency(income);
    document.getElementById('direct-costs').textContent = formatCurrency(costs);
    document.getElementById('gross-margin').textContent = formatCurrency(income - costs);
    document.getElementById('operating-expenses').textContent = formatCurrency(expenses);
    document.getElementById('ebitda').textContent = formatCurrency(ebitda);
    
    // Update percentages
    document.getElementById('income-percent-display').textContent = '100%';
    document.getElementById('cost-percent-display').textContent = scenarioData.costPercentage + '%';
    document.getElementById('gross-margin-percent').textContent = (100 - scenarioData.costPercentage) + '%';
    document.getElementById('expense-percent-display').textContent = scenarioData.expensePercentage + '%';
    document.getElementById('ebitda-percent').textContent = (100 - scenarioData.costPercentage - scenarioData.expensePercentage) + '%';
    
    // Update KPIs
    const costPerTxn = (costs + expenses) / (volume * 1000000);
    document.getElementById('cost-per-txn').textContent = '$' + costPerTxn.toFixed(2);
    document.getElementById('op-efficiency').textContent = Math.round((ebitda / income) * 100) + '%';
    
    // Update charts
    updatePLChart(income, costs, expenses);
    updateKPIsChart();
    updateDashboard();
}

// Update P&L percentages
function updatePLPercentages() {
    const incomePercent = parseFloat(document.getElementById('income-percent').value) || 100;
    const costPercent = parseFloat(document.getElementById('cost-percent').value) || 60;
    const expensePercent = parseFloat(document.getElementById('expense-percent').value) || 8;
    
    // Update business model
    const scenarioData = getCurrentScenarioData();
    scenarioData.costPercentage = costPercent;
    scenarioData.expensePercentage = expensePercent;
    
    // Recalculate with current volume
    updatePL(document.getElementById('transaction-volume').value);
}

// Update BCG product
function updateBCGProduct(product, marketShare, growth) {
    // Update business model
    businessModel.bcgMatrix[product].marketShare = marketShare;
    businessModel.bcgMatrix[product].growth = growth;
    
    // Update size based on growth and market share
    const size = Math.sqrt(marketShare * Math.abs(growth)) / 2;
    businessModel.bcgMatrix[product].size = size;
    
    // Update table
    const row = document.querySelector(`tr[data-product="${product}"]`);
    if (row) {
        row.querySelector('td:nth-child(2)').textContent = marketShare + '%';
        row.querySelector('td:nth-child(3)').textContent = growth + '%';
        
        // Update classification
        let classification = '';
        let recommendation = '';
        
        if (marketShare >= 20 && growth >= 10) {
            classification = 'Estrella';
            recommendation = 'Invertir para mantener liderazgo';
        } else if (marketShare < 20 && growth >= 10) {
            classification = 'Estrella Emergente';
            recommendation = 'Aumentar inversión';
        } else if (marketShare >= 15 && growth < 10) {
            classification = 'Vaca Lechera';
            recommendation = 'Mantener, generar cash flow';
        } else if (growth >= 20) {
            classification = 'Interrogante';
            recommendation = 'Evaluar potencial';
        } else {
            classification = 'Perro';
            recommendation = 'Desinvertir';
        }
        
        row.querySelector('td:nth-child(4)').textContent = classification;
        row.querySelector('td:nth-child(5)').textContent = recommendation;
    }
    
    // Update chart
    updateBCGChart();
    
    // Update dashboard if this affects financials
    if (product === 'transferencias' || product === 'qr') {
        updateDashboard();
    }
}

// Update PESTEL impacts
function updatePESTELImpacts() {
    businessModel.pestelAnalysis.politico.impact = parseInt(document.getElementById('politico-impact').value) || 7;
    businessModel.pestelAnalysis.economico.impact = parseInt(document.getElementById('economico-impact').value) || 8;
    businessModel.pestelAnalysis.social.impact = parseInt(document.getElementById('social-impact').value) || 9;
    businessModel.pestelAnalysis.tecnologico.impact = parseInt(document.getElementById('tecnologico-impact').value) || 8;
    businessModel.pestelAnalysis.ecologico.impact = parseInt(document.getElementById('ecologico-impact').value) || 4;
    businessModel.pestelAnalysis.legal.impact = parseInt(document.getElementById('legal-impact').value) || 6;
    
    // Update dashboard as PESTEL changes might affect NPS and other metrics
    updateDashboard();
}

// Simulate crypto investment
function simulateCrypto() {
    const investment = parseInt(document.getElementById('crypto-investment').value) || 0;
    const adoption = parseInt(document.getElementById('crypto-adoption').value) || 0;
    
    // Simple simulation logic
    const roi = 15 + (adoption / 2) + (investment > 2000000 ? 10 : 0);
    const marketShare = Math.min(15, 3 + (adoption / 10));
    const ebitdaImpact = 5 + (adoption / 5);
    const npsImpact = 3 + (adoption / 20);
    
    document.getElementById('crypto-roi').textContent = roi + '%';
    document.getElementById('crypto-market-share').textContent = marketShare + '%';
    document.getElementById('crypto-ebitda-impact').textContent = '+' + ebitdaImpact + '%';
    document.getElementById('crypto-nps-impact').textContent = '+' + npsImpact + ' puntos';
    
    document.getElementById('crypto-results').style.display = 'block';
}

// Apply crypto changes
function applyCryptoChanges() {
    const adoption = parseInt(document.getElementById('crypto-adoption').value) || 0;
    const ebitdaImpact = 5 + (adoption / 5);
    const npsImpact = 3 + (adoption / 20);
    
    // Update business model
    const scenarioData = getCurrentScenarioData();
    scenarioData.ebitda *= (1 + ebitdaImpact / 100);
    scenarioData.nps += npsImpact;
    
    // Update BCG for remesas
    businessModel.bcgMatrix.remesas.marketShare += 2 + (adoption / 10);
    businessModel.bcgMatrix.remesas.growth += 20 + adoption;
    
    // Update dashboard and charts
    updateDashboard();
    updateBCGChart();
    
    // Show success message
    alert('Los cambios se han aplicado al modelo actual');
}

// Simulate fintech alliance
function simulateFintech() {
    const type = document.getElementById('fintech-type').value;
    const investment = parseInt(document.getElementById('fintech-investment').value) || 0;
    
    // Simple simulation logic
    let txns, roi, nps, costImpact;
    
    if (type === 'neobank') {
        txns = 250000 + (investment / 2000000) * 150000;
        roi = 30 + (investment > 1000000 ? 10 : 0);
        nps = 8;
        costImpact = -5;
    } else if (type === 'remesas') {
        txns = 180000 + (investment / 2000000) * 120000;
        roi = 35;
        nps = 5;
        costImpact = -3;
    } else { // pagos
        txns = 300000 + (investment / 2000000) * 200000;
        roi = 25;
        nps = 10;
        costImpact = -8;
    }
    
    document.getElementById('fintech-txns').textContent = formatNumber(txns);
    document.getElementById('fintech-roi').textContent = roi + '%';
    document.getElementById('fintech-nps-impact').textContent = '+' + nps + ' puntos';
    document.getElementById('fintech-cost-impact').textContent = costImpact + '%';
    
    document.getElementById('fintech-results').style.display = 'block';
}

// Apply fintech changes
function applyFintechChanges() {
    const type = document.getElementById('fintech-type').value;
    const investment = parseInt(document.getElementById('fintech-investment').value) || 0;
    
    // Update business model
    const scenarioData = getCurrentScenarioData();
    
    if (type === 'neobank') {
        scenarioData.transactions += 250000 + (investment / 2000000) * 150000;
        scenarioData.nps += 8;
        scenarioData.costPercentage *= 0.95;
    } else if (type === 'remesas') {
        scenarioData.transactions += 180000 + (investment / 2000000) * 120000;
        scenarioData.nps += 5;
        scenarioData.costPercentage *= 0.97;
    } else { // pagos
        scenarioData.transactions += 300000 + (investment / 2000000) * 200000;
        scenarioData.nps += 10;
        scenarioData.costPercentage *= 0.92;
    }
    
    // Update dashboard and charts
    updateDashboard();
    
    // Show success message
    alert('La alianza con la fintech se ha aplicado al modelo actual');
}

// Simulate product launch
function simulateProduct() {
    const type = document.getElementById('product-type').value;
    const investment = parseInt(document.getElementById('product-investment').value) || 0;
    const timeline = parseInt(document.getElementById('product-timeline').value) || 0;
    
    // Simple simulation logic
    let breakeven, marketShare, churnImpact, revenueImpact;
    
    if (type === 'qr') {
        breakeven = Math.max(12, 15 - (investment / 500000));
        marketShare = 10 + (investment > 1000000 ? 5 : 0);
        churnImpact = -2;
        revenueImpact = 15;
    } else if (type === 'billetera') {
        breakeven = Math.max(18, 20 - (investment / 500000));
        marketShare = 15;
        churnImpact = -3;
        revenueImpact = 20;
    } else { // credito
        breakeven = Math.max(15, 18 - (investment / 500000));
        marketShare = 8;
        churnImpact = -1;
        revenueImpact = 10;
    }
    
    // Adjust for timeline
    breakeven = breakeven + (timeline - 9) / 3;
    
    document.getElementById('product-breakeven').textContent = Math.round(breakeven) + ' meses';
    document.getElementById('product-market-share').textContent = marketShare + '%';
    document.getElementById('product-churn-impact').textContent = churnImpact + '%';
    document.getElementById('product-revenue-impact').textContent = '+' + revenueImpact + '%';
    
    document.getElementById('product-results').style.display = 'block';
}

// Apply product changes
function applyProductChanges() {
    const type = document.getElementById('product-type').value;
    const investment = parseInt(document.getElementById('product-investment').value) || 0;
    
    // Update business model
    const scenarioData = getCurrentScenarioData();
    
    if (type === 'qr') {
        scenarioData.revenue *= 1.15;
        scenarioData.churnRate = Math.max(0, scenarioData.churnRate - 2);
        businessModel.bcgMatrix.qr.marketShare += 5;
    } else if (type === 'billetera') {
        scenarioData.revenue *= 1.20;
        scenarioData.churnRate = Math.max(0, scenarioData.churnRate - 3);
        businessModel.bcgMatrix.qr.marketShare += 3;
    } else { // credito
        scenarioData.revenue *= 1.10;
        scenarioData.churnRate = Math.max(0, scenarioData.churnRate - 1);
        businessModel.bcgMatrix.tarjetas.marketShare += 2;
    }
    
    // Update dashboard and charts
    updateDashboard();
    updateBCGChart();
    
    // Show success message
    alert('El nuevo producto se ha añadido al modelo actual');
}

// Simulate BCG strategy
function simulateBCG() {
    const strategy = document.getElementById('bcg-strategy').value;
    const budget = parseInt(document.getElementById('bcg-budget').value) || 0;
    
    let roi, revenueImpact, ebitdaImpact, marketShareImpact;
    
    if (strategy === 'growth') {
        roi = 25 + (budget / 1000000);
        revenueImpact = 20 + (budget / 1000000) * 2;
        ebitdaImpact = 5 + (budget / 1000000);
        marketShareImpact = 6 + (budget / 1000000);
    } else if (strategy === 'profit') {
        roi = 30 + (budget / 1000000) * 1.5;
        revenueImpact = 15 + (budget / 1000000);
        ebitdaImpact = 10 + (budget / 1000000) * 1.5;
        marketShareImpact = 3 + (budget / 1000000);
    } else { // balanced
        roi = 28 + (budget / 1000000) * 1.2;
        revenueImpact = 18 + (budget / 1000000) * 1.5;
        ebitdaImpact = 8 + (budget / 1000000);
        marketShareImpact = 5 + (budget / 1000000);
    }
    
    document.getElementById('bcg-roi').textContent = roi + '%';
    document.getElementById('bcg-revenue-impact').textContent = '+' + revenueImpact + '%';
    document.getElementById('bcg-ebitda-impact').textContent = '+' + ebitdaImpact + '%';
    document.getElementById('bcg-market-share').textContent = '+' + marketShareImpact + '%';
    
    document.getElementById('bcg-results').style.display = 'block';
}

// Apply BCG changes
function applyBCGChanges() {
    const strategy = document.getElementById('bcg-strategy').value;
    const budget = parseInt(document.getElementById('bcg-budget').value) || 0;
    const scenario = document.getElementById('bcg-scenario').value;
    
    // Determine impacts based on strategy
    let revenueImpact, ebitdaImpact, marketShareImpact;
    
    if (strategy === 'growth') {
        revenueImpact = 1 + (0.20 + (budget / 1000000 * 0.02));
        ebitdaImpact = 1 + (0.05 + (budget / 1000000 * 0.01));
        marketShareImpact = 6 + (budget / 1000000);
    } else if (strategy === 'profit') {
        revenueImpact = 1 + (0.15 + (budget / 1000000 * 0.01));
        ebitdaImpact = 1 + (0.10 + (budget / 1000000 * 0.015));
        marketShareImpact = 3 + (budget / 1000000);
    } else { // balanced
        revenueImpact = 1 + (0.18 + (budget / 1000000 * 0.015));
        ebitdaImpact = 1 + (0.08 + (budget / 1000000 * 0.01));
        marketShareImpact = 5 + (budget / 1000000);
    }
    
    // Apply to selected scenario
    let scenarioData;
    if (scenario === 'optimista') {
        scenarioData = businessModel.optimisticScenario;
    } else if (scenario === 'pesimista') {
        scenarioData = businessModel.pessimisticScenario;
    } else {
        scenarioData = businessModel.baseScenario;
    }
    
    scenarioData.revenue *= revenueImpact;
    scenarioData.ebitda *= ebitdaImpact;
    
    // Update BCG matrix market shares
    for (const product in businessModel.bcgMatrix) {
        businessModel.bcgMatrix[product].marketShare *= (1 + (marketShareImpact / 100));
    }
    
    // Update dashboard and charts
    updateDashboard();
    updateBCGChart();
    
    // Show success message
    alert(`La estrategia BCG se ha aplicado al escenario ${scenario}`);
}

// Simulate PESTEL strategy
function simulatePESTEL() {
    const focus = document.getElementById('pestel-focus').value;
    const investment = parseInt(document.getElementById('pestel-investment').value) || 0;
    const timeline = parseInt(document.getElementById('pestel-timeline').value) || 0;
    
    let npsImpact, riskImpact, costImpact, roiTime;
    
    if (focus === 'tecnologico') {
        npsImpact = 10 + (investment / 1000000) * 2;
        riskImpact = -25 - (investment / 1000000 * 5);
        costImpact = -8 - (investment / 1000000);
        roiTime = 18 - (timeline / 12);
    } else if (focus === 'regulatorio') {
        npsImpact = 5 + (investment / 1000000);
        riskImpact = -40 - (investment / 1000000 * 8);
        costImpact = -5 - (investment / 1000000 * 0.5);
        roiTime = 24 - (timeline / 12);
    } else { // social
        npsImpact = 15 + (investment / 1000000 * 3);
        riskImpact = -15 - (investment / 1000000 * 2);
        costImpact = -3 - (investment / 1000000 * 0.3);
        roiTime = 12 - (timeline / 12);
    }
    
    document.getElementById('pestel-nps-impact').textContent = '+' + npsImpact + ' puntos';
    document.getElementById('pestel-risk-impact').textContent = riskImpact + '%';
    document.getElementById('pestel-cost-impact').textContent = costImpact + '%';
    document.getElementById('pestel-roi-time').textContent = Math.max(6, Math.round(roiTime)) + ' meses';
    
    document.getElementById('pestel-results').style.display = 'block';
}

// Apply PESTEL changes
function applyPESTELChanges() {
    const focus = document.getElementById('pestel-focus').value;
    const investment = parseInt(document.getElementById('pestel-investment').value) || 0;
    
    // Update business model
    const scenarioData = getCurrentScenarioData();
    
    if (focus === 'tecnologico') {
        scenarioData.nps += 10 + (investment / 1000000) * 2;
        scenarioData.costPercentage *= (1 - (0.08 + (investment / 1000000 * 0.01)));
        scenarioData.successRate += 2;
    } else if (focus === 'regulatorio') {
        scenarioData.nps += 5 + (investment / 1000000);
        scenarioData.costPercentage *= (1 - (0.05 + (investment / 1000000 * 0.005)));
        scenarioData.successRate += 1;
    } else { // social
        scenarioData.nps += 15 + (investment / 1000000 * 3);
        scenarioData.costPercentage *= (1 - (0.03 + (investment / 1000000 * 0.003)));
        scenarioData.successRate += 3;
    }
    
    // Update dashboard and charts
    updateDashboard();
    
    // Show success message
    alert('Los cambios de estrategia PESTEL se han aplicado al modelo actual');
}

// Update dashboard with current scenario data
function updateDashboard() {
    const scenarioData = getCurrentScenarioData();
    
    // Update KPIs
    document.getElementById('revenue-kpi').textContent = formatCurrencyShort(scenarioData.revenue);
    document.getElementById('ebitda-kpi').textContent = formatCurrencyShort(scenarioData.ebitda);
    document.getElementById('txn-kpi').textContent = formatNumberShort(scenarioData.transactions / 1000000) + 'M';
    
    // Update change indicators
    const revenueChange = ((scenarioData.revenue - 10000000) / 10000000) * 100;
    document.getElementById('revenue-change').textContent = (revenueChange >= 0 ? '+' : '') + Math.round(revenueChange) + '% vs anterior';
    
    const ebitdaMargin = (scenarioData.ebitda / scenarioData.revenue) * 100;
    document.getElementById('ebitda-margin').textContent = 'Margen: ' + Math.round(ebitdaMargin) + '%';
    
    const txnChange = ((scenarioData.transactions - 1000000) / 1000000) * 100;
    document.getElementById('txn-change').textContent = (txnChange >= 0 ? '+' : '') + Math.round(txnChange) + '% YoY';
    
    // Update KPI table
    const grossMarginPerTxn = (scenarioData.revenue * (1 - (scenarioData.costPercentage / 100))) / scenarioData.transactions;
    document.getElementById('gross-margin-per-txn').textContent = '$' + grossMarginPerTxn.toFixed(2);
    
    document.getElementById('success-rate-kpi').textContent = scenarioData.successRate + '%';
    document.getElementById('nps-dashboard').textContent = Math.round(scenarioData.nps);
    
    // Update KPI status indicators
    updateKPIStatus('gross-margin', grossMarginPerTxn, 0.40);
    updateKPIStatus('success-rate', scenarioData.successRate, 95);
    updateKPIStatus('nps', scenarioData.nps, 70);
    
    // Update charts
    updateRevenueChart();
    updateKPIsChart();
}

// Update KPI status
function updateKPIStatus(kpi, value, target) {
    const statusElement = document.getElementById(kpi + '-status');
    const indicatorElement = document.querySelector(`#${kpi}-status`).previousElementSibling;
    
    if (value >= target * 1.1) {
        statusElement.textContent = 'Óptimo';
        indicatorElement.className = 'status-indicator status-good';
    } else if (value >= target) {
        statusElement.textContent = 'Bueno';
        indicatorElement.className = 'status-indicator status-good';
    } else if (value >= target * 0.9) {
        statusElement.textContent = 'Mejorable';
        indicatorElement.className = 'status-indicator status-warning';
    } else {
        statusElement.textContent = 'Crítico';
        indicatorElement.className = 'status-indicator status-bad';
    }
}

// Get current scenario data
function getCurrentScenarioData() {
    switch (currentScenario) {
        case 'optimista':
            return businessModel.optimisticScenario;
        case 'pesimista':
            return businessModel.pessimisticScenario;
        default:
            return businessModel.baseScenario;
    }
}

// Initialize all charts
function updateAllCharts() {
    initRevenueChart();
    initPLChart();
    initKPIsChart();
    initBCGChart();
    initPorterChart();
}

// Initialize Revenue Chart
function initRevenueChart() {
    const revenueCtx = document.getElementById('revenue-chart').getContext('2d');
    window.revenueChart = new Chart(revenueCtx, {
        type: 'line',
        {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            datasets: [{
                label: 'Ingresos (millones)',
                [8, 8.5, 9.2, 9.8, 10.5, 11.2],
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 7
                }
            }
        }
    });
}

// Update Revenue Chart
function updateRevenueChart() {
    const scenarioData = getCurrentScenarioData();
    const baseRevenue = 10000000;
    const multiplier = scenarioData.revenue / baseRevenue;
    
    const newData = [8, 8.5, 9.2, 9.8, 10.5, 11.2].map(v => v * multiplier);
    window.revenueChart.data.datasets[0].data = newData;
    window.revenueChart.update();
}

// Initialize P&L Chart
function initPLChart() {
    const plCtx = document.getElementById('pl-chart').getContext('2d');
    window.plChart = new Chart(plCtx, {
        type: 'bar',
        {
            labels: ['Ingresos', 'Costos', 'Gastos', 'EBITDA'],
            datasets: [{
                label: 'Millones USD',
                [10, 6, 0.8, 3.2],
                backgroundColor: [
                    'rgba(46, 204, 113, 0.7)',
                    'rgba(231, 76, 60, 0.7)',
                    'rgba(241, 196, 15, 0.7)',
                    'rgba(52, 152, 219, 0.7)'
                ],
                borderColor: [
                    'rgba(46, 204, 113, 1)',
                    'rgba(231, 76, 60, 1)',
                    'rgba(241, 196, 15, 1)',
                    'rgba(52, 152, 219, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Update P&L Chart
function updatePLChart(income, costs, expenses) {
    const ebitda = income - costs - expenses;
    window.plChart.data.datasets[0].data = [
        income / 1000000,
        costs / 1000000,
        expenses / 1000000,
        ebitda / 1000000
    ];
    window.plChart.update();
}

// Initialize KPIs Chart
function initKPIsChart() {
    const kpisCtx = document.getElementById('kpis-chart').getContext('2d');
    window.kpisChart = new Chart(kpisCtx, {
        type: 'radar',
        {
            labels: ['Margen Bruto', 'Eficiencia', 'Tasa Éxito', 'NPS', 'Uptime'],
            datasets: [{
                label: 'Actual',
                [80, 75, 98, 65, 99],
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                borderColor: 'rgba(52, 152, 219, 1)',
                pointBackgroundColor: 'rgba(52, 152, 219, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(52, 152, 219, 1)'
            }, {
                label: 'Meta',
                [90, 85, 95, 70, 99.9],
                backgroundColor: 'rgba(46, 204, 113, 0.2)',
                borderColor: 'rgba(46, 204, 113, 1)',
                pointBackgroundColor: 'rgba(46, 204, 113, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(46, 204, 113, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 50,
                    suggestedMax: 100
                }
            }
        }
    });
}

// Update KPIs Chart
function updateKPIsChart() {
    const scenarioData = getCurrentScenarioData();
    const grossMargin = (1 - (scenarioData.costPercentage / 100)) * 100;
    const efficiency = (scenarioData.ebitda / scenarioData.revenue) * 100;
    
    window.kpisChart.data.datasets[0].data = [
        grossMargin,
        efficiency,
        scenarioData.successRate,
        scenarioData.nps,
        scenarioData.uptime
    ];
    window.kpisChart.update();
}

// Initialize BCG Chart
function initBCGChart() {
    const bcgCtx = document.getElementById('bcg-matrix').getContext('2d');
    window.bcgChart = new Chart(bcgCtx, {
        type: 'bubble',
        {
            datasets: [
                {
                    label: 'Estrellas',
                    [{
                        x: 35,
                        y: 70,
                        r: 20
                    }],
                    backgroundColor: 'rgba(52, 152, 219, 0.7)'
                },
                {
                    label: 'Vacas Lecheras',
                    [{
                        x: 25,
                        y: 5,
                        r: 15
                    }],
                    backgroundColor: 'rgba(46, 204, 113, 0.7)'
                },
                {
                    label: 'Interrogantes',
                    [{
                        x: 3,
                        y: 300,
                        r: 10
                    }],
                    backgroundColor: 'rgba(241, 196, 15, 0.7)'
                },
                {
                    label: 'Perros',
                    [{
                        x: 8,
                        y: -10,
                        r: 8
                    }],
                    backgroundColor: 'rgba(231, 76, 60, 0.7)'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Participación de Mercado (%)'
                    },
                    min: 0,
                    max: 100
                },
                y: {
                    title: {
                        display: true,
                        text: 'Tasa de Crecimiento (%)'
                    },
                    min: -20,
                    max: 350
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const labels = ['Transferencias', 'Cripto', 'Transferencias Pull', 'Pagos', 'Transferencias Recurrentes'];
                            return labels[context.datasetIndex];
                        }
                    }
                }
            }
        }
    });
}

// Update BCG Chart
function updateBCGChart() {
    const bcgData = businessModel.bcgMatrix;
    
    window.bcgChart.data.datasets = [
        {
            label: 'Estrellas',
            [{
                x: bcgData.serviciosPSP.marketShare,
                y: bcgData.serviciosPSP.growth,
                r: bcgData.serviciosPSP.size
            }],
            backgroundColor: 'rgba(52, 152, 219, 0.7)'
        },
        {
            label: 'Vacas Lecheras',
            [{
                x: bcgData.tarjetas.marketShare,
                y: bcgData.tarjetas.growth,
                r: bcgData.tarjetas.size
            }],
            backgroundColor: 'rgba(46, 204, 113, 0.7)'
        },
        {
            label: 'Interrogantes',
            [{
                x: bcgData.remesas.marketShare,
                y: bcgData.remesas.growth,
                r: bcgData.remesas.size
            }],
            backgroundColor: 'rgba(241, 196, 15, 0.7)'
        },
        {
            label: 'Perros',
            [{
                x: bcgData.extraccion.marketShare,
                y: bcgData.extraccion.growth,
                r: bcgData.extraccion.size
            }],
            backgroundColor: 'rgba(231, 76, 60, 0.7)'
        },
        {
            label: 'Estrella Emergente',
            [{
                x: bcgData.transferenciasPull.marketShare,
                y: bcgData.transferenciasPull.growth,
                r: bcgData.transferenciasPull.size
            }],
            backgroundColor: 'rgba(155, 89, 182, 0.7)'
        }
    ];
    
    window.bcgChart.update();
}

// Initialize Porter Chart
function initPorterChart() {
    const porterCtx = document.getElementById('porter-chart').getContext('2d');
    window.porterChart = new Chart(porterCtx, {
        type: 'radar',
        {
            labels: ['Nuevos Entrantes', 'Poder Proveedores', 'Poder Clientes', 'Productos Sustitutos', 'Rivalidad Competitiva'],
            datasets: [{
                label: 'Intensidad',
                [4, 3, 4, 3, 4],
                backgroundColor: 'rgba(231, 76, 60, 0.2)',
                borderColor: 'rgba(231, 76, 60, 1)',
                pointBackgroundColor: 'rgba(231, 76, 60, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(231, 76, 60, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 1,
                    suggestedMax: 5,
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            return getPorterIntensityLabel(value);
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return getPorterIntensityLabel(context.raw);
                        }
                    }
                }
            }
        }
    });
}

// Update Porter Chart
function updatePorterChart() {
    const porterData = businessModel.porterForces;
    
    window.porterChart.data.datasets[0].data = [
        porterData.entrantes.intensity,
        porterData.proveedores.intensity,
        porterData.clientes.intensity,
        porterData.sustitutos.intensity,
        porterData.rivalidad.intensity
    ];
    
    window.porterChart.update();
}

// Format currency
function formatCurrency(amount) {
    return '$' + Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Format short currency (e.g. $10.0M)
function formatCurrencyShort(amount) {
    if (amount >= 1000000) {
        return '$' + (amount / 1000000).toFixed(1) + 'M';
    } else if (amount >= 1000) {
        return '$' + (amount / 1000).toFixed(1) + 'K';
    }
    return '$' + amount;
}

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Format short number (e.g. 1.2M)
function formatNumberShort(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num;
}