import React from 'react';
import {
  BusinessVerificationResult,
  FinancialAnalysisResult,
  RiskAssessmentResult
} from '../types';

interface ResultsDisplayProps {
  verifierResult?: BusinessVerificationResult;
  financialResult?: FinancialAnalysisResult;
  riskResult?: RiskAssessmentResult;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  verifierResult,
  financialResult,
  riskResult
}) => {
  if (!verifierResult && !financialResult && !riskResult) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800">Agent Findings</h3>

      {verifierResult && (
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800">Business Verification</h4>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{verifierResult.legitimacyScore}/100</div>
              <div className="text-xs text-gray-500">Legitimacy Score</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className={verifierResult.registered ? '✅' : '❌'}></span>
              <span className="text-sm text-gray-700">
                Business Registration: {verifierResult.registered ? 'Verified' : 'Not Found'}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className={verifierResult.websiteFound ? '✅' : '⚠️'}></span>
              <span className="text-sm text-gray-700">
                Online Presence: {verifierResult.onlinePresence}
              </span>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Summary:</p>
              <p className="text-sm text-gray-600">{verifierResult.summary}</p>
            </div>

            {verifierResult.recentNews.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Recent News:</p>
                <ul className="list-disc list-inside space-y-1">
                  {verifierResult.recentNews.map((news, idx) => (
                    <li key={idx} className="text-sm text-gray-600">{news}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {financialResult && (
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Financial Analysis</h4>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Assessment:</p>
              <p className="text-sm text-gray-600">{financialResult.assessment}</p>
            </div>

            {financialResult.strengths.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">✅ Strengths:</p>
                <ul className="list-disc list-inside space-y-1">
                  {financialResult.strengths.map((strength, idx) => (
                    <li key={idx} className="text-sm text-green-700">{strength}</li>
                  ))}
                </ul>
              </div>
            )}

            {financialResult.concerns.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">⚠️ Concerns:</p>
                <ul className="list-disc list-inside space-y-1">
                  {financialResult.concerns.map((concern, idx) => (
                    <li key={idx} className="text-sm text-orange-700">{concern}</li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Industry Comparison:</p>
              <p className="text-sm text-gray-600">{financialResult.industryComparison}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Credit Assessment:</p>
              <p className="text-sm text-gray-600">{financialResult.creditAssessment}</p>
            </div>
          </div>
        </div>
      )}

      {riskResult && (
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800">Risk Assessment</h4>
            <div className="text-right">
              <div className={`text-2xl font-bold ${
                riskResult.riskLevel === 'LOW' ? 'text-green-600' :
                riskResult.riskLevel === 'MODERATE' ? 'text-yellow-600' :
                riskResult.riskLevel === 'HIGH' ? 'text-orange-600' :
                'text-red-600'
              }`}>
                {riskResult.riskLevel}
              </div>
              <div className="text-xs text-gray-500">{riskResult.riskScore}/100</div>
            </div>
          </div>

          <div className="space-y-3">
            {riskResult.factors.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Risk Factors:</p>
                <ul className="list-disc list-inside space-y-1">
                  {riskResult.factors.map((factor, idx) => (
                    <li key={idx} className="text-sm text-gray-600">{factor}</li>
                  ))}
                </ul>
              </div>
            )}

            {riskResult.redFlags.length > 0 && (
              <div>
                <p className="text-sm font-medium text-red-700 mb-2">❌ Red Flags:</p>
                <ul className="list-disc list-inside space-y-1">
                  {riskResult.redFlags.map((flag, idx) => (
                    <li key={idx} className="text-sm text-red-600">{flag}</li>
                  ))}
                </ul>
              </div>
            )}

            {riskResult.industryRisks.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Industry Risks:</p>
                <ul className="list-disc list-inside space-y-1">
                  {riskResult.industryRisks.map((risk, idx) => (
                    <li key={idx} className="text-sm text-gray-600">{risk}</li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Sentiment:</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                riskResult.sentiment === 'Positive' ? 'bg-green-100 text-green-800' :
                riskResult.sentiment === 'Negative' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {riskResult.sentiment}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
