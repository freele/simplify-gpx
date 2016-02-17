import { simplify } from './index.js';
import commandLineArgs from 'command-line-args';
import commonPathPrefix from 'common-path-prefix';
import mkdirp from 'mkdirp';
import path from 'path';
import Promise from 'bluebird';
import fs from 'fs';

const recursive = Promise.promisify(require('recursive-readdir'));



const MAX_SIZE_B = 50 * 1000000;

let counter = 0;

const fsAccess = Promise.promisify(fs.access);

const cli = commandLineArgs([
  { name: 'input-dir', type: String, multiple: false },
  { name: 'files', alias: 'f', type: String, multiple: true },
  { name: 'output-dir', type: String, multiple: false },
  { name: 'no-overwrite', type: Boolean, multiple: false },
]);

const options = cli.parse();

function getResultFilename({ outputDir = `${__dirname}/../output`, inputFilename, outputFormat = 'json' }) {
  // Create file structure for
  const commonPath = commonPathPrefix([outputDir, inputFilename]);
  const fileBaseName = path.basename(inputFilename, '.gpx');
  const fileDir = path.dirname(path.join(outputDir, inputFilename.substring(commonPath.length)));
  const fileNameNoExt = path.join(fileDir, fileBaseName);

  mkdirp.sync(fileDir);

  return `${fileNameNoExt}.${outputFormat}`;
}

// Read files either from input folder, or from files list
Promise.resolve((() => {
  if (options['input-dir']) {
    return recursive(options['input-dir'])
    .then((files) => {
      return files.filter((file) => {
        if (path.extname(file) !== '.gpx') {
          return false;
        }

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
})()).mapSeries((inputFilename) => {
  const outputOps = { inputFilename };
  if (options['output-dir']) {
    outputOps.outputDir = options['output-dir'];
  }

  const outputFilename = getResultFilename(outputOps);
  if (options['no-overwrite']) {
    return fsAccess(outputFilename).then(() => {
      // console.log('File exists, no-overwrite: ', outputFilename);
      return;
    }).catch((err) => {
      // No access => file doesn't exist, continue
      // console.log('Err', err);
      // console.log('No file, continue', outputFilename);
      return simplify({ inputFilename, outputFilename });
    });
  }
  return simplify({ inputFilename, outputFilename });
}).then(() => {
  console.log('All done!');
});

