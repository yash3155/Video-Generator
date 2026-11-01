import { Episode } from '../types';
import rawData from './episode_raw.json';
import compiledData from './episode_compiled.json';

export const resolveEpisode = (raw: Episode, compiled?: Episode): Episode => {
  if (!compiled || !Array.isArray(compiled.scenes)) {
    return raw;
  }
  const compiledMatchesRaw =
    compiled.scenes.length === raw.scenes.length &&
    compiled.scenes.every(
      (scene, sceneIndex) =>
        scene.beats?.length === raw.scenes[sceneIndex]?.beats?.length &&
        scene.beats.every(
          (beat, beatIndex) =>
            beat.hindi_tts === raw.scenes[sceneIndex]?.beats[beatIndex]?.hindi_tts
        )
    );

  return (compiledMatchesRaw ? compiled : raw) as Episode;
};

export const getEpisodeData = (): Episode => {
  return resolveEpisode(rawData as unknown as Episode, compiledData as unknown as Episode);
};

export const episodeData: Episode = getEpisodeData();
