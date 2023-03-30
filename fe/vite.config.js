import vue from '@vitejs/plugin-vue'
import vueJsx from "@vitejs/plugin-vue-jsx"
import UnoCSS from 'unocss/vite'
import Inspect from 'vite-plugin-inspect'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
// import {presetUno} from 'unocss';
import tvuxCss from './src/styles/tvuxcss'
import path from 'path';

export default {
  plugins: [
    vue(),
    vueJsx({}),
    Inspect(),
    Components({}),
    AutoImport({
      imports: ['vue'],
      resolvers: [
        ElementPlusResolver(),
      ],
      dirs: [
        './composables/**',
      ],
      vueTemplate: true,
      cache: true,
    }),
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
