// src/domain/finance/financePresets.ts
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
  necklinePrice?: number;
}

export const UPTREND_THEN_DROP_CANDLES: CandlestickPoint[] = [
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

export const UPTREND_BREAK_CANDLES: CandlestickPoint[] = [
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

export const BULL_BREAKOUT_CANDLES: CandlestickPoint[] = [
  { open: 120, high: 124, low: 119, close: 123, volume: 65, label: 'Jan 05' },
  { open: 123, high: 127, low: 122, close: 126, volume: 70 },
  { open: 126, high: 128, low: 123, close: 125, volume: 55 },
  { open: 125, high: 131, low: 124, close: 130, volume: 85 },
  { open: 130, high: 135, low: 129, close: 134, volume: 90, label: 'Jan 19' },
  { open: 134, high: 136, low: 131, close: 133, volume: 60 },
  { open: 133, high: 139, low: 132, close: 138, volume: 100 },
  { open: 138, high: 143, low: 137, close: 142, volume: 110 },
  { open: 142, high: 144, low: 139, close: 140, volume: 65, label: 'Feb 02' },
  { open: 140, high: 142, low: 138, close: 141, volume: 60 },
  { open: 141, high: 143, low: 139, close: 140, volume: 55 },
  { open: 140, high: 142, low: 138, close: 141, volume: 50 },
  { open: 141, high: 142, low: 139, close: 140, volume: 45, label: 'Feb 16' },
  { open: 140, high: 141, low: 138, close: 139, volume: 40 },
  { open: 139, high: 142, low: 138, close: 141, volume: 55 },
  { open: 141, high: 142, low: 139, close: 141, volume: 50 },
  { open: 141, high: 152, low: 140, close: 151, volume: 220, label: 'Mar 02' },
  { open: 151, high: 158, low: 149, close: 156, volume: 240 },
  { open: 156, high: 164, low: 154, close: 162, volume: 260 },
  { open: 162, high: 163, low: 158, close: 160, volume: 120 },
  { open: 160, high: 169, low: 159, close: 167, volume: 210, label: 'Mar 16' },
  { open: 167, high: 173, low: 165, close: 171, volume: 190 },
  { open: 171, high: 176, low: 169, close: 174, volume: 180 },
  { open: 174, high: 175, low: 170, close: 172, volume: 110 },
  { open: 172, high: 179, low: 171, close: 177, volume: 175, label: 'Mar 30' },
  { open: 177, high: 182, low: 175, close: 180, volume: 160 },
  { open: 180, high: 185, low: 178, close: 184, volume: 170 },
  { open: 184, high: 188, low: 182, close: 186, volume: 150 },
];

export const HEAD_AND_SHOULDERS_CANDLES: CandlestickPoint[] = [
  { open: 120, high: 128, low: 118, close: 126, volume: 80, label: 'Jan 02' },
  { open: 126, high: 136, low: 124, close: 134, volume: 95 },
  { open: 134, high: 144, low: 132, close: 142, volume: 115 },
  { open: 142, high: 150, low: 140, close: 148, volume: 140, label: 'Jan 16 (L-Sh)' },
  { open: 148, high: 149, low: 138, close: 140, volume: 110 },
  { open: 140, high: 142, low: 130, close: 132, volume: 90 },
  { open: 132, high: 134, low: 127, close: 128, volume: 75, label: 'Jan 30 (Neck)' },
  { open: 128, high: 138, low: 127, close: 136, volume: 95 },
  { open: 136, high: 148, low: 134, close: 146, volume: 120 },
  { open: 146, high: 158, low: 144, close: 156, volume: 150 },
  { open: 156, high: 168, low: 154, close: 165, volume: 180, label: 'Feb 15 (Head)' },
  { open: 165, high: 166, low: 152, close: 154, volume: 130 },
  { open: 154, high: 155, low: 142, close: 144, volume: 110 },
  { open: 144, high: 145, low: 134, close: 136, volume: 90 },
  { open: 136, high: 137, low: 128, close: 130, volume: 80, label: 'Mar 01 (Neck)' },
  { open: 130, high: 138, low: 129, close: 136, volume: 75 },
  { open: 136, high: 146, low: 134, close: 144, volume: 85 },
  { open: 144, high: 148, low: 140, close: 146, volume: 90, label: 'Mar 15 (R-Sh)' },
  { open: 146, high: 147, low: 136, close: 138, volume: 70 },
  { open: 138, high: 139, low: 129, close: 130, volume: 65 },
  { open: 130, high: 131, low: 118, close: 120, volume: 210, label: 'Mar 25 (Break)' },
  { open: 120, high: 122, low: 110, close: 112, volume: 190 },
  { open: 112, high: 114, low: 104, close: 106, volume: 170 },
  { open: 106, high: 108, low: 98, close: 100, volume: 160 },
];

export const SUPPORT_BOUNCE_CANDLES: CandlestickPoint[] = [
  { open: 150, high: 152, low: 145, close: 146, volume: 70, label: 'Jan 05' },
  { open: 146, high: 147, low: 140, close: 141, volume: 75 },
  { open: 141, high: 143, low: 136, close: 138, volume: 85 },
  { open: 138, high: 139, low: 132, close: 133, volume: 95 },
  { open: 133, high: 134, low: 128, close: 129, volume: 100, label: 'Jan 19' },
  { open: 129, high: 130, low: 124, close: 125, volume: 110 },
  { open: 125, high: 126, low: 121, close: 122, volume: 130 },
  { open: 122, high: 123, low: 119, close: 120, volume: 180, label: 'Support 120' },
  { open: 120, high: 126, low: 119, close: 125, volume: 160 },
  { open: 125, high: 131, low: 124, close: 130, volume: 140 },
  { open: 130, high: 137, low: 129, close: 135, volume: 130, label: 'Feb 05' },
  { open: 135, high: 142, low: 134, close: 140, volume: 125 },
  { open: 140, high: 146, low: 139, close: 145, volume: 115 },
  { open: 145, high: 151, low: 144, close: 150, volume: 110, label: 'Feb 19' },
  { open: 150, high: 155, low: 148, close: 154, volume: 105 },
  { open: 154, high: 159, low: 152, close: 158, volume: 100 },
];

export const FINANCE_CHART_PRESETS: Record<string, PresetChartData> = {
  uptrend_then_drop: {
    type: 'candlestick',
    unit: '₹',
    minY: 110,
    maxY: 165,
    candlesticks: UPTREND_THEN_DROP_CANDLES,
  },
  uptrend_break: {
    type: 'candlestick',
    unit: '₹',
    minY: 90,
    maxY: 155,
    candlesticks: UPTREND_BREAK_CANDLES,
  },
  bull_breakout: {
    type: 'candlestick',
    unit: '₹',
    minY: 115,
    maxY: 195,
    candlesticks: BULL_BREAKOUT_CANDLES,
  },
  head_and_shoulders: {
    type: 'candlestick',
    unit: '₹',
    minY: 90,
    maxY: 175,
    necklinePrice: 129,
    candlesticks: HEAD_AND_SHOULDERS_CANDLES,
  },
  support_bounce: {
    type: 'candlestick',
    unit: '₹',
    minY: 115,
    maxY: 165,
    candlesticks: SUPPORT_BOUNCE_CANDLES,
  },
};
