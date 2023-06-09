import css from 'jinguji/src/styles/tvuxcss'
import vue from '@vitejs/plugin-vue'
import vueJsx from "@vitejs/plugin-vue-jsx"
import UnoCSS from 'unocss/vite'
import Inspect from 'vite-plugin-inspect'
import path from 'path';

export default {
  plugins: [
    vue(),
    vueJsx({}),
    Inspect(),
    UnoCSS({rules: css})
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}
