import { simplify } from './index.js';
import commandLineArgs from 'command-line-args';

const cli = commandLineArgs([
  { name: 'files', alias: 'f', type: String, multiple: true },
  { name: 'output-folder', type: String, multiple: false },
]);


const options = cli.parse();
// console.log(options);
// options.files.forEach((file) => {
//   simplify(file, options['output-folder']);
// });

// Promise.mapSeries(options.files, (file) => {
//   simplify(file, options['output-folder']);
// }).then(() => {
//   console.log('All done!');
// });

const Promises = options.files.map((file) => {
  return () => {
    return simplify(file, options['output-folder']);
  };
});

const length = Promises.length;
function seqPromises(i) {
  if (i < length) {
    Promises[i]().then(() => {
      seqPromises(i + 1);
    });
  } else {
    console.log('All done!');
  }
}
seqPromises(0);
