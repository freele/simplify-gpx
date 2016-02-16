/* eslint no-console: 0 */
import { gpx } from 'togeojson';
import { jsdom } from 'jsdom';
// import gpxParse from 'gpx-parse';
import fs from 'fs';
import simplifyGeometry from 'simplify-geometry';

const DEFAULT_TOLERANCE = 0.0008;

export function simplify(filename, { tolerance } = { tolerance: DEFAULT_TOLERANCE }) {
  // gpxParse.parseGpxFromFile(filename, (error, data) => {
  //   // console.log(JSON.stringify(data, null, 4));
  //
  //
  // });


  const gpxParsed = jsdom(fs.readFileSync(filename, 'utf8'));
  const geoJSON = gpx(gpxParsed);

  const lengthBefore = geoJSON.features[0].properties.coordTimes.length;

  // Tweak points to preserve time during optimisation
  geoJSON.features[0].properties.coordTimes.forEach((time, index) => {
    geoJSON.features[0].geometry.coordinates[index].push(time);
  });

  // console.log(JSON.stringify(geoJSON.features[0], null, 4));
  const coord = geoJSON.features[0].geometry.coordinates;

  // console.log('one', JSON.stringify(coord, null, 4));
  // debug optimisation
  const simplifiedCoordinates = simplifyGeometry(coord, tolerance);
  // console.log('two', JSON.stringify(simplifiedCoordinates, null, 4));

  // Return time to separate array
  geoJSON.features[0].properties.coordTimes = simplifiedCoordinates.map((arrayWithCoords) => {
    // console.log(arrayWithCoords);
    return arrayWithCoords.pop();
  });
  geoJSON.features[0].geometry.coordinates = simplifiedCoordinates;

  const lengthAfter = geoJSON.features[0].properties.coordTimes.length;
  const compression = (lengthAfter / lengthBefore).toFixed(3);
  console.log({ lengthBefore, lengthAfter, compression });
}