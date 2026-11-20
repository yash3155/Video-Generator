import fs from "node:fs";
import path from "node:path";

/** Write 16-bit mono PCM samples (-1..1) as a WAV file. */
export function writeWav(file: string, samples: Float32Array, sampleRate = 24000): void {
  const dataBytes = samples.length * 2;
  const buf = Buffer.alloc(44 + dataBytes);
  buf.write("RIFF", 0, "ascii");
  buf.writeUInt32LE(36 + dataBytes, 4);
  buf.write("WAVE", 8, "ascii");
  buf.write("fmt ", 12, "ascii");
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(sampleRate, 24);
  buf.writeUInt32LE(sampleRate * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36, "ascii");
  buf.writeUInt32LE(dataBytes, 40);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buf.writeInt16LE(Math.round(s * 32767), 44 + i * 2);
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, buf);
}

/** Duration of a PCM WAV file written by writeWav (or any canonical 44-byte-header WAV). */
export function wavDurationMs(file: string): number {
  const buf = fs.readFileSync(file);
  const byteRate = buf.readUInt32LE(28);
  const dataBytes = buf.readUInt32LE(40);
  return (dataBytes / byteRate) * 1000;
}
