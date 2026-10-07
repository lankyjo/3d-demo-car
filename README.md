# Toyota 3D Configurator

A Vite + React + TypeScript + React Three Fiber demo built around the supplied `sample.glb`.

## Run

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite.

## Model

The uploaded model is already wired in at:

`public/models/sample.glb`

To test another file, replace that GLB with your own file using the same name, or change the path in `src/components/CarModel.tsx`.

## Paint recoloring

The uploaded GLB has red paint baked into its texture, so this demo performs a browser-side red-pixel recolor. It is good for prototyping, but a production configurator should ideally use a separate body-paint material or a body mask texture.
