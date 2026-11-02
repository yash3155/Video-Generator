import React from 'react';
import { Meta, Scene, Beat } from '../types';

interface SceneLayoutProps {
  meta: Meta;
  scene: Scene;
  beat: Beat;
  beatFrame?: number;
  children: React.ReactNode;
}

export const SceneLayout: React.FC<SceneLayoutProps> = ({
  meta,
  scene,
  beat,
  beatFrame = 0,
  children,
}) => {
  const totalSegments = meta.totalSegments || 7;
  const currentSegment = scene.segmentIndex;
  const currentMs = (beatFrame / 30) * 1000;
  const phrases = beat.subtitlePhrases;
  const hasPhraseAlignment = Array.isArray(phrases) && phrases.length > 1;

  return (
    <div
      className="relative flex flex-col justify-between select-none overflow-hidden"
      style={{
        width: 1920,
        height: 1080,
        backgroundColor: '#F7F6F2',
        padding: '56px 96px',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* 2. Top Header Bar */}
      <header className="w-full flex flex-col shrink-0">
        <div className="flex items-center justify-between w-full">
          {/* Top row left: uppercase monospace breadcrumb */}
          <span
            className="font-mono text-base font-semibold tracking-wider uppercase truncate max-w-[1200px]"
            style={{ color: '#8B7355' }}
          >
            {meta.course} · {meta.chapter}
          </span>

          {/* Top row right: segment indicator pills */}
          <div className="flex items-center space-x-2">
            {Array.from({ length: totalSegments }).map((_, idx) => {
              const isFilled = idx <= currentSegment;
              return (
                <div
                  key={idx}
                  className="h-1.5 w-7 rounded-full transition-colors duration-300"
                  style={{
                    backgroundColor: isFilled ? '#C86D51' : '#E2E0D8',
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Second row: bold slide title */}
        <h1
          className="text-4xl font-bold mt-2 tracking-tight"
          style={{ color: '#1E1E1E' }}
        >
          {scene.title}
        </h1>
      </header>

      {/* 3. Center Main Card */}
      <main
        className="flex-1 my-6 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#EAE8E1] p-12 relative overflow-hidden flex flex-col justify-center"
        style={{
          backgroundImage: 'radial-gradient(#e5e7eb 1.5px, transparent 1.5px)',
          backgroundSize: '20px 20px',
        }}
      >
        {children}
      </main>

      {/* 4. Bottom Subtitle Bar */}
      <footer className="w-full h-10 flex items-center justify-center shrink-0">
        {hasPhraseAlignment ? (
          <div className="text-2xl tracking-tight text-center max-w-[1720px] flex items-center justify-center space-x-2 flex-wrap">
            {phrases.map((phrase, idx) => {
              const isCurrent = currentMs >= phrase.startMs && currentMs <= phrase.endMs;
              const isPast = currentMs > phrase.endMs;
              return (
                <span
                  key={idx}
                  className={`transition-colors duration-200 px-1 py-0.5 rounded ${
                    isCurrent
                      ? 'font-bold text-[#1E1E1E] bg-[#FDE68A]/50'
                      : isPast
                        ? 'font-medium text-[#4B5563]'
                        : 'font-normal text-[#9CA3AF]'
                  }`}
                >
                  {phrase.text}
                </span>
              );
            })}
          </div>
        ) : (
          <p className="text-2xl text-[#2C2C2C] font-medium tracking-tight text-center truncate max-w-[1720px]">
            {beat.en_subtitle}
          </p>
        )}
      </footer>
    </div>
  );
};

