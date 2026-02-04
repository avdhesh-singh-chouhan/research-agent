import React from 'react';
import { AgentStatus } from '../types';

interface AgentProgressProps {
  agents: AgentStatus[];
}

export const AgentProgress: React.FC<AgentProgressProps> = ({ agents }) => {
  const getAgentDescription = (agentName: string) => {
    switch (agentName) {
      case 'Business Verifier':
        return {
          role: 'Verifies business legitimacy and online presence',
          sources: 'Exa API • OpenCorporates • News & Reviews'
        };
      case 'Financial Analyst':
        return {
          role: 'Analyzes credit, revenue, and financial health',
          sources: 'Credit Data • Industry Benchmarks via Exa'
        };
      case 'Risk Assessor':
        return {
          role: 'Identifies red flags and risk factors',
          sources: 'Exa Search • Legal Records • Market Analysis'
        };
      default:
        return {
          role: 'Processing analysis',
          sources: 'Multiple data sources'
        };
    }
  };

  const getStatusIcon = (status: AgentStatus['status']) => {
    switch (status) {
      case 'idle':
        return '⏸️';
      case 'started':
      case 'in_progress':
        return '🔄';
      case 'completed':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '⏸️';
    }
  };

  const getStatusColor = (status: AgentStatus['status']) => {
    switch (status) {
      case 'idle':
        return 'bg-gray-100 border-gray-300';
      case 'started':
      case 'in_progress':
        return 'bg-blue-50 border-blue-300';
      case 'completed':
        return 'bg-green-50 border-green-300';
      case 'error':
        return 'bg-red-50 border-red-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  const getStatusText = (status: AgentStatus['status']) => {
    switch (status) {
      case 'idle':
        return 'Waiting...';
      case 'started':
        return 'Starting...';
      case 'in_progress':
        return 'Analyzing...';
      case 'completed':
        return 'Complete';
      case 'error':
        return 'Error';
      default:
        return 'Idle';
    }
  };

  if (agents.every(a => a.status === 'idle')) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-800">Agent Progress</h3>
      {agents.map((agent) => {
        const description = getAgentDescription(agent.name);
        return (
          <div
            key={agent.name}
            className={`p-4 rounded-lg border-2 transition-all ${getStatusColor(agent.status)}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getStatusIcon(agent.status)}</span>
                <div>
                  <h4 className="font-semibold text-gray-800">{agent.name}</h4>
                  <p className="text-sm text-gray-600">{getStatusText(agent.status)}</p>
                </div>
              </div>
              {(agent.status === 'started' || agent.status === 'in_progress') && (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              )}
            </div>

            {/* Agent Description */}
            <div className="ml-11 space-y-1">
              <p className="text-xs text-gray-700">
                <span className="font-medium">Role:</span> {description.role}
              </p>
              <p className="text-xs text-blue-600">
                <span className="font-medium">Sources:</span> {description.sources}
              </p>
            </div>

            {agent.status === 'completed' && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
