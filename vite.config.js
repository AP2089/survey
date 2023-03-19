import { defineConfig } from 'vite';
import path from 'path';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import handlebars from 'vite-plugin-handlebars';
import vitePluginAutoGenerationWebp from './plugins/vite-plugin-auto-generation-webp';
import vitePluginAutoAddComponents from './plugins/vite-plugin-auto-add-components';
import vitePluginHtmlBeautify from './plugins/vite-plugin-html-beautify';
import pagesContext from './src/data/context.json';
import pagesComponents from './src/data/components.json';

const baseUrl = process.env.NODE_ENV === 'production' ? '/survey/' : '/';

export default defineConfig({
  base: baseUrl,
  root: path.resolve(process.cwd(), 'src'),
  build: {
    outDir: path.resolve(__dirname, 'dist')
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '~': path.resolve(__dirname, 'node_modules')
    },
    extensions: ['.js', '.json', '.css', '.scss', '.html']
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/styles/_config.scss";
          @import "@/styles/_mixins.scss";
        `
      }
    }
  },
  plugins: [
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/sprites')],
      symbolId: '[name]',
      inject: 'body-first',
      customDomId: 'sprite-svg'
    }),
    handlebars({
      runtimeOptions: {
        data: {
          baseUrl,
          ...pagesComponents
        }
      },
      context(pagePath) {
        return pagesContext[path.parse(pagePath).name];
      },
      partialDirectory: [
        path.resolve(__dirname, 'src/components'),
        path.resolve(__dirname, 'src/layouts')
      ],
      helpers: {
        include: (partial) => {
          return `${partial}/${partial}`;
        },
        math: (lvalue, operator, rvalue) => {
          lvalue = parseFloat(lvalue);
          rvalue = parseFloat(rvalue);
              
          return {
            '+': lvalue + rvalue,
            '-': lvalue - rvalue,
            '*': lvalue * rvalue,
            '/': lvalue / rvalue,
            '%': lvalue % rvalue
          }[operator];
        }
      }
    }),
    vitePluginAutoGenerationWebp({
      src: [
        './src/images/**/*.{png,jpg,jpeg}',
        './public/images/**/*.{png,jpg,jpeg}'
      ]
    }),
    vitePluginAutoAddComponents(),
    vitePluginHtmlBeautify({
      indent_size: 2
    })
  ]
});