/* eslint no-console: 0 */
import { gpx } from 'togeojson';
import { jsdom } from 'jsdom';
// import gpxParse from 'gpx-parse';
import fs from 'fs';
import simplifyGeometry from 'simplify-geometry';
import togpx from 'togpx';
import Promise from 'bluebird';

let counter = 0;

const DEFAULT_TOLERANCE = 0.0008;

export function simplify(
  { inputFilename,
   outputFilename,
   tolerance = DEFAULT_TOLERANCE,
   outputFormat }) {
  // gpxParse.parseGpxFromFile(filename, (error, data) => {
  //   // console.log(JSON.stringify(data, null, 4));
  //
  //
  // });

  let gpxParsed = jsdom(fs.readFileSync(inputFilename, 'utf8'));
  const geoJSON = gpx(gpxParsed);
  gpxParsed = {};

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

  const writeFilePromisified = Promise.promisify(fs.writeFile);


  switch (outputFormat) {
    case 'gpx':
      return writeFilePromisified(outputFilename, togpx(geoJSON));
    default:
      return writeFilePromisified(outputFilename, JSON.stringify(geoJSON, null, 4)).then(() => {
        console.log('file written ', outputFilename, counter++);
      });
  }
}

