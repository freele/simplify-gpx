import { simplify } from './index.js';
import commandLineArgs from 'command-line-args';
import Promise from 'bluebird';

const cli = commandLineArgs([
  { name: 'files', alias: 'f', type: String, multiple: true },
  { name: 'output-folder', type: String, multiple: false },
]);


const options = cli.parse();
// console.log(options);
// options.files.forEach((file) => {
//   simplify(file, options['output-folder']);
// });

Promise.mapSeries([options.files[0], options.files[1]], (file) => {
  simplify(file, options['output-folder']);
}).then(() => {
  console.log('All done!');
});
