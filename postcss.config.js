import autoprefixer from "autoprefixer";
import calc from "postcss-calc";
import nested from "postcss-nested";
import customMedia from "postcss-custom-media";
import customProperties from "postcss-custom-properties";


export default {
  plugins: [
    nested(),
    autoprefixer(),
    customMedia(),
    customProperties(),
    calc(),
  ],
};
