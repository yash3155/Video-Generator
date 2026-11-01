import {
  Candlestick,
  TelemetryPoint,
  ChartPresetResult,
  getDeterministicPresetData,
} from '../utils/chartGenerators';

export type { Candlestick, TelemetryPoint };
export type PresetData = ChartPresetResult;

export const getPresetData = (presetName: string): ChartPresetResult => {
  return getDeterministicPresetData(presetName);
};
