require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3000;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Set EJS as view engine
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.post('/generate-analysis', async (req, res) => {
  try {
    const { businessType, businessDescription, targetMarket, competitors, analysisType } = req.body;

    if (!businessType || !businessDescription || !analysisType) {
      return res.status(400).json({ error: 'Business type, description, and analysis type are required' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let prompt = '';
    let visualizationPrompt = '';

    switch (analysisType) {
      case 'swot':
        prompt = `Generate a detailed SWOT analysis for a ${businessType} business. Description: ${businessDescription}. Target market: ${targetMarket}. Competitors: ${competitors}. Format as JSON with: strengths (array), weaknesses (array), opportunities (array), threats (array), summary (string).`;
        visualizationPrompt = `Based on the SWOT analysis, generate data for visualization: swotCategories (array), swotData (array), swotColors (array). Return as JSON.`;
        break;
      case 'strategy':
        prompt = `Generate business strategies for ${businessType}. Description: ${businessDescription}. Target market: ${targetMarket}. Competitors: ${competitors}. Format as JSON with: marketingStrategy (array), operationalStrategy (array), financialStrategy (array), summary (string).`;
        break;
      case 'financial':
        prompt = `Generate 12-month financial projections for ${businessType}. Description: ${businessDescription}. Target market: ${targetMarket}. Format as JSON with: monthlyRevenue (array), monthlyExpenses (array), monthlyProfit (array), breakEvenMonth (string), keyAssumptions (array), summary (string).`;
        visualizationPrompt = `Format financial data for charts. Return as JSON with: months (array), revenueData (array), expenseData (array), profitData (array), breakEvenIndex (number).`;
        break;
      default:
        prompt = `Generate a comprehensive business analysis for ${businessType}. Description: ${businessDescription}. Target market: ${targetMarket}. Competitors: ${competitors}. Format as JSON with: overview (string), swot (object), strategies (object), financials (object), recommendations (array), summary (string).`;
    }

    // Generate main analysis
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const analysis = safeJsonParse(text);

    // Generate visualization data if applicable
    let visualizationData = null;
    if (visualizationPrompt && analysis) {
      const vizResult = await model.generateContent(visualizationPrompt + JSON.stringify(analysis));
      const vizResponse = await vizResult.response;
      const vizText = vizResponse.text();
      visualizationData = safeJsonParse(vizText);
    }

    res.json({ 
      analysis: analysis || text,
      visualization: visualizationData 
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate analysis' });
  }
});

// Helper function to safely parse JSON
function safeJsonParse(str) {
  try {
    const jsonMatch = str.match(/```json\n([\s\S]*?)\n```/);
    const jsonStr = jsonMatch ? jsonMatch[1] : str;
    return JSON.parse(jsonStr);
  } catch (e) {
    return str; // Return raw text if parsing fails
  }
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});