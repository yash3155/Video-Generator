export interface CandlestickPoint {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  label?: string;
}

export interface TelemetryPoint {
  value: number;
  secondaryValue?: number;
  barMetric?: number;
  threshold?: number;
  xLabel?: string;
}

export interface PresetChartData {
  type: 'candlestick' | 'line' | 'behavioral';
  unit: string;
  minY: number;
  maxY: number;
  candlesticks?: CandlestickPoint[];
  points?: TelemetryPoint[];
}

/**
 * Exact landmark prices for every preset so scripts/validate_episode.mjs
 * and Argon prompts stay 100% synchronized with the rendered candles.
 */
export const PRESET_LANDMARKS: Record<
  string,
  {
    minY: number;
    maxY: number;
    startPrice: number;
    peakPrice: number;
    peakCandleIndex: number;
    endPrice: number;
    endCandleIndex: number;
    supportOrNecklinePrice?: number;
    description: string;
  }
> = {
  uptrend_then_drop: {
    minY: 115,
    maxY: 165,
    startPrice: 120,
    peakPrice: 158,
    peakCandleIndex: 21,
    endPrice: 141,
    endCandleIndex: 27,
    description:
      'Climbs from ₹120 to a peak of ₹158 (candles 18–23), then gaps down on heavy volume to close at ₹141 (candle 27). NEVER use ₹165 as a candle price (165 is only the empty Y-axis top border).',
  },
  uptrend_break: {
    minY: 92,
    maxY: 152,
    startPrice: 98,
    peakPrice: 148,
    peakCandleIndex: 16,
    supportOrNecklinePrice: 140,
    endPrice: 135,
    endCandleIndex: 27,
    description:
      'Climbs along a green trendline from ₹98 to ₹148 (candle 16), breaks support at ₹140 (candle 18–21), and drops to ₹135 (candle 27). For a healthy uptrend without the breakdown, stop at progressStep: 2.',
  },
  bull_breakout: {
    minY: 115,
    maxY: 175,
    startPrice: 120,
    peakPrice: 168,
    peakCandleIndex: 27,
    supportOrNecklinePrice: 148,
    endPrice: 166,
    endCandleIndex: 27,
    description:
      'Pure bullish rally: consolidates below ₹148 resistance, breaks out at ₹150 on 3x volume (candle 18), and rallies cleanly to ₹166–₹168 (candle 27). Use this for bullish breakouts, weekly uptrends, and volume confirmation.',
  },
  head_and_shoulders: {
    minY: 124,
    maxY: 182,
    startPrice: 136,
    peakPrice: 175,
    peakCandleIndex: 12,
    supportOrNecklinePrice: 142,
    endPrice: 134,
    endCandleIndex: 27,
    description:
      'Left Shoulder at ₹158 (candle 4), Head at ₹175 (candle 12), Right Shoulder at ₹156 (candle 20), Neckline at ₹142 breaks at candle 25 and drops to ₹134.',
  },
  random_walk_line: {
    minY: 70,
    maxY: 185,
    startPrice: 100,
    peakPrice: 168,
    peakCandleIndex: 27,
    endPrice: 165,
    endCandleIndex: 27,
    description:
      'Line telemetry series climbing from 100 to 165 across T+1 to T+100.',
  },
};

const UPTREND_THEN_DROP_CANDLES: CandlestickPoint[] = [
  { open: 120, high: 123, low: 119, close: 122, volume: 65, label: 'Jan 02' },
  { open: 122, high: 125, low: 121, close: 124, volume: 70 },
  { open: 124, high: 127, low: 123, close: 126, volume: 75 },
  { open: 126, high: 126, low: 122, close: 123, volume: 55 },
  { open: 123, high: 128, low: 122, close: 127, volume: 80, label: 'Jan 16' },
  { open: 127, high: 131, low: 126, close: 130, volume: 85 },
  { open: 130, high: 133, low: 129, close: 132, volume: 90 },
  { open: 132, high: 132, low: 128, close: 129, volume: 60 },
  { open: 129, high: 135, low: 128, close: 134, volume: 95, label: 'Feb 01' },
  { open: 134, high: 138, low: 133, close: 137, volume: 100 },
  { open: 137, high: 141, low: 136, close: 140, volume: 105 },
  { open: 140, high: 140, low: 136, close: 138, volume: 65 },
  { open: 138, high: 144, low: 137, close: 143, volume: 110, label: 'Feb 15' },
  { open: 143, high: 147, low: 142, close: 146, volume: 115 },
  { open: 146, high: 150, low: 145, close: 149, volume: 120 },
  { open: 149, high: 149, low: 145, close: 147, volume: 75 },
  { open: 147, high: 152, low: 146, close: 151, volume: 130, label: 'Mar 01' },
  { open: 151, high: 154, low: 150, close: 152, volume: 135 },
  { open: 152, high: 156, low: 151, close: 155, volume: 145 },
  { open: 155, high: 157, low: 153, close: 156, volume: 140 },
  { open: 156, high: 159, low: 155, close: 158, volume: 155, label: 'Mar 15' },
  { open: 158, high: 160, low: 156, close: 158, volume: 150 },
  { open: 158, high: 159, low: 153, close: 154, volume: 165 },
  { open: 154, high: 158, low: 152, close: 157, volume: 170 },
  { open: 152, high: 153, low: 144, close: 145, volume: 230, label: 'Mar 31' },
  { open: 145, high: 146, low: 141, close: 142, volume: 215 },
  { open: 142, high: 144, low: 140, close: 141, volume: 195 },
  { open: 141, high: 143, low: 139, close: 141, volume: 185 },
];

