import type { SimulationResult } from '../types';

interface SummaryCardsProps {
  results: SimulationResult;
}

interface CardProps {
  title: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
}

function Card({ title, value, unit, icon }: CardProps) {
  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">
            {value}
            <span className="text-sm font-normal text-gray-400 ml-1">{unit}</span>
          </p>
        </div>
        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-yellow-500/20">
          {icon}
        </div>
      </div>
    </div>
  );
}

export function SummaryCards({ results }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Card
        title="Total Energy Consumed"
        value={results.totalEnergyKwh.toLocaleString(undefined, { maximumFractionDigits: 1 })}
        unit="kWh"
        icon={
          <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        }
      />
      <Card
        title="Theoretical Max Power"
        value={results.theoreticalMaxPowerKw.toLocaleString(undefined, { maximumFractionDigits: 1 })}
        unit="kW"
        icon={
          <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        }
      />
      <Card
        title="Actual Max Power"
        value={results.actualMaxPowerKw.toLocaleString(undefined, { maximumFractionDigits: 1 })}
        unit="kW"
        icon={
          <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        }
      />
      <Card
        title="Concurrency Factor"
        value={(results.concurrencyFactor * 100).toFixed(1)}
        unit="%"
        icon={
          <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        }
      />
    </div>
  );
}
