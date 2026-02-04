import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { CoordinatorAgent } from './agents/coordinator.js';
import { Submission } from './types.js';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Validate environment variables
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const EXA_API_KEY = process.env.EXA_API_KEY;

if (!ANTHROPIC_API_KEY || !EXA_API_KEY) {
  console.error('Error: Missing required API keys in environment variables');
  console.error('Please set ANTHROPIC_API_KEY and EXA_API_KEY in .env file');
  process.exit(1);
}

// Initialize coordinator
const coordinator = new CoordinatorAgent(ANTHROPIC_API_KEY, EXA_API_KEY);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'AgentLend API is running' });
});

// Main analysis endpoint with Server-Sent Events
app.post('/api/analyze', async (req: Request, res: Response) => {
  const submission: Submission = req.body;

  console.log(`\n[API] New analysis request for: ${submission.businessName}`);

  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendEvent = (event: string, data: any) => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    // Send initial event
    sendEvent('analysis_started', { message: 'Starting underwriting analysis' });

    // Notify that agents are starting
    sendEvent('agent_started', { agentName: 'Business Verifier', status: 'started' });
    sendEvent('agent_started', { agentName: 'Financial Analyst', status: 'started' });
    sendEvent('agent_started', { agentName: 'Risk Assessor', status: 'started' });

    // Run analysis
    const result = await coordinator.analyze(submission);

    // Send agent completion events
    sendEvent('agent_completed', {
      agentName: 'Business Verifier',
      result: result.agentFindings.businessVerifier
    });

    sendEvent('agent_completed', {
      agentName: 'Financial Analyst',
      result: result.agentFindings.financialAnalyst
    });

    sendEvent('agent_completed', {
      agentName: 'Risk Assessor',
      result: result.agentFindings.riskAssessor
    });

    // Send synthesis event
    sendEvent('synthesis_started', { message: 'Synthesizing final decision' });

    // Send final result
    sendEvent('analysis_complete', result);

    res.end();

  } catch (error: any) {
    console.error('[API] Error during analysis:', error);
    sendEvent('error', {
      message: 'An error occurred during analysis',
      error: error.message
    });
    res.end();
  }
});

// Simple POST endpoint (non-streaming) for testing
app.post('/api/analyze-simple', async (req: Request, res: Response) => {
  const submission: Submission = req.body;

  console.log(`\n[API] Simple analysis request for: ${submission.businessName}`);

  try {
    const result = await coordinator.analyze(submission);
    res.json(result);
  } catch (error: any) {
    console.error('[API] Error during analysis:', error);
    res.status(500).json({
      error: 'Analysis failed',
      message: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n✅ AgentLend API running on http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
  console.log(`\n🤖 AI Underwriting Team Ready:`);
  console.log(`   - Business Verifier Agent`);
  console.log(`   - Financial Analyst Agent`);
  console.log(`   - Risk Assessor Agent`);
  console.log(`   - Coordinator Agent`);
  console.log(`\n💼 AgentLend: Your AI team works 24/7\n`);
});
