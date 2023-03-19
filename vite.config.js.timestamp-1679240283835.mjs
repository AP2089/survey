// vite.config.js
import { defineConfig } from "file:///D:/projects/survey/node_modules/vite/dist/node/index.js";
import path2 from "path";
import { createSvgIconsPlugin } from "file:///D:/projects/survey/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import handlebars from "file:///D:/projects/survey/node_modules/vite-plugin-handlebars/dist/index.js";

// plugins/vite-plugin-auto-generation-webp/index.js
import chokidar from "file:///D:/projects/survey/node_modules/chokidar/index.js";
import sharp from "file:///D:/projects/survey/node_modules/sharp/lib/index.js";
var vitePluginAutoGenerationWebp = (options = {}) => ({
  name: "vite-plugin-auto-generation-webp",
  buildStart: async () => {
    try {
      const watcher = chokidar.watch(options.src);
      const events = ["add", "change"];
      watcher.on("all", (event, target) => {
        if (events.includes(event)) {
          sharp(target).webp().toFile(target.replace(/\.[^.]+$/, ".webp")).catch((error) => {
            console.log(error);
          });
        }
      });
      if (process.env.NODE_ENV === "production") {
        await watcher.close();
      }
    } catch (error) {
      console.log(error);
    }
  }
});
var vite_plugin_auto_generation_webp_default = vitePluginAutoGenerationWebp;

// plugins/vite-plugin-auto-add-components/index.js
import path from "path";
import fs from "fs";
import chokidar2 from "file:///D:/projects/survey/node_modules/chokidar/index.js";
import { globSync } from "file:///D:/projects/survey/node_modules/glob/dist/mjs/index.js";
var __vite_injected_original_dirname = "D:\\projects\\survey\\plugins\\vite-plugin-auto-add-components";
var rootPath = path.join(__vite_injected_original_dirname, "../..");
var componentsPath = "src/components";
var stylesChange = () => {
  const files = globSync(`${componentsPath}/**/*.scss`);
  const content = files.reduce((acc, val) => {
    const parse = path.parse(val);
    const fileName = parse.name.replace(/_/, "");
    const dirName = parse.dir.split(path.sep).pop();
    if (fileName === dirName) {
      acc += `@import '${componentsPath}/${dirName}/${fileName}';
`;
    }
    return acc;
  }, "");
  fs.writeFileSync(path.join(rootPath, "src/styles/_components.scss"), content);
};
var jsonChange = () => {
  const files = globSync(`${componentsPath}/**/*.json`);
  const content = files.reduce((acc, val) => {
    const parse = path.parse(val);
    const fileName = parse.name;
    const dirName = parse.dir.split(path.sep).pop();
    if (fileName === dirName) {
      const data = fs.readFileSync(path.join(rootPath, val), "utf-8");
      if (data) {
        acc[parse.name] = JSON.parse(data);
      }
    }
    return acc;
  }, {});
  fs.writeFileSync(path.join(rootPath, "src/data/components.json"), JSON.stringify(content, null, 2));
};
var vitePluginAutoAddComponents = () => ({
  name: "vite-plugin-auto-add-components",
  buildStart: async () => {
    try {
      const stylesWatcher = chokidar2.watch(`${componentsPath}/**/*.scss`);
      const jsonWatcher = chokidar2.watch(`${componentsPath}/**/*.json`);
      stylesWatcher.on("add", stylesChange).on("unlink", stylesChange);
      jsonWatcher.on("add", jsonChange).on("change", jsonChange).on("unlink", jsonChange);
      if (process.env.NODE_ENV === "production") {
        await stylesWatcher.close();
        await jsonWatcher.close();
      }
    } catch (error) {
      console.log(error);
    }
  }
});
var vite_plugin_auto_add_components_default = vitePluginAutoAddComponents;

// plugins/vite-plugin-html-beautify/index.js
import jsBeautify from "file:///D:/projects/survey/node_modules/js-beautify/js/index.js";
var vitePluginHtmlBeautify = (options = {}) => ({
  name: "vite-plugin-html-beautify",
  transformIndexHtml(html) {
    return jsBeautify.html_beautify(html, options);
  }
});
var vite_plugin_html_beautify_default = vitePluginHtmlBeautify;

// src/data/context.json
var context_default = {
  index: {
    title: "\u0413\u043B\u0430\u0432\u043D\u0430\u044F"
  }
};

