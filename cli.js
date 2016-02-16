import { simplify } from './index.js';
import commandLineArgs from 'command-line-args';

const cli = commandLineArgs([
  { name: 'files', alias: 'f', type: String, multiple: true },
]);

const options = cli.parse();

options.files.forEach((file) => {
  simplify(file);
});

