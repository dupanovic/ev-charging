import { useState, useEffect, useCallback } from 'react';
import type { SimulationConfig, SimulationResult, SavedConfig } from './types';
import { saveConfig, updateConfig, listConfigs, runSimulation, deleteConfig, loadConfig } from './api';
import { ConfigPanel } from './components/ConfigPanel';
import { ResultsDashboard } from './components/ResultsDashboard';
import { ConfigList } from './components/ConfigList';

const DEFAULT_CONFIG: SimulationConfig = {
  numChargepoints: 20,
  arrivalMultiplier: 1.0,
  consumptionKwhPer100km: 18,
  chargingPowerKw: 11,
};

function App() {
  const [config, setConfig] = useState<SimulationConfig>(DEFAULT_CONFIG);
  const [configName, setConfigName] = useState('');
  const [results, setResults] = useState<SimulationResult | null>(null);
  const [savedConfigs, setSavedConfigs] = useState<SavedConfig[]>([]);
  const [activeConfigId, setActiveConfigId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConfigs = useCallback(async () => {
    try {
      const configs = await listConfigs();
      setSavedConfigs(configs);
    } catch (err) {
      console.error('Failed to fetch configs:', err);
    }
  }, []);

  useEffect(() => {
    fetchConfigs();
  }, [fetchConfigs]);

  const handleRunSimulation = async () => {
    setError(null);
    setIsRunning(true);
    try {
      let configId = activeConfigId;
      if (configId) {
        // Update the existing config with current slider values before running
        await updateConfig(configId, config);
      } else {
        const saved = await saveConfig({
          ...config,
          name: configName || `Simulation ${new Date().toLocaleString()}`,
        });
        configId = saved.id;
        setActiveConfigId(saved.id);
      }
      await fetchConfigs();
      const result = await runSimulation(configId);
      setResults(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Simulation failed');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSaveConfig = async () => {
    setError(null);
    setIsSaving(true);
    try {
      const name = configName || `Config ${new Date().toLocaleString()}`;
      const saved = await saveConfig({ ...config, name });
      setActiveConfigId(saved.id);
      setConfigName(saved.name);
      await fetchConfigs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save config');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadConfig = async (id: string) => {
    setError(null);
    try {
      const loaded = await loadConfig(id);
      setConfig({
        numChargepoints: loaded.numChargepoints,
        arrivalMultiplier: loaded.arrivalMultiplier,
        consumptionKwhPer100km: loaded.consumptionKwhPer100km,
        chargingPowerKw: loaded.chargingPowerKw,
      });
      setConfigName(loaded.name);
      setActiveConfigId(loaded.id);
      setResults(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load config');
    }
  };

  const handleDeleteConfig = async (id: string) => {
    setError(null);
    try {
      await deleteConfig(id);
      if (activeConfigId === id) {
        setActiveConfigId(null);
        setConfig(DEFAULT_CONFIG);
        setConfigName('');
        setResults(null);
      }
      await fetchConfigs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete config');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-8">
      
      {error && (
        <div className="max-w-7xl mx-auto px-6 pt-4">
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-300 hover:text-red-100 ml-4">
              Dismiss
            </button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <ConfigPanel
              config={config}
              configName={configName}
              onChange={setConfig}
              onChangeName={setConfigName}
              onRun={handleRunSimulation}
              onSave={handleSaveConfig}
              isRunning={isRunning}
              isSaving={isSaving}
            />
          </div>
          <div className="lg:col-span-8 space-y-6">
            <ResultsDashboard results={results} isRunning={isRunning} />
            <ConfigList
              configs={savedConfigs}
              activeConfigId={activeConfigId}
              onLoad={handleLoadConfig}
              onDelete={handleDeleteConfig}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
