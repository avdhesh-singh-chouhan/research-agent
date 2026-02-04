import React from 'react';
import { UnderwritingDecision } from '../types';

interface DecisionCardProps {
  decision: UnderwritingDecision;
}

export const DecisionCard: React.FC<DecisionCardProps> = ({ decision }) => {
  // Safety check
  if (!decision || !decision.finalDecision) {
    return null;
  }

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'APPROVE':
        return 'bg-green-500';
      case 'APPROVE_WITH_CONDITIONS':
        return 'bg-yellow-500';
      case 'DECLINE':
        return 'bg-red-500';
      case 'REQUEST_MORE_INFO':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRecommendationText = (rec: string) => {
    switch (rec) {
      case 'APPROVE':
        return '✅ APPROVED';
      case 'APPROVE_WITH_CONDITIONS':
        return '⚠️ APPROVED WITH CONDITIONS';
      case 'DECLINE':
        return '❌ DECLINED';
      case 'REQUEST_MORE_INFO':
        return 'ℹ️ REQUEST MORE INFO';
      default:
        return rec;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-blue-600">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Final Decision</h3>

      {/* Risk Score */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Risk Score</span>
          <span className="text-2xl font-bold text-gray-900">{decision.riskScore}/100</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className={`h-4 rounded-full transition-all ${
              decision.riskScore < 40 ? 'bg-green-500' :
              decision.riskScore < 60 ? 'bg-yellow-500' :
              decision.riskScore < 80 ? 'bg-orange-500' :
              'bg-red-500'
            }`}
            style={{ width: `${decision.riskScore}%` }}
          ></div>
        </div>
      </div>

      {/* Recommendation */}
      <div className={`${getRecommendationColor(decision.recommendation)} text-white rounded-lg p-6 mb-6 text-center`}>
        <div className="text-3xl font-bold mb-2">
          {getRecommendationText(decision.recommendation)}
        </div>
      </div>

      {/* Reasoning */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Reasoning:</h4>
        <p className="text-sm text-gray-600 leading-relaxed">{decision.finalDecision.reasoning}</p>
      </div>

      {/* Conditions */}
      {decision.finalDecision.conditions.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Conditions:</h4>
          <ul className="space-y-2">
            {decision.finalDecision.conditions.map((condition, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-yellow-600 mt-0.5">▪</span>
                <span className="text-sm text-gray-600">{condition}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Metadata */}
      <div className="pt-6 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Analysis Time: {decision.metadata.analysisTime.toFixed(1)}s</span>
          <span>Completed: {new Date(decision.metadata.timestamp).toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};
