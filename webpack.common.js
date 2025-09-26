/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

module.exports = {
  // entry: "./src/index.ts",
  entry: {
    mzh_accountform: "./src/Forms/AccountForm.ts",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    // path: path.resolve(__dirname, "dist"),
    // filename: "stw_Account.js",
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    // Set this to your namespace e.g. cds.ClientHooks
    library: ["cds"],
    libraryTarget: "var",
  },
};
