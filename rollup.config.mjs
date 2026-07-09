import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/rss-newsreader-card.ts",
  output: {
    file: "custom_components/rss_newsreader/frontend/rss-newsreader-card.js",
    format: "es",
    sourcemap: false,
  },
  plugins: [
    nodeResolve(),
    typescript(),
    // Lit 3 requires ES2022+: terser must not downlevel class syntax
    terser({ ecma: 2022, format: { comments: false } }),
  ],
};
