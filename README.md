# simplify-gpx 
Transformts gpx files to optimized gpx or GeoJSON  
This module uses [simplify-geometry](https://github.com/seabre/simplify-geometry) module which simplifies geometry using the Ramer–Douglas–Peucker algorithm. 
  
Installing for local use (not published to npm yet)  
```bash
npm install
npm run compile
```
Examples (as a command line tool)
```bash
node lib/cli.js -f $(find {dir-with-files} type -f) --output-dir {output-dir}
```

