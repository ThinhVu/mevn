import vue from '@vitejs/plugin-vue'
import vueJsx from "@vitejs/plugin-vue-jsx"
import UnoCSS from 'unocss/vite'
import Inspect from 'vite-plugin-inspect'
// import {presetUno} from 'unocss';
import tvuxCss from 'jinguji/src/styles/tvuxcss'
import path from 'path';

export default {
  plugins: [
    vue(),
    vueJsx({}),
    Inspect(),
    UnoCSS({
      /* https://github.com/unocss/unocss#using-presets */
      presets: [
        // presetUno()
      ],
      rules: tvuxCss
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}
