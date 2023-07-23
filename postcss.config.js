import autoprefixer from "autoprefixer";
import calc from "postcss-calc";
import nested from "postcss-nested";
import customMedia from "postcss-custom-media";
import customProperties from "postcss-custom-properties";
import globalData from "@csstools/postcss-global-data";


export default {
  plugins: [
    nested(),
    calc(),
    customMedia(),
    customProperties({
      preserve: true,
    }),
    autoprefixer(),
    globalData({
      files: [
        "src/assets/css/data/_variables.css",
      ],
    }),
  ],
};
