# Intro film

Put your opening film in this folder, then point `introVideo` in
`src/lib/content.ts` at it (e.g. `"/media/intro.mp4"`). Until you do, the
curtain uses the WebGL "evolution" scene in
`src/components/EvolutionScene.tsx`.
- Suggested: 8–20s, silent, seamless loop, 1920x1080 H.264, under ~8 MB.
  It is rendered at `object-cover` with 55% opacity behind a vignette, so
  choose something with dark areas and no important detail near the centre
  (the logo and wordmark sit there).
