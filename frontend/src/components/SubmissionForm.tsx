import React, { useState } from 'react';
import { Submission } from '../types';

interface SubmissionFormProps {
  onSubmit: (submission: Submission) => void;
  isAnalyzing: boolean;
}

const SAMPLE_BUSINESSES: { [key: string]: Submission } = {
  joes_pizza: {
    businessName: "Joe's Pizza Restaurant",
    location: "Brooklyn, NY",
    website: "https://joespizza.com",
    loanAmount: 50000,
    creditScore: 680,
    annualRevenue: 250000,
    monthlyRevenue: 20833,
    debtToIncome: 0.35,
    yearsInBusiness: 3,
    industry: "Restaurant",
    existingDebt: 87500,
    employees: 8
  },
  walmart: {
    businessName: "Walmart Supercenter",
    location: "Bentonville, AR",
    website: "https://walmart.com",
    loanAmount: 5000000,
    creditScore: 800,
    annualRevenue: 150000000,
    monthlyRevenue: 12500000,
    debtToIncome: 0.25,
    yearsInBusiness: 25,
    industry: "Retail",
    existingDebt: 37500000,
    employees: 450
  },
  target: {
    businessName: "Target Store",
    location: "Minneapolis, MN",
    website: "https://target.com",
    loanAmount: 2000000,
    creditScore: 780,
    annualRevenue: 45000000,
    monthlyRevenue: 3750000,
    debtToIncome: 0.28,
    yearsInBusiness: 18,
    industry: "Retail",
    existingDebt: 12600000,
    employees: 200
  },
  autobell: {
    businessName: "Autobell Car Wash",
    location: "Charlotte, NC",
    website: "https://autobell.com",
    loanAmount: 150000,
    creditScore: 720,
    annualRevenue: 850000,
    monthlyRevenue: 70833,
    debtToIncome: 0.32,
    yearsInBusiness: 7,
    industry: "Automotive Services",
    existingDebt: 272000,
    employees: 15
  },
  cvs: {
    businessName: "CVS Pharmacy",
    location: "Woonsocket, RI",
    website: "https://cvs.com",
    loanAmount: 3000000,
    creditScore: 790,
    annualRevenue: 85000000,
    monthlyRevenue: 7083333,
    debtToIncome: 0.22,
    yearsInBusiness: 30,
    industry: "Healthcare/Pharmacy",
    existingDebt: 18700000,
    employees: 320
  },
  accenture: {
    businessName: "Accenture plc",
    location: "Dublin, Ireland",
    website: "https://accenture.com",
    loanAmount: 500000000,
    creditScore: 850,
    annualRevenue: 64000000000,
    monthlyRevenue: 5333333333,
    debtToIncome: 0.15,
    yearsInBusiness: 35,
    industry: "Professional Services",
    existingDebt: 9600000000,
    employees: 750000
  }
};

export const SubmissionForm: React.FC<SubmissionFormProps> = ({ onSubmit, isAnalyzing }) => {
  const [formData, setFormData] = useState<Submission>(SAMPLE_BUSINESSES.joes_pizza);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['loanAmount', 'creditScore', 'annualRevenue', 'monthlyRevenue', 'yearsInBusiness', 'existingDebt', 'employees'].includes(name)
        ? Number(value)
        : name === 'debtToIncome'
        ? parseFloat(value)
        : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const loadSample = (businessKey: string) => {
    setFormData(SAMPLE_BUSINESSES[businessKey]);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Business Loan Application</h2>
        <div className="relative">
          <select
            onChange={(e) => loadSample(e.target.value)}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer appearance-none pr-8"
            defaultValue=""
          >
            <option value="" disabled>📋 Load Sample Business</option>
            <option value="joes_pizza">🍕 Joe's Pizza (Likely Declined)</option>
            <option value="autobell">🚗 Autobell Car Wash (With Conditions)</option>
            <option value="accenture">💼 Accenture plc - Fortune 500 (Approved ✓)</option>
            <option value="target">🎯 Target Store (With Conditions)</option>
            <option value="cvs">💊 CVS Pharmacy (Approved ✓)</option>
            <option value="walmart">🏪 Walmart (Approved ✓)</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Name *
            </label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <input
              type="url"
              name="website"
              value={formData.website || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Industry *
            </label>
            <input
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loan Amount ($) *
            </label>
            <input
              type="number"
              name="loanAmount"
              value={formData.loanAmount}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Credit Score *
            </label>
            <input
              type="number"
              name="creditScore"
              value={formData.creditScore}
              onChange={handleChange}
              required
              min="300"
              max="850"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Annual Revenue ($) *
            </label>
            <input
              type="number"
              name="annualRevenue"
              value={formData.annualRevenue}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Revenue ($) *
            </label>
            <input
              type="number"
              name="monthlyRevenue"
              value={formData.monthlyRevenue}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Debt-to-Income Ratio *
            </label>
            <input
              type="number"
              name="debtToIncome"
              value={formData.debtToIncome}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              max="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Years in Business *
            </label>
            <input
              type="number"
              name="yearsInBusiness"
              value={formData.yearsInBusiness}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Existing Debt ($)
            </label>
            <input
              type="number"
              name="existingDebt"
              value={formData.existingDebt || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Employees
            </label>
            <input
              type="number"
              name="employees"
              value={formData.employees || ''}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isAnalyzing}
          className={`w-full py-3 px-4 rounded-md font-semibold text-white transition-colors ${
            isAnalyzing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Submission'}
        </button>
      </form>
    </div>
  );
};
