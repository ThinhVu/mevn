import vue from '@vitejs/plugin-vue'
import ssr from 'vite-plugin-ssr/plugin'
import UnoCSS from 'unocss/vite'
// import {presetUno} from 'unocss';
import tvuxCss from './client/css/tvuxcss'

export default {
  plugins: [
    vue(),
    ssr(),
    UnoCSS({
      /* https://github.com/unocss/unocss#using-presets */
      presets: [
          // presetUno()
      ],
      rules: tvuxCss
    })
  ]
}
