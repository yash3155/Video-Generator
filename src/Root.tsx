import "./index.css";
import React from "react";
import { Composition, CalculateMetadataFunction } from "remotion";
import {
  EpisodeComposition,
  calculateTotalFrames,
  EpisodeCompositionProps,
} from "./EpisodeComposition";
import { episodeData } from "./data/loadEpisode";
import { Episode } from "./types";

const calculateMetadata: CalculateMetadataFunction<EpisodeCompositionProps> = ({
  props,
}) => {
  const currentData =
    props?.customEpisode ||
    (Array.isArray((props as unknown as Episode)?.scenes)
      ? (props as unknown as Episode)
      : episodeData);
  const totalFrames = calculateTotalFrames(currentData, 30);
  return {
    durationInFrames: totalFrames,
    fps: 30,
    width: 1920,
    height: 1080,
  };
};

export const RemotionRoot: React.FC = () => {
  const defaultFrames = calculateTotalFrames(episodeData, 30);

  return (
    <>
      <Composition
        id="EpisodeComposition"
        component={EpisodeComposition}
        durationInFrames={defaultFrames}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={calculateMetadata}
        defaultProps={{}}
      />
      <Composition
        id="EpisodeVideo"
        component={EpisodeComposition}
        durationInFrames={defaultFrames}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={calculateMetadata}
        defaultProps={{}}
      />
    </>
  );
};
