/* Still composition: one template fixture (or one beat) rendered with everything revealed. Used by render:stills and QA. */
import React from "react";
import { StillFixture, type StillFixtureInput } from "./fixture";
import { SceneView } from "./SceneView";
import { revealAll } from "./reveal";
import { DiagnosticsReporter, useFontsReady } from "./diagnostics";

export interface StillProps extends Record<string, unknown> {
  label: string;
  fixture: StillFixtureInput;
  diagnostics: boolean;
}

export const Still: React.FC<StillProps> = ({ label, fixture, diagnostics }) => {
  const ready = useFontsReady();
  const f = StillFixture.parse(fixture);
  const caption = f.caption ? f.caption.split(/\s+/).map((w, i, all) => ({ text: w, spoken: i < Math.ceil(all.length / 2) })) : [];
  return (
    <>
      <SceneView
        template={f.template}
        data={f.data}
        title={f.title}
        takeaways={f.takeaways}
        header={f.header}
        reveal={revealAll(f.visual)}
        visual={f.visual}
        caption={caption}
        lang={f.lang}
        themeId={f.theme}
        names={f.names}
      />
      {ready ? <DiagnosticsReporter label={label} enabled={diagnostics} /> : null}
    </>
  );
};
