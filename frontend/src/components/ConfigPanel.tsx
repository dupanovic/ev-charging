import type { SimulationConfig } from '../types';

interface ConfigPanelProps {
  config: SimulationConfig;
  configName: string;
  onChange: (config: SimulationConfig) => void;
  onChangeName: (name: string) => void;
  onRun: () => void;
  onSave: () => void;
  isRunning: boolean;
  isSaving: boolean;
}

function sliderBackground(value: number, min: number, max: number): React.CSSProperties {
  const pct = ((value - min) / (max - min)) * 100;
  return {
    background: `linear-gradient(to right, #eab308 ${pct}%, #374151 ${pct}%)`,
  };
}

export function ConfigPanel({ config, configName, onChange, onChangeName, onRun, onSave, isRunning, isSaving }: ConfigPanelProps) {
  const update = (partial: Partial<SimulationConfig>) => {
    onChange({ ...config, ...partial });
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-6">
      <h2 className="text-lg font-semibold text-white flex items-center gap-2">
        <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Simulation Configuration
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Configuration Name</label>
        <input
          type="text"
          value={configName}
          onChange={(e) => onChangeName(e.target.value)}
          placeholder="My Simulation Config"
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Number of Charge Points</label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={1}
            max={30}
            value={config.numChargepoints}
            onChange={(e) => update({ numChargepoints: parseInt(e.target.value) })}
            className="flex-1 h-2 rounded-lg cursor-pointer gold-slider"
            style={sliderBackground(config.numChargepoints, 1, 30)}
          />
          <span className="text-white font-mono text-sm w-8 text-right">{config.numChargepoints}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Arrival Probability</label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={20}
            max={200}
            step={5}
            value={Math.round(config.arrivalMultiplier * 100)}
            onChange={(e) => update({ arrivalMultiplier: parseInt(e.target.value) / 100 })}
            className="flex-1 h-2 rounded-lg cursor-pointer gold-slider"
            style={sliderBackground(Math.round(config.arrivalMultiplier * 100), 20, 200)}
          />
          <span className="text-white font-mono text-sm w-12 text-right">
            {Math.round(config.arrivalMultiplier * 100)}%
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Car Consumption (kWh/100km)</label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={5}
            max={50}
            step={0.5}
            value={config.consumptionKwhPer100km}
            onChange={(e) => update({ consumptionKwhPer100km: parseFloat(e.target.value) })}
            className="flex-1 h-2 rounded-lg cursor-pointer gold-slider"
            style={sliderBackground(config.consumptionKwhPer100km, 5, 50)}
          />
          <span className="text-white font-mono text-sm w-12 text-right">{config.consumptionKwhPer100km}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Charging Power per Point (kW)</label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={1}
            max={30}
            step={0.5}
            value={config.chargingPowerKw}
            onChange={(e) => update({ chargingPowerKw: parseFloat(e.target.value) })}
            className="flex-1 h-2 rounded-lg cursor-pointer gold-slider"
            style={sliderBackground(config.chargingPowerKw, 1, 30)}
          />
          <span className="text-white font-mono text-sm w-12 text-right">{config.chargingPowerKw}</span>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <button
          onClick={onRun}
          disabled={isRunning}
          className="w-full bg-yellow-600 hover:bg-yellow-500 disabled:bg-yellow-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isRunning ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Running Simulation...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Run Simulation
            </>
          )}
        </button>

        <button
          onClick={onSave}
          disabled={isSaving}
          className="w-full bg-yellow-700 hover:bg-yellow-600 disabled:bg-yellow-900 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isSaving ? 'Saving...' : 'Save Config'}
        </button>
      </div>
    </div>
  );
}
