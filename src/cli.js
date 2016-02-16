import { simplify } from './index.js';
import commandLineArgs from 'command-line-args';
import Promise from 'bluebird';
import fs from 'fs';

const recursive = Promise.promisify(require('recursive-readdir'));

const MAX_SIZE_B = 50 * 1000000;

let counter = 0;

// const fsReaddir = Promise.promisify(fs.readdir);

const cli = commandLineArgs([
  { name: 'input-dir', type: String, multiple: false },
  { name: 'files', alias: 'f', type: String, multiple: true },
  { name: 'output-dir', type: String, multiple: false },
]);

const options = cli.parse();

// Read files either from input folder, or from files list
Promise.resolve((() => {
  if (options['input-dir']) {
    return recursive(options['input-dir'])
    .then((files) => {
      return files.filter((file) => {
        const stats = fs.statSync(file);
        if (stats.size < MAX_SIZE_B) {
          return file;
        }
        console.log('Oversized files: ', ++counter);
        return false;
      });
    });
  }
  return options.files;
})()).mapSeries((file) => {
  console.log('file', file);
  return simplify(file, options['output-dir']);
}).then(() => {
  console.log('All done!');
});