const UPTREND_BREAK_CANDLES: CandlestickPoint[] = [
  { open: 98, high: 102, low: 97, close: 101, volume: 70, label: 'Jan 05' },
  { open: 101, high: 105, low: 100, close: 104, volume: 75 },
  { open: 104, high: 106, low: 101, close: 103, volume: 60 },
  { open: 103, high: 109, low: 102, close: 108, volume: 85 },
  { open: 108, high: 113, low: 107, close: 112, volume: 90, label: 'Jan 19' },
  { open: 112, high: 115, low: 109, close: 111, volume: 65 },
  { open: 111, high: 118, low: 110, close: 117, volume: 95 },
  { open: 117, high: 122, low: 116, close: 121, volume: 100 },
  { open: 121, high: 123, low: 117, close: 119, volume: 70, label: 'Feb 02' },
  { open: 119, high: 126, low: 118, close: 125, volume: 110 },
  { open: 125, high: 131, low: 124, close: 130, volume: 115 },
  { open: 130, high: 132, low: 126, close: 128, volume: 75 },
  { open: 128, high: 136, low: 127, close: 135, volume: 120, label: 'Feb 16' },
  { open: 135, high: 141, low: 134, close: 140, volume: 130 },
  { open: 140, high: 145, low: 139, close: 144, volume: 135 },
  { open: 144, high: 146, low: 139, close: 141, volume: 85 },
  { open: 141, high: 149, low: 140, close: 148, volume: 150, label: 'Mar 01' },
  { open: 148, high: 149, low: 142, close: 143, volume: 140 },
  { open: 143, high: 145, low: 139, close: 140, volume: 160 },
  { open: 140, high: 144, low: 139, close: 143, volume: 95 },
  { open: 143, high: 144, low: 136, close: 137, volume: 210, label: 'Mar 15' },
  { open: 137, high: 138, low: 133, close: 135, volume: 225 },
  { open: 135, high: 139, low: 134, close: 138, volume: 130 },
  { open: 138, high: 139, low: 133, close: 134, volume: 195 },
  { open: 134, high: 137, low: 132, close: 136, volume: 140, label: 'Mar 31' },
  { open: 136, high: 137, low: 133, close: 135, volume: 165 },
  { open: 135, high: 136, low: 132, close: 135, volume: 155 },
  { open: 135, high: 136, low: 133, close: 135, volume: 150 },
];

const BULL_BREAKOUT_CANDLES: CandlestickPoint[] = [
  { open: 120, high: 124, low: 119, close: 123, volume: 65, label: 'Jan 05' },
  { open: 123, high: 127, low: 122, close: 126, volume: 70 },
  { open: 126, high: 128, low: 123, close: 125, volume: 55 },
  { open: 125, high: 131, low: 124, close: 130, volume: 85 },
  { open: 130, high: 135, low: 129, close: 134, volume: 90, label: 'Jan 19' },
  { open: 134, high: 136, low: 131, close: 133, volume: 60 },
  { open: 133, high: 139, low: 132, close: 138, volume: 100 },
  { open: 138, high: 143, low: 137, close: 142, volume: 110 },
  { open: 142, high: 144, low: 139, close: 140, volume: 65, label: 'Feb 02' },
  { open: 140, high: 146, low: 139, close: 145, volume: 115 },
  { open: 145, high: 148, low: 143, close: 147, volume: 120 },
  { open: 147, high: 148, low: 143, close: 144, volume: 70 },
  { open: 144, high: 148, low: 143, close: 147, volume: 85, label: 'Feb 16' },
  { open: 147, high: 148, low: 144, close: 146, volume: 75 },
  { open: 146, high: 148, low: 144, close: 147, volume: 80 },
  { open: 147, high: 149, low: 145, close: 148, volume: 95 },
  { open: 148, high: 154, low: 147, close: 153, volume: 220, label: 'Mar 01' },
  { open: 153, high: 158, low: 152, close: 157, volume: 240 },
  { open: 157, high: 160, low: 155, close: 159, volume: 210 },
  { open: 159, high: 159, low: 154, close: 156, volume: 85 },
  { open: 156, high: 162, low: 155, close: 161, volume: 195, label: 'Mar 15' },
  { open: 161, high: 164, low: 159, close: 163, volume: 205 },
  { open: 163, high: 163, low: 159, close: 160, volume: 80 },
  { open: 160, high: 165, low: 159, close: 164, volume: 190 },
  { open: 164, high: 167, low: 162, close: 166, volume: 200, label: 'Mar 31' },
  { open: 166, high: 168, low: 164, close: 167, volume: 210 },
  { open: 167, high: 169, low: 165, close: 168, volume: 215 },
  { open: 168, high: 169, low: 165, close: 166, volume: 185 },
];

