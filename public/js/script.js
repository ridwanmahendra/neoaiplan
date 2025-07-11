// Initialize particles.js
document.addEventListener('DOMContentLoaded', function() {
  particlesJS.load('particles-js', '/assets/particles.json', function() {
    console.log('Particles.js loaded');
  });

  const form = document.getElementById('businessForm');
  const resultsSection = document.getElementById('results');
  const loadingOverlay = document.getElementById('loadingOverlay');
  const analysisResult = document.getElementById('analysisResult');

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Show loading animation
    loadingOverlay.classList.add('active');
    resultsSection.style.display = 'none';
    
    // Simulate progress (optional - can remove if using real loading)
    simulateProgress();
    
    try {
      const formData = {
        businessType: document.getElementById('businessType').value,
        businessDescription: document.getElementById('businessDescription').value,
        targetMarket: document.getElementById('targetMarket').value,
        competitors: document.getElementById('competitors').value,
        analysisType: document.querySelector('input[name="analysisType"]:checked').value
      };

      const response = await fetch('/generate-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error);

      // Display results
      analysisResult.innerHTML = formatAnalysis(data.analysis);
      resultsSection.style.display = 'block';
      
      // Render charts if visualization data exists
      if (data.visualization) {
        if (formData.analysisType === 'swot' && data.visualization.swotData) {
          renderSwotChart(data.visualization);
          document.getElementById('swotChartContainer').style.display = 'block';
        } else if (formData.analysisType === 'financial' && data.visualization.revenueData) {
          renderFinancialChart(data.visualization);
          document.getElementById('financialChartContainer').style.display = 'block';
        }
      }
      
      // Scroll to results
      setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth' });
      }, 300);
      
    } catch (error) {
      analysisResult.innerHTML = `<div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <p>${error.message}</p>
      </div>`;
      resultsSection.style.display = 'block';
    } finally {
      // Hide loading with delay for smooth transition
      setTimeout(() => {
        loadingOverlay.classList.remove('active');
      }, 500);
    }
  });

  // Simulate progress (for demo purposes)
  function simulateProgress() {
    const progressText = document.querySelector('.progress-text');
    const messages = [
      "Initializing AI Matrix...",
      "Analyzing market trends...",
      "Calculating financial projections...",
      "Generating strategic insights...",
      "Finalizing your business plan..."
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      if (i < messages.length) {
        progressText.textContent = messages[i];
        i++;
      } else {
        clearInterval(interval);
      }
    }, 600);
  }

  // Format analysis results
  function formatAnalysis(analysis) {
    if (typeof analysis === 'string') {
      return `<div class="analysis-text">${analysis.replace(/\n/g, '<br>')}</div>`;
    }

    let html = '';
    
    // Summary
    if (analysis.summary) {
      html += `<div class="section">
        <h3><i class="fas fa-info-circle"></i> Executive Summary</h3>
        <p>${analysis.summary}</p>
      </div>`;
    }

    // SWOT Analysis
    if (analysis.strengths || analysis.weaknesses || analysis.opportunities || analysis.threats) {
      html += `<div class="section">
        <h3><i class="fas fa-th-list"></i> SWOT Analysis</h3>
        <div class="swot-grid">
          <div class="swot-box strength">
            <h4>Strengths</h4>
            <ul>${formatList(analysis.strengths)}</ul>
          </div>
          <div class="swot-box weakness">
            <h4>Weaknesses</h4>
            <ul>${formatList(analysis.weaknesses)}</ul>
          </div>
          <div class="swot-box opportunity">
            <h4>Opportunities</h4>
            <ul>${formatList(analysis.opportunities)}</ul>
          </div>
          <div class="swot-box threat">
            <h4>Threats</h4>
            <ul>${formatList(analysis.threats)}</ul>
          </div>
        </div>
      </div>`;
    }

    // Business Strategy
    if (analysis.marketingStrategy || analysis.operationalStrategy || analysis.financialStrategy) {
      html += `<div class="section">
        <h3><i class="fas fa-chess"></i> Business Strategy</h3>
        ${analysis.marketingStrategy ? `<h4>Marketing Strategy</h4><ul>${formatList(analysis.marketingStrategy)}</ul>` : ''}
        ${analysis.operationalStrategy ? `<h4>Operational Strategy</h4><ul>${formatList(analysis.operationalStrategy)}</ul>` : ''}
        ${analysis.financialStrategy ? `<h4>Financial Strategy</h4><ul>${formatList(analysis.financialStrategy)}</ul>` : ''}
      </div>`;
    }

    return html;
  }

  function formatList(items) {
    if (!items) return '';
    if (Array.isArray(items)) {
      return items.map(item => `<li>${item}</li>`).join('');
    }
    return `<li>${items}</li>`;
  }
});