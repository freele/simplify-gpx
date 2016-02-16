/* eslint no-console: 0 */
import { gpx } from 'togeojson';
import { jsdom } from 'jsdom';
// import gpxParse from 'gpx-parse';
import fs from 'fs';
import simplifyGeometry from 'simplify-geometry';
import togpx from 'togpx';
import commonPathPrefix from 'common-path-prefix';
import mkdirp from 'mkdirp';
import path from 'path';
import Promise from 'bluebird';

let counter = 0;

const DEFAULT_TOLERANCE = 0.0008;

export function simplify(
  filename,
  outputFolder = `${__dirname}/output`,
  { tolerance, outputFormat } = { tolerance: DEFAULT_TOLERANCE }) {
  // gpxParse.parseGpxFromFile(filename, (error, data) => {
  //   // console.log(JSON.stringify(data, null, 4));
  //
  //
  // });

  const gpxParsed = jsdom(fs.readFileSync(filename, 'utf8'));
  const geoJSON = gpx(gpxParsed);


  geoJSON.features.forEach((geoJsonFeature) => {
    const lengthBefore = geoJsonFeature.properties.coordTimes.length;

    // Tweak points to preserve time during optimisation
    geoJsonFeature.properties.coordTimes.forEach((time, index) => {
      geoJsonFeature.geometry.coordinates[index].push(time);
    });
    // console.log(JSON.stringify(geoJsonFeature, null, 4));
    const coord = geoJsonFeature.geometry.coordinates;

    // console.log('one', JSON.stringify(coord, null, 4));
    // debug optimisation
    const simplifiedCoordinates = simplifyGeometry(coord, tolerance);
    // console.log('two', JSON.stringify(simplifiedCoordinates, null, 4));

    // Return time to separate array
    geoJsonFeature.properties.coordTimes = simplifiedCoordinates.map((arrayWithCoords) => {
      // console.log(arrayWithCoords);
      return arrayWithCoords.pop();
    });
    geoJsonFeature.geometry.coordinates = simplifiedCoordinates;
    const lengthAfter = geoJsonFeature.properties.coordTimes.length;
    const compression = (lengthAfter / lengthBefore).toFixed(3);
    console.log({ lengthBefore, lengthAfter, compression });
  });


  // Create file structure for
  const commonPath = commonPathPrefix([outputFolder, filename]);
  const fileBaseName = path.basename(filename, '.gpx');
  const fileDir = path.dirname(path.join(outputFolder, filename.substring(commonPath.length)));
  const fileNameNoExt = path.join(fileDir, fileBaseName);

  const writeFilePromisified = Promise.promisify(fs.writeFile);
  Promise.promisify(mkdirp);

  mkdirp.sync(fileDir);

  switch (outputFormat) {
    case 'gpx':
      return writeFilePromisified(`${fileNameNoExt}.gpx`, togpx(geoJSON));
    default:
      return writeFilePromisified(`${fileNameNoExt}.json`, JSON.stringify(geoJSON, null, 4)).then(() => {
        console.log('file written ', counter++);
      });
  }
}
