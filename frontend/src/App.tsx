import React, { useState } from 'react';
import { SubmissionForm } from './components/SubmissionForm';
import { AgentProgress } from './components/AgentProgress';
import { ResultsDisplay } from './components/ResultsDisplay';
import { DecisionCard } from './components/DecisionCard';
import { Submission, AgentStatus, UnderwritingDecision } from './types';

function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [agents, setAgents] = useState<AgentStatus[]>([
    { name: 'Business Verifier', status: 'idle' },
    { name: 'Financial Analyst', status: 'idle' },
    { name: 'Risk Assessor', status: 'idle' }
  ]);
  const [decision, setDecision] = useState<UnderwritingDecision | null>(null);

  const handleSubmit = async (submission: Submission) => {
    setIsAnalyzing(true);
    setDecision(null);

    // Reset agents
    setAgents([
      { name: 'Business Verifier', status: 'idle' },
      { name: 'Financial Analyst', status: 'idle' },
      { name: 'Risk Assessor', status: 'idle' }
    ]);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      let buffer = '';
      let currentEvent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('event: ')) {
            currentEvent = line.slice(7).trim();
          } else if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (currentEvent) {
                handleSSEEvent(currentEvent, data);
                currentEvent = '';
              }
            } catch (e) {
              console.error('Failed to parse SSE data:', e);
            }
          }
        }
      }

    } catch (error) {
      console.error('Analysis error:', error);
      alert('An error occurred during analysis. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSSEEvent = (eventType: string, data: any) => {
    console.log('SSE Event:', eventType, data);

    switch (eventType) {
      case 'agent_started':
        setAgents(prev => prev.map(agent =>
          agent.name === data.agentName
            ? { ...agent, status: 'started' }
            : agent
        ));
        break;

      case 'agent_completed':
        setAgents(prev => prev.map(agent =>
          agent.name === data.agentName
            ? { ...agent, status: 'completed', result: data.result }
            : agent
        ));
        break;

      case 'synthesis_started':
        console.log('Starting synthesis...');
        break;

      case 'analysis_complete':
        setDecision(data);
        setAgents(prev => prev.map(agent => ({ ...agent, status: 'completed' })));
        break;

      case 'error':
        console.error('Analysis error:', data);
        alert(data.message || 'An error occurred');
        break;
    }
  };

  const completedAgents = agents.filter(a => a.status === 'completed');
  const verifierResult = completedAgents.find(a => a.name === 'Business Verifier')?.result;
  const financialResult = completedAgents.find(a => a.name === 'Financial Analyst')?.result;
  const riskResult = completedAgents.find(a => a.name === 'Risk Assessor')?.result;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AgentLend
          </h1>
          <p className="text-lg text-gray-600">
            Multi-Agent Business Lending Platform
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Your AI underwriting team works 24/7 • Powered by Claude + Exa
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Form */}
          <div>
            <SubmissionForm onSubmit={handleSubmit} isAnalyzing={isAnalyzing} />
          </div>

          {/* Right Column: Results */}
          <div className="space-y-6">
            {isAnalyzing || agents.some(a => a.status !== 'idle') ? (
              <>
                <AgentProgress agents={agents} />
                <ResultsDisplay
                  verifierResult={verifierResult}
                  financialResult={financialResult}
                  riskResult={riskResult}
                />
                {decision && <DecisionCard decision={decision} />}
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-6xl mb-4">🤖</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Ready to Analyze
                </h3>
                <p className="text-gray-500">
                  Fill out the form and submit to see the multi-agent system in action
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Demo showcasing parallel agent execution with real-time API integration</p>
        </div>
      </div>
    </div>
  );
}

export default App;
