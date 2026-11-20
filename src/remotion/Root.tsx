/* Remotion root: the Lesson video composition and the Still composition used for fixture and QA stills. */
import "katex/dist/katex.min.css";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import "@fontsource/jetbrains-mono/latin-400.css";
import "@fontsource/noto-sans-devanagari/devanagari-400.css";
import "@fontsource/noto-sans-devanagari/devanagari-600.css";
import "@fontsource/noto-sans-devanagari/devanagari-700.css";
import React from "react";
import { Composition, type CalculateMetadataFunction } from "remotion";
import { Lesson, lessonDuration, FPS, type LessonProps } from "./Lesson";
import { Still, type StillProps } from "./Still";

const calculateLesson: CalculateMetadataFunction<LessonProps> = ({ props }) => ({ durationInFrames: lessonDuration(props) });

const defaultStill: StillProps = {
  label: "default",
  diagnostics: false,
  fixture: {
    template: "progressive_cards",
    title: "OpenLectern",
    takeaways: [],
    data: { cards: [{ id: "a", title: "Open", body: "Open source lesson videos." }, { id: "b", title: "Checked", body: "Every scene passes QA." }] },
    visual: { show: [] },
    lang: "en",
    header: { course: "OpenLectern", chapter: "Preview", part: "Still", progress: { index: 0, total: 1 } },
    names: { novice: "Learner", mentor: "Mentor" },
  },
};

export const Root: React.FC = () => (
  <>
    <Composition id="Lesson" component={Lesson} width={1920} height={1080} fps={FPS} durationInFrames={1} defaultProps={{ lang: "en" } as unknown as LessonProps} calculateMetadata={calculateLesson} />
    <Composition id="Still" component={Still} width={1920} height={1080} fps={FPS} durationInFrames={1} defaultProps={defaultStill} />
  </>
);
