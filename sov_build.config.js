const buildConfig = {
  foldersToClean: ["./dist"],
  filesToCompile: [
    {
      input: "src/script.ts",
      output: "./dist/script.js",
      options: {
        buildOptions: {
          target: "esnext",
          sourcemap: false,
        },
        otherOptions: {
          esbuild: {
            loader: "ts",
            target: "esnext",
          },
        },
        outputOptions: {
          exports: "none",
          format: "esm",
        },
        type: "vanilla",
      },
    },
  ],
};

export default buildConfig;
