import React from 'react';
import { Series, Sequence, Audio, staticFile, useCurrentFrame } from 'remotion';
import { Episode, Beat, Scene } from './types';
import { SceneLayout } from './components/SceneLayout';
import { TemplateRenderer } from './templates/TemplateRenderer';
import { episodeData } from './data/loadEpisode';

export const calculateBeatDuration = (beat: Beat, fps = 30): number => {
  if (beat.durationInFrames && beat.durationInFrames > 0) {
    return beat.durationInFrames;
  }
  if (beat.audioDurationSec && beat.audioDurationSec > 0) {
    const pauseFrames = beat.pauseAfterMs
      ? Math.round((beat.pauseAfterMs / 1000) * fps)
      : 12;
    return Math.round(beat.audioDurationSec * fps) + pauseFrames;
  }
  // Default beat duration if TTS is not yet generated: ~5s + pause
  const pauseFrames = beat.pauseAfterMs
    ? Math.round((beat.pauseAfterMs / 1000) * fps)
    : 12;
  return 150 + pauseFrames;
};

export const calculateSceneDuration = (scene: Scene, fps = 30): number => {
  return scene.beats.reduce(
    (acc, beat) => acc + calculateBeatDuration(beat, fps),
    0
  );
};

export const calculateTotalFrames = (episode: Episode, fps = 30): number => {
  let total = 0;
  for (const scene of episode.scenes) {
    total += calculateSceneDuration(scene, fps);
  }
  return Math.max(total, 30);
};

export type EpisodeCompositionProps = Record<string, unknown> & {
  customEpisode?: Episode;
};

interface ScenePlayerProps {
  scene: Scene;
  meta: Episode['meta'];
}

const ScenePlayer: React.FC<ScenePlayerProps> = ({ scene, meta }) => {
  const frame = useCurrentFrame();

  // Find which beat is active at this scene frame
  let elapsed = 0;
  let activeBeatIndex = 0;
  let beatStartFrame = 0;

  for (let i = 0; i < scene.beats.length; i++) {
    const dur = calculateBeatDuration(scene.beats[i], 30);
    if (frame < elapsed + dur) {
      activeBeatIndex = i;
      beatStartFrame = elapsed;
      break;
    }
    elapsed += dur;
    if (i === scene.beats.length - 1) {
      activeBeatIndex = i;
      beatStartFrame = elapsed - dur;
    }
  }

  const currentBeat = scene.beats[activeBeatIndex];
  const beatFrame = frame - beatStartFrame;
  const currentBeatDuration = calculateBeatDuration(currentBeat, 30);

  // Pre-calculate beat offsets for audio playback
  let runningOffset = 0;
  const beatAudios = scene.beats.map((beat) => {
    const start = runningOffset;
    const dur = calculateBeatDuration(beat, 30);
    runningOffset += dur;
    return {
      beat,
      from: start,
      durationInFrames: dur,
    };
  });

  return (
    <>
      <SceneLayout
        meta={meta}
        scene={scene}
        beat={currentBeat}
        beatFrame={beatFrame}
      >
        <TemplateRenderer
          scene={scene}
          beat={currentBeat}
          beatIndexInScene={activeBeatIndex}
          beatFrame={beatFrame}
          beatDuration={currentBeatDuration}
          allBeatsInScene={scene.beats}
        />
      </SceneLayout>

      {beatAudios.map(({ beat, from, durationInFrames }) => {
        if (!beat.audioFile) return null;
        return (
          <Sequence
            key={beat.id}
            from={from}
            durationInFrames={durationInFrames}
          >
            <Audio src={staticFile(beat.audioFile)} />
          </Sequence>
        );
      })}
    </>
  );
};

export const EpisodeComposition: React.FC<EpisodeCompositionProps> = (props) => {
  const data =
    props?.customEpisode ||
    (Array.isArray((props as unknown as Episode)?.scenes)
      ? (props as unknown as Episode)
      : episodeData);

  return (
    <Series>
      {data.scenes.map((scene, sIdx) => {
        const durationInFrames = calculateSceneDuration(scene, 30);
        return (
          <Series.Sequence
            key={`scene-${scene.segmentIndex ?? sIdx}`}
            durationInFrames={durationInFrames}
          >
            <ScenePlayer scene={scene} meta={data.meta} />
          </Series.Sequence>
        );
      })}
    </Series>
  );
};
