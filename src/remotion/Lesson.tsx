/* Lesson composition (E.7): takes 09_episode_compiled.json as props and renders one language timeline with beat audio, word-synced reveals and captions. */
import React, { useMemo } from "react";
import { Html5Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import type { EpisodeCompiled, LanguageTimeline, CompiledBeat } from "../schemas/compiled";
import type { Scene } from "../schemas/episode";
import { SceneView } from "./SceneView";
import { computeReveal, type RevealBeat } from "./reveal";
import { DiagnosticsReporter, useFontsReady } from "./diagnostics";
import type { CaptionWord } from "./layout/Frame";

export interface LessonProps extends Record<string, unknown> {
  compiled: EpisodeCompiled;
  lang: string;
  diagnostics?: boolean;
  /** Render only these scene ids (tests and repair loops). */
  scenes?: string[];
}

export const FPS = 30;

function captionAt(beat: CompiledBeat, ms: number): CaptionWord[] {
  if (!beat.captions.length) return [];
  let phrase = beat.captions[0];
  for (const c of beat.captions) if (c.startMs <= ms) phrase = c;
  return phrase.words.map((w) => ({ text: w.text, spoken: w.startMs <= ms }));
}

const SceneRunner: React.FC<{ compiled: EpisodeCompiled; timeline: LanguageTimeline; scene: Scene; sceneStart: number; lang: string; diagnostics: boolean }> = ({
  compiled,
  timeline,
  scene,
  sceneStart,
  lang,
  diagnostics,
}) => {
  const frame = useCurrentFrame();
  const ep = compiled.episode;
  const beats = useMemo(() => timeline.beats.filter((b) => b.sceneId === scene.id), [timeline, scene.id]);
  const revealBeats: RevealBeat[] = useMemo(
    () =>
      scene.beats.map((b) => {
        const cb = beats.find((x) => x.beatId === b.id);
        const start = cb ? cb.startFrame - sceneStart : 0;
        return { visual: b.visual, visualCues: b.visualCues, startFrame: start, cues: cb ? cb.cues.map((c) => ({ target: c.target, frame: c.frame - sceneStart })) : [] };
      }),
    [scene, beats, sceneStart],
  );
  let idx = 0;
  revealBeats.forEach((b, i) => {
    if (b.startFrame <= frame) idx = i;
  });
  const beat = scene.beats[idx];
  const cb = beats.find((x) => x.beatId === beat.id);
  const msInBeat = cb ? ((frame + sceneStart - cb.startFrame) / FPS) * 1000 : 0;
  const persona = ep.personas[lang] ?? Object.values(ep.personas)[0];
  return (
    <>
      <SceneView
        template={scene.template}
        data={scene.data}
        title={scene.title}
        takeaways={scene.takeaways}
        header={{ course: ep.courseTitle, chapter: ep.chapterLabel, part: ep.partLabel, progress: ep.progress }}
        reveal={computeReveal(revealBeats, idx, frame)}
        visual={beat.visual}
        caption={cb ? captionAt(cb, msInBeat) : []}
        lang={lang}
        themeId={ep.theme}
        names={{ novice: persona?.novice.name ?? "Learner", mentor: persona?.mentor.name ?? "Mentor" }}
      />
      <DiagnosticsReporter label={`${scene.id}/${beat.id}`} enabled={diagnostics} />
    </>
  );
};

export const Lesson: React.FC<LessonProps> = ({ compiled, lang, diagnostics = false, scenes }) => {
  const ready = useFontsReady();
  const timeline = compiled.timelines[lang];
  if (!timeline) throw new Error(`no timeline for language "${lang}" in the compiled episode`);
  const byId = new Map(compiled.episode.scenes.map((s) => [s.id, s]));
  const selected = scenes?.length ? timeline.scenes.filter((s) => scenes.includes(s.sceneId)) : timeline.scenes;
  let offset = 0;
  const placed = selected.map((s) => {
    const from = scenes?.length ? offset : s.startFrame;
    offset += s.durationInFrames;
    return { ...s, from };
  });
  if (!ready) return null;
  return (
    <>
      {placed.map((s) => {
        const scene = byId.get(s.sceneId);
        if (!scene) throw new Error(`timeline scene ${s.sceneId} is not in the episode`);
        return (
          <Sequence key={s.sceneId} from={s.from} durationInFrames={s.durationInFrames} name={`${s.sceneId} ${scene.template}`}>
            <SceneRunner compiled={compiled} timeline={timeline} scene={scene} sceneStart={s.startFrame} lang={lang} diagnostics={diagnostics} />
            {timeline.beats
              .filter((b) => b.sceneId === s.sceneId)
              .map((b) => (
                <Sequence key={b.beatId} from={b.startFrame - s.startFrame} durationInFrames={b.durationInFrames} name={b.beatId} layout="none">
                  <Html5Audio src={staticFile(b.audio.file)} />
                </Sequence>
              ))}
          </Sequence>
        );
      })}
    </>
  );
};

export function lessonDuration(props: LessonProps): number {
  const t = props.compiled.timelines[props.lang];
  if (!t) return 1;
  if (!props.scenes?.length) return t.durationInFrames;
  return Math.max(1, t.scenes.filter((s) => props.scenes!.includes(s.sceneId)).reduce((a, s) => a + s.durationInFrames, 0));
}
