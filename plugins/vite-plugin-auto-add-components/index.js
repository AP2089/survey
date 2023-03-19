import path from 'path';
import fs from 'fs';
import chokidar from 'chokidar';
import { globSync } from 'glob';

const rootPath = path.join(__dirname, '../..');
const componentsPath = 'src/components';

const stylesChange = () => {
  const files = globSync(`${componentsPath}/**/*.scss`);

  const content = files.reduce((acc, val) => {
    const parse = path.parse(val);
    const fileName = parse.name.replace(/_/, '');
    const dirName = parse.dir.split(path.sep).pop();

    if (fileName === dirName) {
      acc += `@import '${componentsPath}/${dirName}/${fileName}';\n`;
    }

    return acc;
  }, '');

  fs.writeFileSync(path.join(rootPath, 'src/styles/_components.scss'), content);
}

const jsonChange = () => {
  const files = globSync(`${componentsPath}/**/*.json`);

  const content = files.reduce((acc, val) => {
    const parse = path.parse(val);
    const fileName = parse.name;
    const dirName = parse.dir.split(path.sep).pop();

    if (fileName === dirName) {
      const data = fs.readFileSync(path.join(rootPath, val), 'utf-8');

      if (data) {
        acc[parse.name] = JSON.parse(data);
      }
    }

    return acc;
  }, {});

  fs.writeFileSync(path.join(rootPath, 'src/data/components.json'), JSON.stringify(content, null, 2));
}

const vitePluginAutoAddComponents = () => ({
  name: 'vite-plugin-auto-add-components',
  buildStart: async () => {
    try {
      const stylesWatcher = chokidar.watch(`${componentsPath}/**/*.scss`);
      const jsonWatcher = chokidar.watch(`${componentsPath}/**/*.json`);

      stylesWatcher
        .on('add', stylesChange)
        .on('unlink', stylesChange);

      jsonWatcher
        .on('add', jsonChange)
        .on('change', jsonChange)
        .on('unlink', jsonChange);

      if (process.env.NODE_ENV === 'production') {
        await stylesWatcher.close();
        await jsonWatcher.close();
      }
    } catch (error) {
      console.log(error);
    }
  }
});

export default vitePluginAutoAddComponents;