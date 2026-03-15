import type { SavedConfig } from '../types';

interface ConfigListProps {
  configs: SavedConfig[];
  activeConfigId: string | null;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ConfigList({ configs, activeConfigId, onLoad, onDelete }: ConfigListProps) {
  if (configs.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Saved Configurations
        </h3>
        <p className="text-gray-500 text-sm text-center py-4">
          No saved configurations yet. Save your first config to see it here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        Saved Configurations
        <span className="text-sm font-normal text-gray-500">({configs.length})</span>
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="text-left py-2 px-3 font-medium">Name</th>
              <th className="text-right py-2 px-3 font-medium">Points</th>
              <th className="text-right py-2 px-3 font-medium">Arrival</th>
              <th className="text-right py-2 px-3 font-medium">Power</th>
              <th className="text-right py-2 px-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {configs.map((cfg) => (
              <tr
                key={cfg.id}
                className={`border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors ${
                  activeConfigId === cfg.id ? 'bg-yellow-900/20' : ''
                }`}
              >
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    {activeConfigId === cfg.id && (
                      <span className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0" />
                    )}
                    <span className="text-white truncate max-w-[180px]">
                      {cfg.name || `Config ${cfg.id.slice(0, 8)}`}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-3 text-right text-gray-300">
                  {cfg.numChargepoints}
                </td>
                <td className="py-3 px-3 text-right text-gray-300">
                  {Math.round(cfg.arrivalMultiplier * 100)}%
                </td>
                <td className="py-3 px-3 text-right text-gray-300">
                  {cfg.chargingPowerKw} kW
                </td>
                <td className="py-3 px-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onLoad(cfg.id)}
                      className="text-yellow-400 hover:text-yellow-300 transition-colors text-xs font-medium px-2 py-1 rounded hover:bg-yellow-900/30"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => onDelete(cfg.id)}
                      className="text-red-400 hover:text-red-300 transition-colors text-xs font-medium px-2 py-1 rounded hover:bg-red-900/30"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