const HEAD_AND_SHOULDERS_CANDLES: CandlestickPoint[] = [
  { open: 136, high: 141, low: 135, close: 140, volume: 90, label: 'Jan 05' },
  { open: 140, high: 146, low: 139, close: 145, volume: 105 },
  { open: 145, high: 151, low: 144, close: 150, volume: 120 },
  { open: 150, high: 155, low: 149, close: 154, volume: 140 },
  { open: 154, high: 158, low: 152, close: 156, volume: 165, label: 'Jan 19' }, // Left Shoulder Peak (idx 4, high 158)
  { open: 156, high: 156, low: 148, close: 149, volume: 110 },
  { open: 149, high: 150, low: 143, close: 144, volume: 95 },
  { open: 144, high: 145, low: 142, close: 143, volume: 85 }, // Trough 1 (idx 7, low 142)
  { open: 143, high: 151, low: 142, close: 150, volume: 115, label: 'Feb 02' },
  { open: 150, high: 158, low: 149, close: 157, volume: 130 },
  { open: 157, high: 165, low: 156, close: 164, volume: 145 },
  { open: 164, high: 171, low: 163, close: 170, volume: 155 },
  { open: 170, high: 175, low: 168, close: 172, volume: 135, label: 'Feb 16' }, // Head Peak (idx 12, high 175)
  { open: 172, high: 173, low: 162, close: 163, volume: 150 },
  { open: 163, high: 164, low: 154, close: 155, volume: 140 },
  { open: 155, high: 156, low: 147, close: 148, volume: 125 },
  { open: 148, high: 149, low: 142, close: 143, volume: 100, label: 'Mar 01' }, // Trough 2 (idx 16-17, low 142)
  { open: 143, high: 148, low: 142, close: 147, volume: 80 },
  { open: 147, high: 152, low: 146, close: 151, volume: 75 },
  { open: 151, high: 155, low: 150, close: 154, volume: 70 },
  { open: 154, high: 156, low: 151, close: 152, volume: 65, label: 'Mar 15' }, // Right Shoulder Peak (idx 20, high 156)
  { open: 152, high: 153, low: 147, close: 148, volume: 95 },
  { open: 148, high: 149, low: 144, close: 145, volume: 110 },
  { open: 145, high: 146, low: 142, close: 143, volume: 125 },
  { open: 143, high: 144, low: 138, close: 139, volume: 215, label: 'Mar 31' },
  { open: 139, high: 140, low: 135, close: 136, volume: 235 }, // Breakdown (idx 25, low 135)
  { open: 136, high: 138, low: 134, close: 135, volume: 190 },
  { open: 135, high: 136, low: 133, close: 134, volume: 175 },
];

const RANDOM_WALK_POINTS: TelemetryPoint[] = Array.from({ length: 28 }).map(
  (_, idx) => {
    const base = 100 + idx * 2.3;
    const wave = Math.sin(idx * 0.7) * 6 + Math.cos(idx * 1.3) * 3;
    const value = Math.round((base + wave) * 10) / 10;
    const labelMap: Record<number, string> = {
      0: 'T+1',
      7: 'T+25',
      14: 'T+50',
      21: 'T+75',
      27: 'T+100',
    };
    return {
      value,
      barMetric: 35 + ((idx * 17) % 45),
      xLabel: labelMap[idx],
    };
  }
);

export function getPresetData(presetName?: string): PresetChartData {
  switch (presetName) {
    case 'uptrend_break':
      return {
        type: 'candlestick',
        unit: '₹',
        minY: 92,
        maxY: 152,
        candlesticks: UPTREND_BREAK_CANDLES,
      };
    case 'bull_breakout':
    case 'support_bounce':
      return {
        type: 'candlestick',
        unit: '₹',
        minY: 115,
        maxY: 175,
        candlesticks: BULL_BREAKOUT_CANDLES,
      };
    case 'head_and_shoulders':
      return {
        type: 'candlestick',
        unit: '₹',
        minY: 124,
        maxY: 182,
        candlesticks: HEAD_AND_SHOULDERS_CANDLES,
      };
    case 'random_walk_line':
    case 'telemetry_line':
      return {
        type: 'line',
        unit: '₹',
        minY: 70,
        maxY: 185,
        points: RANDOM_WALK_POINTS,
      };
    case 'uptrend_then_drop':
    default:
      return {
        type: 'candlestick',
        unit: '₹',
        minY: 115,
        maxY: 165,
        candlesticks: UPTREND_THEN_DROP_CANDLES,
      };
  }
}