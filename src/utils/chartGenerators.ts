// src/templates/chartGenerators.ts
export interface Candlestick {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  label: string;
}

export interface TelemetryPoint {
  xLabel: string;
  value: number;
  secondaryValue?: number;
  threshold?: number;
  barMetric?: number; // 0-100%
}

export interface ChartPresetResult {
  type: 'candlestick' | 'line' | 'telemetry' | 'behavioral';
  candlesticks?: Candlestick[];
  points?: TelemetryPoint[];
  minY: number;
  maxY: number;
  unit: string;
  ticker?: string;
  trendline?: { startIndex: number; endIndex: number; startY: number; endY: number };
  necklineY?: number;
}

export function createSeededRandom(seed: number = 42) {
  let s = seed;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateUptrendThenDrop(): ChartPresetResult {
  const rand = createSeededRandom(101);
  const candlesticks: Candlestick[] = [];

  const targetPrices = [
    120, 122.5, 126, 129, 132,
    130.5, 128.5, 127,
    130, 133.5, 137, 140, 142.5, 144,
    142, 140.5, 139,
    142, 145, 148.5, 151, 153, 154,
    151.5, 149,
    153.5, 158,
    141,
    139.5, 138, 139, 136.5, 135, 133.5, 134, 132, 130.5, 130,
  ];

  const dateLabels = [
    'Jan 02', '', '', '', 'Jan 15',
    '', '', 'Jan 22',
    '', '', 'Feb 01', '', '', 'Feb 10',
    '', '', 'Feb 18',
    '', '', 'Mar 01', '', '', 'Mar 10',
    '', 'Mar 15',
    '', 'Mar 25',
    'Apr 01',
    '', 'Apr 08', '', '', 'Apr 18', '', '', 'Apr 28', '', 'May 05',
  ];

  let prevClose = 119;
  for (let i = 0; i < targetPrices.length; i++) {
    const isResultDay = i === 27;
    const targetClose = targetPrices[i];

    let open: number;
    let close: number;
    let volume: number;

    if (isResultDay) {
      open = 153.5;
      close = 141.0;
      volume = 245;
    } else {
      const openOffset = (rand() - 0.5) * 1.2;
      open = Number((prevClose + openOffset).toFixed(1));
      close = targetClose;
      const isUp = close >= open;
      volume = Math.round(
        isUp ? 45 + (i / 38) * 40 + rand() * 15 : 30 + rand() * 15
      );
    }

    const high = Number((Math.max(open, close) + 0.6 + rand() * 1.5).toFixed(1));
    const low = Number((Math.min(open, close) - 0.6 - rand() * 1.4).toFixed(1));

    candlesticks.push({
      open,
      high,
      low,
      close,
      volume,
      label: dateLabels[i] || '',
    });

    prevClose = close;
  }

  return {
    type: 'candlestick',
    candlesticks,
    minY: 115,
    maxY: 165,
    unit: '₹',
    ticker: 'KESAR PAINTS LTD',
  };
}

export function generateUptrendBreak(): ChartPresetResult {
  const rand = createSeededRandom(202);
  const candlesticks: Candlestick[] = [];

  const targetPrices = [
    100, 103, 107, 110, 107.5, 105, 104,
    107, 111, 116, 120, 117, 114, 113,
    116, 121, 127, 132, 129, 125, 124,
    128, 132, 136, 134,
    122,
    119, 116, 114, 111, 110,
  ];

  const dateLabels = [
    'Jan 05', '', '', 'Jan 15', '', '', 'Jan 25',
    '', '', 'Feb 05', '', '', 'Feb 18', '',
    '', '', 'Mar 02', '', '', 'Mar 15', '',
    '', 'Mar 25', '', 'Apr 02',
    '',
    '', 'Apr 15', '', '', 'Apr 30',
  ];

  let prevClose = 98;
  for (let i = 0; i < targetPrices.length; i++) {
    const isBreakdown = i === 25;
    const targetClose = targetPrices[i];

    let open: number;
    let close: number;
    let volume: number;

    if (isBreakdown) {
      open = 133;
      close = 122;
      volume = 210;
    } else {
      const openOffset = (rand() - 0.5) * 1.0;
      open = Number((prevClose + openOffset).toFixed(1));
      close = targetClose;
      const isUp = close >= open;
      volume = Math.round(isUp ? 40 + i * 2.2 + rand() * 12 : 32 + rand() * 10);
    }

    const high = Number((Math.max(open, close) + 0.5 + rand() * 1.3).toFixed(1));
    const low = Number((Math.min(open, close) - 0.5 - rand() * 1.2).toFixed(1));

    candlesticks.push({
      open,
      high,
      low,
      close,
      volume,
      label: dateLabels[i] || '',
    });

    prevClose = close;
  }

  return {
    type: 'candlestick',
    candlesticks,
    minY: 92,
    maxY: 142,
    unit: '₹',
    ticker: 'NIFTY 50 INDEX',
    trendline: {
      startIndex: 0,
      endIndex: 20,
      startY: 100,
      endY: 124,
    },
  };
}

/**
 * Bull Breakout:
 * Consolidates below ₹148 resistance, breaks out on 3x volume at ₹150,
 * and rallies cleanly to ₹168 without crashing.
 */
export function generateBullBreakout(): ChartPresetResult {
  const rand = createSeededRandom(255);
  const candlesticks: Candlestick[] = [];

  const targetPrices = [
    120, 123, 126, 125, 130, 134, 133, 138, 142, 140,
    145, 147, 144, 147, 146, 148,
    153, 157, 159, 156, 161, 163, 160, 164, 166, 167, 168, 168,
  ];

  const dateLabels = [
    'Jan 05', '', '', '', 'Jan 19', '', '', '', 'Feb 02', '',
    '', '', 'Feb 16', '', '', '',
    'Mar 01', '', '', '', 'Mar 15', '', '', '', 'Mar 31', '', '', '',
  ];

  let prevClose = 119;
  for (let i = 0; i < targetPrices.length; i++) {
    const targetClose = targetPrices[i];
    const openOffset = (rand() - 0.5) * 0.8;
    const open = Number((prevClose + openOffset).toFixed(1));
    const close = targetClose;
    const isUp = close >= open;
    const isBreakoutZone = i >= 16;
    const volume = Math.round(
      isBreakoutZone
        ? isUp
          ? 195 + rand() * 45
          : 75 + rand() * 15
        : 60 + rand() * 35
    );

    const high = Number((Math.max(open, close) + 0.6 + rand() * 1.2).toFixed(1));
    const low = Number((Math.min(open, close) - 0.5 - rand() * 1.0).toFixed(1));

    candlesticks.push({
      open,
      high,
      low,
      close,
      volume,
      label: dateLabels[i] || '',
    });

    prevClose = close;
  }

  return {
    type: 'candlestick',
    candlesticks,
    minY: 115,
    maxY: 175,
    unit: '₹',
    ticker: 'KESAR PAINTS LTD',
  };
}

export function generateHeadAndShoulders(): ChartPresetResult {
  const rand = createSeededRandom(303);
  const candlesticks: Candlestick[] = [];

  const targets = [
    135, 142, 150, 157, 160,
    153, 146, 142,
    146, 155, 164, 171, 175, 174,
    166, 157, 148, 142,
    147, 153, 158, 155,
    150, 145, 142,
    134, 128, 124, 120, 117, 114, 112,
  ];

  const labels = [
    'Jan 05', '', '', '', '',
    '', '', 'Jan 20',
    '', '', '', '', 'Feb 01', '',
    '', '', '', 'Feb 15',
    '', '', '', '',
    '', '', 'Mar 01',
    '', 'Mar 10', '', '', '', '', 'Mar 25',
  ];

  let prevClose = 132;
  for (let i = 0; i < targets.length; i++) {
    const isBreakdown = i === 25;
    const targetClose = targets[i];

    let open: number;
    let close: number;
    let volume: number;

    if (isBreakdown) {
      open = 142;
      close = 134;
      volume = 230;
    } else {
      open = Number((prevClose + (rand() - 0.5) * 1.5).toFixed(1));
      close = targetClose;
      const isPeak = targetClose >= 158;
      volume = isPeak ? 130 + rand() * 30 : 50 + rand() * 20;
    }

    const high = Number((Math.max(open, close) + 0.6 + rand() * 1.5).toFixed(1));
    const low = Number((Math.min(open, close) - 0.6 - rand() * 1.4).toFixed(1));

    candlesticks.push({
      open,
      high,
      low,
      close,
      volume: Math.round(volume),
      label: labels[i] || '',
    });

    prevClose = close;
  }

  return {
    type: 'candlestick',
    candlesticks,
    minY: 105,
    maxY: 182,
    unit: '₹',
    ticker: 'AUTO SECTOR LTD',
    necklineY: 142,
  };
}

export function generateRandomWalkLine(): ChartPresetResult {
  const rand = createSeededRandom(404);
  const points: TelemetryPoint[] = [];
  let price = 97.5;

  for (let i = 0; i < 120; i++) {
    const step = (rand() - 0.5) * 1.1;
    price = Math.max(92.2, Math.min(102.8, price + step));

    points.push({
      xLabel: i % 25 === 0 ? `T+${i}` : '',
      value: parseFloat(price.toFixed(2)),
      barMetric: Math.round(30 + rand() * 40),
    });
  }

  return {
    type: 'line',
    points,
    minY: 90,
    maxY: 105,
    unit: '₹',
  };
}

export function generateLatencySpike(): ChartPresetResult {
  const rand = createSeededRandom(505);
  const points: TelemetryPoint[] = [];

  for (let i = 0; i <= 48; i++) {
    let latency = 44 + rand() * 6;
    let cpu = 25 + (i / 48) * 35 + rand() * 5;

    if (i >= 30 && i <= 36) {
      const spikeFactor = Math.sin(((i - 30) / 6) * Math.PI);
      latency = 45 + spikeFactor * 1155;
      cpu = 95 + rand() * 5;
    } else if (i > 36) {
      latency = 52 + rand() * 8;
      cpu = 40 + rand() * 10;
    }

    points.push({
      xLabel: i % 8 === 0 ? `${12 + Math.floor(i / 12)}:${(i % 12) * 5 || '00'}` : '',
      value: Math.round(latency),
      threshold: 200,
      barMetric: Math.round(Math.min(100, cpu)),
    });
  }

  return {
    type: 'telemetry',
    points,
    minY: 0,
    maxY: 1300,
    unit: 'ms',
  };
}

export function generateThroughputScaling(): ChartPresetResult {
  const rand = createSeededRandom(606);
  const points: TelemetryPoint[] = [];

  for (let i = 1; i <= 40; i++) {
    const loadRequests = i * 1250;
    const ideal = loadRequests;
    const actual =
      loadRequests < 22000
        ? loadRequests * (0.98 + rand() * 0.04)
        : 22000 + Math.log(loadRequests - 21000) * 1200 + (rand() - 0.5) * 600;

    points.push({
      xLabel: i % 8 === 0 ? `${Math.round(loadRequests / 1000)}k req` : '',
      value: Math.round(actual),
      secondaryValue: ideal,
      threshold: 22000,
      barMetric: Math.round(Math.min(100, (actual / 25000) * 100)),
    });
  }

  return {
    type: 'telemetry',
    points,
    minY: 0,
    maxY: 52000,
    unit: 'req/s',
  };
}

export function generateMemoryLeakCurve(): ChartPresetResult {
  const rand = createSeededRandom(707);
  const points: TelemetryPoint[] = [];
  let baseMemory = 600;

  for (let i = 0; i <= 45; i++) {
    const cycle = i % 5;
    if (cycle === 0) {
      baseMemory += 350 + rand() * 80;
    }
    const memInCycle = baseMemory + cycle * 120 + rand() * 40;
    const currentMem = Math.min(4096, memInCycle);

    points.push({
      xLabel: i % 9 === 0 ? `${Math.floor(i / 5)}h` : '',
      value: Math.round(currentMem),
      threshold: 3800,
      barMetric: Math.round((currentMem / 4096) * 100),
    });
  }

  return {
    type: 'telemetry',
    points,
    minY: 500,
    maxY: 4200,
    unit: 'MB',
  };
}

export function generateLoadBalancerFlow(): ChartPresetResult {
  const points: TelemetryPoint[] = [
    { xLabel: 'Node 1 (US-East)', value: 2450, threshold: 5000, barMetric: 49 },
    { xLabel: 'Node 2 (HOTSPOT)', value: 9200, threshold: 5000, barMetric: 100 },
    { xLabel: 'Node 3 (US-West)', value: 2600, threshold: 5000, barMetric: 52 },
    { xLabel: 'Node 4 (EU-Central)', value: 2400, threshold: 5000, barMetric: 48 },
    { xLabel: 'Node 5 (AP-South)', value: 2550, threshold: 5000, barMetric: 51 },
  ];

  return {
    type: 'telemetry',
    points,
    minY: 0,
    maxY: 10500,
    unit: 'req/s',
  };
}

export function generateHabitCompounding(): ChartPresetResult {
  const points: TelemetryPoint[] = [];

  for (let d = 1; d <= 50; d++) {
    const day = Math.round((d / 50) * 365);
    const linearExpectation = (day / 365) * 15;
    const compoundReality = Math.pow(1.01, day);

    points.push({
      xLabel: d % 10 === 0 ? `Day ${day}` : '',
      value: parseFloat(compoundReality.toFixed(2)),
      secondaryValue: parseFloat(linearExpectation.toFixed(2)),
      threshold: 15,
      barMetric: Math.min(100, Math.round((compoundReality / 37.8) * 100)),
    });
  }

  return {
    type: 'behavioral',
    points,
    minY: 0,
    maxY: 40,
    unit: 'x',
  };
}

export function generateDopamineSpikeDrop(): ChartPresetResult {
  const rand = createSeededRandom(808);
  const points: TelemetryPoint[] = [];

  for (let i = 0; i <= 40; i++) {
    let dopamine = 100;

    if (i < 8) {
      dopamine = 100 + (rand() - 0.5) * 4;
    } else if (i >= 8 && i <= 15) {
      const progress = (i - 8) / 7;
      dopamine = 100 + Math.sin(progress * Math.PI) * 240;
    } else if (i > 15 && i <= 26) {
      const dropProgress = (i - 15) / 11;
      dopamine = 100 - Math.sin(dropProgress * Math.PI) * 45;
    } else {
      const rec = (i - 26) / 14;
      dopamine = 55 + rec * 42 + (rand() - 0.5) * 3;
    }

    points.push({
      xLabel:
        i === 4
          ? 'Baseline'
          : i === 12
            ? 'Peak Hit'
            : i === 21
              ? 'Trough'
              : i === 38
                ? 'Reset'
                : '',
      value: Math.round(dopamine),
      threshold: 100,
      barMetric: Math.round(dopamine / 3.4),
    });
  }

  return {
    type: 'behavioral',
    points,
    minY: 40,
    maxY: 360,
    unit: '%',
  };
}

export function generateDecisionFatigueCurve(): ChartPresetResult {
  const rand = createSeededRandom(909);
  const points: TelemetryPoint[] = [];

  for (let i = 0; i <= 44; i++) {
    let quality = 96 - (i / 44) * 72;

    if (i >= 20 && i <= 24) {
      quality += 18;
    }

    quality += (rand() - 0.5) * 3;

    points.push({
      xLabel:
        i === 2
          ? '9 AM'
          : i === 14
            ? '12 PM'
            : i === 22
              ? 'Lunch'
              : i === 34
                ? '4 PM'
                : i === 42
                  ? '7 PM'
                  : '',
      value: Math.round(Math.max(15, quality)),
      threshold: 50,
      barMetric: Math.round(Math.max(15, quality)),
    });
  }

  return {
    type: 'behavioral',
    points,
    minY: 10,
    maxY: 100,
    unit: '%',
  };
}

export function generateExpectationVsReality(): ChartPresetResult {
  const rand = createSeededRandom(1010);
  const points: TelemetryPoint[] = [];

  for (let i = 0; i <= 42; i++) {
    const ideal = 10 + (i / 42) * 85;

    let reality = ideal;
    if (i <= 10) {
      reality = ideal * 0.75 + (rand() - 0.5) * 8;
    } else if (i > 10 && i <= 22) {
      reality = 20 - ((i - 10) / 12) * 10 + (rand() - 0.5) * 6;
    } else if (i > 22 && i <= 34) {
      reality = 15 + ((i - 22) / 12) * 55 + (rand() - 0.5) * 10;
    } else {
      reality = 75 + ((i - 34) / 8) * 20 + (rand() - 0.5) * 4;
    }

    points.push({
      xLabel:
        i === 2
          ? 'Start'
          : i === 16
            ? 'Valley'
            : i === 28
              ? 'Pivot'
              : i === 40
                ? 'Mastery'
                : '',
      value: Math.round(Math.max(5, reality)),
      secondaryValue: Math.round(ideal),
      threshold: 60,
      barMetric: Math.round(Math.max(5, reality)),
    });
  }

  return {
    type: 'behavioral',
    points,
    minY: 0,
    maxY: 105,
    unit: '%',
  };
}

export function getDeterministicPresetData(presetName: string): ChartPresetResult {
  switch (presetName) {
    case 'uptrend_then_drop':
      return generateUptrendThenDrop();
    case 'uptrend_break':
      return generateUptrendBreak();
    case 'bull_breakout':
    case 'support_bounce':
      return generateBullBreakout();
    case 'head_and_shoulders':
      return generateHeadAndShoulders();
    case 'random_walk_line':
      return generateRandomWalkLine();
    case 'latency_spike':
      return generateLatencySpike();
    case 'throughput_scaling':
      return generateThroughputScaling();
    case 'memory_leak_curve':
      return generateMemoryLeakCurve();
    case 'load_balancer_flow':
      return generateLoadBalancerFlow();
    case 'habit_compounding':
      return generateHabitCompounding();
    case 'dopamine_spike_drop':
      return generateDopamineSpikeDrop();
    case 'decision_fatigue_curve':
      return generateDecisionFatigueCurve();
    case 'expectation_vs_reality':
      return generateExpectationVsReality();
    default:
      return generateUptrendThenDrop();
  }
}