// src/data/components.json
var components_default = {
  survey: {
    list: [
      {
        id: 1,
        title: "Lorem Ipsum is simply dummy text of",
        sublist: [
          "Lorem Ipsum is simply dummy text",
          "Lorem Ipsum is",
          "Lorem Ipsum is simply",
          "Lorem Ipsum",
          "Lorem Ipsum has been",
          "Lorem Ipsum standard dummy"
        ]
      },
      {
        id: 2,
        title: "Lorem Ipsum has been the industry's standard dummy",
        sublist: [
          "Lorem Ipsum is simply dummy text",
          "Lorem Ipsum is",
          "Lorem Ipsum is simply"
        ]
      },
      {
        id: 3,
        title: "Lorem Ipsum is simply dummy text of the printing",
        sublist: [
          "Lorem Ipsum is simply dummy text",
          "Lorem Ipsum is"
        ]
      },
      {
        id: 4,
        title: "Lorem Ipsum has been the industry's standard dummy text",
        sublist: [
          "Lorem Ipsum has been",
          "Lorem Ipsum standard dummy"
        ]
      }
    ]
  }
};

// vite.config.js
var __vite_injected_original_dirname2 = "D:\\projects\\survey";
var baseUrl = process.env.NODE_ENV === "production" ? "/survey/" : "/";
var vite_config_default = defineConfig({
  base: baseUrl,
  root: path2.resolve(process.cwd(), "src"),
  build: {
    outDir: path2.resolve(__vite_injected_original_dirname2, "dist")
  },
  resolve: {
    alias: {
      "@": path2.resolve(__vite_injected_original_dirname2, "src"),
      "~": path2.resolve(__vite_injected_original_dirname2, "node_modules")
    },
    extensions: [".js", ".json", ".scss", ".html"]
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
      iconDirs: [path2.resolve(process.cwd(), "src/sprites")],
      symbolId: "[name]",
      inject: "body-first",
      customDomId: "sprite-svg"
    }),
    handlebars({
      runtimeOptions: {
        data: {
          baseUrl,
          ...components_default
        }
      },
      context(pagePath) {
        return context_default[path2.parse(pagePath).name];
      },
      partialDirectory: [
        path2.resolve(__vite_injected_original_dirname2, "src/components"),
        path2.resolve(__vite_injected_original_dirname2, "src/layouts")
      ],
      helpers: {
        include: (partial) => {
          return `${partial}/${partial}`;
        },
        math: (lvalue, operator, rvalue) => {
          lvalue = parseFloat(lvalue);
          rvalue = parseFloat(rvalue);
          return {
            "+": lvalue + rvalue,
            "-": lvalue - rvalue,
            "*": lvalue * rvalue,
            "/": lvalue / rvalue,
            "%": lvalue % rvalue
          }[operator];
        }
      }
    }),
    vite_plugin_auto_generation_webp_default({
      src: [
        "./src/images/**/*.{png,jpg,jpeg}",
        "./public/images/**/*.{png,jpg,jpeg}"
      ]
    }),
    vite_plugin_auto_add_components_default(),
    vite_plugin_html_beautify_default({
      indent_size: 2
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiLCAicGx1Z2lucy92aXRlLXBsdWdpbi1hdXRvLWdlbmVyYXRpb24td2VicC9pbmRleC5qcyIsICJwbHVnaW5zL3ZpdGUtcGx1Z2luLWF1dG8tYWRkLWNvbXBvbmVudHMvaW5kZXguanMiLCAicGx1Z2lucy92aXRlLXBsdWdpbi1odG1sLWJlYXV0aWZ5L2luZGV4LmpzIiwgInNyYy9kYXRhL2NvbnRleHQuanNvbiIsICJzcmMvZGF0YS9jb21wb25lbnRzLmpzb24iXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxwcm9qZWN0c1xcXFxzdXJ2ZXlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXHByb2plY3RzXFxcXHN1cnZleVxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovcHJvamVjdHMvc3VydmV5L3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgeyBjcmVhdGVTdmdJY29uc1BsdWdpbiB9IGZyb20gJ3ZpdGUtcGx1Z2luLXN2Zy1pY29ucyc7XHJcbmltcG9ydCBoYW5kbGViYXJzIGZyb20gJ3ZpdGUtcGx1Z2luLWhhbmRsZWJhcnMnO1xyXG5pbXBvcnQgdml0ZVBsdWdpbkF1dG9HZW5lcmF0aW9uV2VicCBmcm9tICcuL3BsdWdpbnMvdml0ZS1wbHVnaW4tYXV0by1nZW5lcmF0aW9uLXdlYnAnO1xyXG5pbXBvcnQgdml0ZVBsdWdpbkF1dG9BZGRDb21wb25lbnRzIGZyb20gJy4vcGx1Z2lucy92aXRlLXBsdWdpbi1hdXRvLWFkZC1jb21wb25lbnRzJztcclxuaW1wb3J0IHZpdGVQbHVnaW5IdG1sQmVhdXRpZnkgZnJvbSAnLi9wbHVnaW5zL3ZpdGUtcGx1Z2luLWh0bWwtYmVhdXRpZnknO1xyXG5pbXBvcnQgcGFnZXNDb250ZXh0IGZyb20gJy4vc3JjL2RhdGEvY29udGV4dC5qc29uJztcclxuaW1wb3J0IHBhZ2VzQ29tcG9uZW50cyBmcm9tICcuL3NyYy9kYXRhL2NvbXBvbmVudHMuanNvbic7XHJcblxyXG5jb25zdCBiYXNlVXJsID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJyA/ICcvc3VydmV5LycgOiAnLyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIGJhc2U6IGJhc2VVcmwsXHJcbiAgcm9vdDogcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksICdzcmMnKSxcclxuICBidWlsZDoge1xyXG4gICAgb3V0RGlyOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnZGlzdCcpXHJcbiAgfSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKSxcclxuICAgICAgJ34nOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnbm9kZV9tb2R1bGVzJylcclxuICAgIH0sXHJcbiAgICBleHRlbnNpb25zOiBbJy5qcycsICcuanNvbicsICcuc2NzcycsICcuaHRtbCddXHJcbiAgfSxcclxuICBjc3M6IHtcclxuICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcclxuICAgICAgc2Nzczoge1xyXG4gICAgICAgIGFkZGl0aW9uYWxEYXRhOiBgXHJcbiAgICAgICAgICBAaW1wb3J0IFwiQC9zdHlsZXMvX2NvbmZpZy5zY3NzXCI7XHJcbiAgICAgICAgICBAaW1wb3J0IFwiQC9zdHlsZXMvX21peGlucy5zY3NzXCI7XHJcbiAgICAgICAgYFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBwbHVnaW5zOiBbXHJcbiAgICBjcmVhdGVTdmdJY29uc1BsdWdpbih7XHJcbiAgICAgIGljb25EaXJzOiBbcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksICdzcmMvc3ByaXRlcycpXSxcclxuICAgICAgc3ltYm9sSWQ6ICdbbmFtZV0nLFxyXG4gICAgICBpbmplY3Q6ICdib2R5LWZpcnN0JyxcclxuICAgICAgY3VzdG9tRG9tSWQ6ICdzcHJpdGUtc3ZnJ1xyXG4gICAgfSksXHJcbiAgICBoYW5kbGViYXJzKHtcclxuICAgICAgcnVudGltZU9wdGlvbnM6IHtcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICBiYXNlVXJsLFxyXG4gICAgICAgICAgLi4ucGFnZXNDb21wb25lbnRzXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBjb250ZXh0KHBhZ2VQYXRoKSB7XHJcbiAgICAgICAgcmV0dXJuIHBhZ2VzQ29udGV4dFtwYXRoLnBhcnNlKHBhZ2VQYXRoKS5uYW1lXTtcclxuICAgICAgfSxcclxuICAgICAgcGFydGlhbERpcmVjdG9yeTogW1xyXG4gICAgICAgIHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvY29tcG9uZW50cycpLFxyXG4gICAgICAgIHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvbGF5b3V0cycpXHJcbiAgICAgIF0sXHJcbiAgICAgIGhlbHBlcnM6IHtcclxuICAgICAgICBpbmNsdWRlOiAocGFydGlhbCkgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIGAke3BhcnRpYWx9LyR7cGFydGlhbH1gO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbWF0aDogKGx2YWx1ZSwgb3BlcmF0b3IsIHJ2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgbHZhbHVlID0gcGFyc2VGbG9hdChsdmFsdWUpO1xyXG4gICAgICAgICAgcnZhbHVlID0gcGFyc2VGbG9hdChydmFsdWUpO1xyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgJysnOiBsdmFsdWUgKyBydmFsdWUsXHJcbiAgICAgICAgICAgICctJzogbHZhbHVlIC0gcnZhbHVlLFxyXG4gICAgICAgICAgICAnKic6IGx2YWx1ZSAqIHJ2YWx1ZSxcclxuICAgICAgICAgICAgJy8nOiBsdmFsdWUgLyBydmFsdWUsXHJcbiAgICAgICAgICAgICclJzogbHZhbHVlICUgcnZhbHVlXHJcbiAgICAgICAgICB9W29wZXJhdG9yXTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pLFxyXG4gICAgdml0ZVBsdWdpbkF1dG9HZW5lcmF0aW9uV2VicCh7XHJcbiAgICAgIHNyYzogW1xyXG4gICAgICAgICcuL3NyYy9pbWFnZXMvKiovKi57cG5nLGpwZyxqcGVnfScsXHJcbiAgICAgICAgJy4vcHVibGljL2ltYWdlcy8qKi8qLntwbmcsanBnLGpwZWd9J1xyXG4gICAgICBdXHJcbiAgICB9KSxcclxuICAgIHZpdGVQbHVnaW5BdXRvQWRkQ29tcG9uZW50cygpLFxyXG4gICAgdml0ZVBsdWdpbkh0bWxCZWF1dGlmeSh7XHJcbiAgICAgIGluZGVudF9zaXplOiAyXHJcbiAgICB9KVxyXG4gIF1cclxufSk7IiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxwcm9qZWN0c1xcXFxzdXJ2ZXlcXFxccGx1Z2luc1xcXFx2aXRlLXBsdWdpbi1hdXRvLWdlbmVyYXRpb24td2VicFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxccHJvamVjdHNcXFxcc3VydmV5XFxcXHBsdWdpbnNcXFxcdml0ZS1wbHVnaW4tYXV0by1nZW5lcmF0aW9uLXdlYnBcXFxcaW5kZXguanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L3Byb2plY3RzL3N1cnZleS9wbHVnaW5zL3ZpdGUtcGx1Z2luLWF1dG8tZ2VuZXJhdGlvbi13ZWJwL2luZGV4LmpzXCI7aW1wb3J0IGNob2tpZGFyIGZyb20gJ2Nob2tpZGFyJztcclxuaW1wb3J0IHNoYXJwIGZyb20gJ3NoYXJwJztcclxuXHJcbmNvbnN0IHZpdGVQbHVnaW5BdXRvR2VuZXJhdGlvbldlYnAgPSAob3B0aW9ucyA9IHt9KSA9PiAoe1xyXG4gIG5hbWU6ICd2aXRlLXBsdWdpbi1hdXRvLWdlbmVyYXRpb24td2VicCcsXHJcbiAgYnVpbGRTdGFydDogYXN5bmMgKCkgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3Qgd2F0Y2hlciA9IGNob2tpZGFyLndhdGNoKG9wdGlvbnMuc3JjKTtcclxuICAgICAgY29uc3QgZXZlbnRzID0gWydhZGQnLCAnY2hhbmdlJ107XHJcbiAgXHJcbiAgICAgIHdhdGNoZXIub24oJ2FsbCcsIChldmVudCwgdGFyZ2V0KSA9PiB7XHJcbiAgICAgICAgaWYgKGV2ZW50cy5pbmNsdWRlcyhldmVudCkpIHtcclxuICAgICAgICAgIHNoYXJwKHRhcmdldClcclxuICAgICAgICAgICAgLndlYnAoKVxyXG4gICAgICAgICAgICAudG9GaWxlKHRhcmdldC5yZXBsYWNlKC9cXC5bXi5dKyQvLCAnLndlYnAnKSlcclxuICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIFxyXG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJykge1xyXG4gICAgICAgIGF3YWl0IHdhdGNoZXIuY2xvc2UoKTtcclxuICAgICAgfSAgXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICB9XHJcbiAgfVxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHZpdGVQbHVnaW5BdXRvR2VuZXJhdGlvbldlYnA7IiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxwcm9qZWN0c1xcXFxzdXJ2ZXlcXFxccGx1Z2luc1xcXFx2aXRlLXBsdWdpbi1hdXRvLWFkZC1jb21wb25lbnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxwcm9qZWN0c1xcXFxzdXJ2ZXlcXFxccGx1Z2luc1xcXFx2aXRlLXBsdWdpbi1hdXRvLWFkZC1jb21wb25lbnRzXFxcXGluZGV4LmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9wcm9qZWN0cy9zdXJ2ZXkvcGx1Z2lucy92aXRlLXBsdWdpbi1hdXRvLWFkZC1jb21wb25lbnRzL2luZGV4LmpzXCI7aW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcbmltcG9ydCBmcyBmcm9tICdmcyc7XHJcbmltcG9ydCBjaG9raWRhciBmcm9tICdjaG9raWRhcic7XHJcbmltcG9ydCB7IGdsb2JTeW5jIH0gZnJvbSAnZ2xvYic7XHJcblxyXG5jb25zdCByb290UGF0aCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi8uLicpO1xyXG5jb25zdCBjb21wb25lbnRzUGF0aCA9ICdzcmMvY29tcG9uZW50cyc7XHJcblxyXG5jb25zdCBzdHlsZXNDaGFuZ2UgPSAoKSA9PiB7XHJcbiAgY29uc3QgZmlsZXMgPSBnbG9iU3luYyhgJHtjb21wb25lbnRzUGF0aH0vKiovKi5zY3NzYCk7XHJcblxyXG4gIGNvbnN0IGNvbnRlbnQgPSBmaWxlcy5yZWR1Y2UoKGFjYywgdmFsKSA9PiB7XHJcbiAgICBjb25zdCBwYXJzZSA9IHBhdGgucGFyc2UodmFsKTtcclxuICAgIGNvbnN0IGZpbGVOYW1lID0gcGFyc2UubmFtZS5yZXBsYWNlKC9fLywgJycpO1xyXG4gICAgY29uc3QgZGlyTmFtZSA9IHBhcnNlLmRpci5zcGxpdChwYXRoLnNlcCkucG9wKCk7XHJcblxyXG4gICAgaWYgKGZpbGVOYW1lID09PSBkaXJOYW1lKSB7XHJcbiAgICAgIGFjYyArPSBgQGltcG9ydCAnJHtjb21wb25lbnRzUGF0aH0vJHtkaXJOYW1lfS8ke2ZpbGVOYW1lfSc7XFxuYDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYWNjO1xyXG4gIH0sICcnKTtcclxuXHJcbiAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4ocm9vdFBhdGgsICdzcmMvc3R5bGVzL19jb21wb25lbnRzLnNjc3MnKSwgY29udGVudCk7XHJcbn1cclxuXHJcbmNvbnN0IGpzb25DaGFuZ2UgPSAoKSA9PiB7XHJcbiAgY29uc3QgZmlsZXMgPSBnbG9iU3luYyhgJHtjb21wb25lbnRzUGF0aH0vKiovKi5qc29uYCk7XHJcblxyXG4gIGNvbnN0IGNvbnRlbnQgPSBmaWxlcy5yZWR1Y2UoKGFjYywgdmFsKSA9PiB7XHJcbiAgICBjb25zdCBwYXJzZSA9IHBhdGgucGFyc2UodmFsKTtcclxuICAgIGNvbnN0IGZpbGVOYW1lID0gcGFyc2UubmFtZTtcclxuICAgIGNvbnN0IGRpck5hbWUgPSBwYXJzZS5kaXIuc3BsaXQocGF0aC5zZXApLnBvcCgpO1xyXG5cclxuICAgIGlmIChmaWxlTmFtZSA9PT0gZGlyTmFtZSkge1xyXG4gICAgICBjb25zdCBkYXRhID0gZnMucmVhZEZpbGVTeW5jKHBhdGguam9pbihyb290UGF0aCwgdmFsKSwgJ3V0Zi04Jyk7XHJcblxyXG4gICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgIGFjY1twYXJzZS5uYW1lXSA9IEpTT04ucGFyc2UoZGF0YSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYWNjO1xyXG4gIH0sIHt9KTtcclxuXHJcbiAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4ocm9vdFBhdGgsICdzcmMvZGF0YS9jb21wb25lbnRzLmpzb24nKSwgSlNPTi5zdHJpbmdpZnkoY29udGVudCwgbnVsbCwgMikpO1xyXG59XHJcblxyXG5jb25zdCB2aXRlUGx1Z2luQXV0b0FkZENvbXBvbmVudHMgPSAoKSA9PiAoe1xyXG4gIG5hbWU6ICd2aXRlLXBsdWdpbi1hdXRvLWFkZC1jb21wb25lbnRzJyxcclxuICBidWlsZFN0YXJ0OiBhc3luYyAoKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBzdHlsZXNXYXRjaGVyID0gY2hva2lkYXIud2F0Y2goYCR7Y29tcG9uZW50c1BhdGh9LyoqLyouc2Nzc2ApO1xyXG4gICAgICBjb25zdCBqc29uV2F0Y2hlciA9IGNob2tpZGFyLndhdGNoKGAke2NvbXBvbmVudHNQYXRofS8qKi8qLmpzb25gKTtcclxuXHJcbiAgICAgIHN0eWxlc1dhdGNoZXJcclxuICAgICAgICAub24oJ2FkZCcsIHN0eWxlc0NoYW5nZSlcclxuICAgICAgICAub24oJ3VubGluaycsIHN0eWxlc0NoYW5nZSk7XHJcblxyXG4gICAgICBqc29uV2F0Y2hlclxyXG4gICAgICAgIC5vbignYWRkJywganNvbkNoYW5nZSlcclxuICAgICAgICAub24oJ2NoYW5nZScsIGpzb25DaGFuZ2UpXHJcbiAgICAgICAgLm9uKCd1bmxpbmsnLCBqc29uQ2hhbmdlKTtcclxuXHJcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nKSB7XHJcbiAgICAgICAgYXdhaXQgc3R5bGVzV2F0Y2hlci5jbG9zZSgpO1xyXG4gICAgICAgIGF3YWl0IGpzb25XYXRjaGVyLmNsb3NlKCk7XHJcbiAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgIH1cclxuICB9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgdml0ZVBsdWdpbkF1dG9BZGRDb21wb25lbnRzOyIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxccHJvamVjdHNcXFxcc3VydmV5XFxcXHBsdWdpbnNcXFxcdml0ZS1wbHVnaW4taHRtbC1iZWF1dGlmeVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxccHJvamVjdHNcXFxcc3VydmV5XFxcXHBsdWdpbnNcXFxcdml0ZS1wbHVnaW4taHRtbC1iZWF1dGlmeVxcXFxpbmRleC5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovcHJvamVjdHMvc3VydmV5L3BsdWdpbnMvdml0ZS1wbHVnaW4taHRtbC1iZWF1dGlmeS9pbmRleC5qc1wiOy8vIGNvbnN0IGJlYXV0aWZ5ID0gcmVxdWlyZSgnanMtYmVhdXRpZnknKTtcclxuaW1wb3J0IGpzQmVhdXRpZnkgZnJvbSAnanMtYmVhdXRpZnknO1xyXG5cclxuY29uc3Qgdml0ZVBsdWdpbkh0bWxCZWF1dGlmeSA9IChvcHRpb25zID0ge30pID0+ICh7XHJcbiAgbmFtZTogJ3ZpdGUtcGx1Z2luLWh0bWwtYmVhdXRpZnknLFxyXG4gIHRyYW5zZm9ybUluZGV4SHRtbChodG1sKSB7XHJcbiAgICBcclxuICAgIHJldHVybiBqc0JlYXV0aWZ5Lmh0bWxfYmVhdXRpZnkoaHRtbCwgb3B0aW9ucyk7XHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB2aXRlUGx1Z2luSHRtbEJlYXV0aWZ5OyIsICJ7XHJcbiAgXCJpbmRleFwiOiB7XHJcbiAgICBcInRpdGxlXCI6IFwiXHUwNDEzXHUwNDNCXHUwNDMwXHUwNDMyXHUwNDNEXHUwNDMwXHUwNDRGXCJcclxuICB9XHJcbn0iLCAie1xuICBcInN1cnZleVwiOiB7XG4gICAgXCJsaXN0XCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJpZFwiOiAxLFxuICAgICAgICBcInRpdGxlXCI6IFwiTG9yZW0gSXBzdW0gaXMgc2ltcGx5IGR1bW15IHRleHQgb2ZcIixcbiAgICAgICAgXCJzdWJsaXN0XCI6IFtcbiAgICAgICAgICBcIkxvcmVtIElwc3VtIGlzIHNpbXBseSBkdW1teSB0ZXh0XCIsXG4gICAgICAgICAgXCJMb3JlbSBJcHN1bSBpc1wiLFxuICAgICAgICAgIFwiTG9yZW0gSXBzdW0gaXMgc2ltcGx5XCIsXG4gICAgICAgICAgXCJMb3JlbSBJcHN1bVwiLFxuICAgICAgICAgIFwiTG9yZW0gSXBzdW0gaGFzIGJlZW5cIixcbiAgICAgICAgICBcIkxvcmVtIElwc3VtIHN0YW5kYXJkIGR1bW15XCJcbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJpZFwiOiAyLFxuICAgICAgICBcInRpdGxlXCI6IFwiTG9yZW0gSXBzdW0gaGFzIGJlZW4gdGhlIGluZHVzdHJ5J3Mgc3RhbmRhcmQgZHVtbXlcIixcbiAgICAgICAgXCJzdWJsaXN0XCI6IFtcbiAgICAgICAgICBcIkxvcmVtIElwc3VtIGlzIHNpbXBseSBkdW1teSB0ZXh0XCIsXG4gICAgICAgICAgXCJMb3JlbSBJcHN1bSBpc1wiLFxuICAgICAgICAgIFwiTG9yZW0gSXBzdW0gaXMgc2ltcGx5XCJcbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJpZFwiOiAzLFxuICAgICAgICBcInRpdGxlXCI6IFwiTG9yZW0gSXBzdW0gaXMgc2ltcGx5IGR1bW15IHRleHQgb2YgdGhlIHByaW50aW5nXCIsXG4gICAgICAgIFwic3VibGlzdFwiOiBbXG4gICAgICAgICAgXCJMb3JlbSBJcHN1bSBpcyBzaW1wbHkgZHVtbXkgdGV4dFwiLFxuICAgICAgICAgIFwiTG9yZW0gSXBzdW0gaXNcIlxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcImlkXCI6IDQsXG4gICAgICAgIFwidGl0bGVcIjogXCJMb3JlbSBJcHN1bSBoYXMgYmVlbiB0aGUgaW5kdXN0cnkncyBzdGFuZGFyZCBkdW1teSB0ZXh0XCIsXG4gICAgICAgIFwic3VibGlzdFwiOiBbXG4gICAgICAgICAgXCJMb3JlbSBJcHN1bSBoYXMgYmVlblwiLFxuICAgICAgICAgIFwiTG9yZW0gSXBzdW0gc3RhbmRhcmQgZHVtbXlcIlxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9XG59Il0sCiAgIm1hcHBpbmdzIjogIjtB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LGFBQWE7QUFBQSxNQUN2QztBQUFBLE1BQ0EsU0FBUztBQUFBLFFBQ1AsU0FBUyxDQUFDLFlBQVk7QUFDcEIsaUJBQU8sR0FBRyxXQUFXO0FBQUEsUUFDdkI7QUFBQSxRQUNBLE1BQU0sQ0FBQyxRQUFRLFVBQVUsV0FBVztBQUNsQyxtQkFBUyxXQUFXLE1BQU07QUFDMUIsbUJBQVMsV0FBVyxNQUFNO0FBRTFCLGlCQUFPO0FBQUEsWUFDTCxLQUFLLFNBQVM7QUFBQSxZQUNkLEtBQUssU0FBUztBQUFBLFlBQ2QsS0FBSyxTQUFTO0FBQUEsWUFDZCxLQUFLLFNBQVM7QUFBQSxZQUNkLEtBQUssU0FBUztBQUFBLFVBQ2hCLEVBQUUsUUFBUTtBQUFBLFFBQ1o7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCx5Q0FBNkI7QUFBQSxNQUMzQixLQUFLO0FBQUEsUUFDSDtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCx3Q0FBNEI7QUFBQSxJQUM1QixrQ0FBdUI7QUFBQSxNQUNyQixhQUFhO0FBQUEsSUFDZixDQUFDO0FBQUEsRUFDSDtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbInBhdGgiLCAiY2hva2lkYXIiLCAiY2hva2lkYXIiLCAiX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUiLCAicGF0aCIsICJfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSJdCn0K
