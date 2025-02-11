const buildConfig = {
  foldersToClean: ["./dist"],
  filesToCompile: [
    {
      input: "src/script.ts",
      output: "./dist/script.js",
      options: {
        buildOptions: {
          target: "esnext",
        },
        otherOptions: {
          esbuild: {
            loader: "ts",
            target: "esnext",
          },
        },
        outputOptions: {
          exports: "none",
          //           commonjs
          // esm
          // module
          // systemjs
          // amd
          // cjs
          // es
          // iife
          // system
          // umd
          format: "esm",
        },
        type: "vanilla",
      },
    },
  ],
};

export default buildConfig;
