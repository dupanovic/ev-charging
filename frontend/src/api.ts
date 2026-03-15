import type { SimulationConfig, SimulationResult, SavedConfig } from './types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error ${response.status}: ${errorText}`);
  }

  // 204 No Content has no body — return undefined instead of parsing
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function saveConfig(config: SimulationConfig & { name?: string }): Promise<SavedConfig> {
  return request<SavedConfig>('/simulations/configs', {
    method: 'POST',
    body: JSON.stringify(config),
  });
}

export async function listConfigs(): Promise<SavedConfig[]> {
  return request<SavedConfig[]>('/simulations/configs');
}

export async function loadConfig(id: string): Promise<SavedConfig> {
  return request<SavedConfig>(`/simulations/configs/${id}`);
}

export async function updateConfig(id: string, config: SimulationConfig): Promise<SavedConfig> {
  return request<SavedConfig>(`/simulations/configs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(config),
  });
}

export async function deleteConfig(id: string): Promise<void> {
  await request<void>(`/simulations/configs/${id}`, {
    method: 'DELETE',
  });
}

export async function runSimulation(id: string): Promise<SimulationResult> {
  return request<SimulationResult>(`/simulations/configs/${id}/run`, {
    method: 'POST',
  });
}

export async function getResults(id: string): Promise<SimulationResult[]> {
  return request<SimulationResult[]>(`/simulations/configs/${id}/results`);
}
