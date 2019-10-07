const path = require("path");
const fs = require("fs");
const spawn = require("child_process").spawn;
const pathOutput = path.resolve(__dirname, "dist");

class FSCopyPlugin {
  apply(compiler) {
    compiler.hooks.done.tap("FS copy plugin", (
      stats /* stats is passed as argument when done hook is tapped.  */
    ) => {
      const tsc = spawn("yarn", ["tsc"], { shell: true, stdio: "inherit" });
      tsc.once("exit", () => {
        ["pico.js", "lploc.js"].forEach(file => {
          fs.copyFile(
            path.resolve(__dirname, "src", file),
            path.resolve(__dirname, "build", "src", file),
            err => {
              if (err) throw err;
            }
          );
        });
      });
    });
  }
}

const createConfig = (mode, plugins) => ({
  mode,
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              context: __dirname,
              configFile: "tsconfig.webpack.json"
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  plugins,
  resolve: {
    extensions: [".ts", ".js"]
  },
  output: {
    filename: mode === "production" ? "picojs.min.js" : "picojs.js",
    path: pathOutput,
    libraryTarget: "umd",
    globalObject: "this",
    library: "picojs"
  },
  node: {
    __dirname: false
  },
  devtool: mode === "production" && "source-map"
});

module.exports = [
  createConfig("production"),
  createConfig("development", [new FSCopyPlugin({ options: true })])
];
