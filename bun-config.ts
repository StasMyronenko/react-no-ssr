Bun.build({
  entrypoints: ["src/index.ts"],
  root: "src",
  outdir: "dist/cjs",
  target: "browser",
  format: "cjs",
  splitting: true,
  sourcemap: "external",
  external: ["react"],
  minify: false,
});

Bun.build({
  entrypoints: ["src/index.ts"],
  root: "src",
  outdir: "dist/esm",
  target: "browser",
  format: "esm",
  splitting: true,
  sourcemap: "external",
  external: ["react"],
  minify: false,
});
