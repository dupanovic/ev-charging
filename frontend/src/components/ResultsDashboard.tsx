import type { SimulationResult } from '../types';
import { SummaryCards } from './SummaryCards';
import { DayChart } from './DayChart';

interface ResultsDashboardProps {
  results: SimulationResult | null;
  isRunning: boolean;
}

export function ResultsDashboard({ results, isRunning }: ResultsDashboardProps) {
  if (isRunning) {
    return (
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-12 flex flex-col items-center justify-center">
        <svg className="animate-spin h-12 w-12 text-yellow-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-gray-400 text-lg">Running simulation...</p>
        <p className="text-gray-500 text-sm mt-1">Simulating 365 days of EV charging</p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
        </div>
        <p className="text-gray-400 text-lg font-medium">No Results Yet</p>
        <p className="text-gray-500 text-sm mt-1">Configure your simulation and click "Run Simulation" to see results</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SummaryCards results={results} />
      {results.chargingValuesPerDay && results.chargingValuesPerDay.length > 0 && (
        <DayChart chargingValuesPerDay={results.chargingValuesPerDay} />
      )}
    </div>
  );
}
