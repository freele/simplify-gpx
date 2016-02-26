#/bin/sh

FILES=$(find output/gpx-planet-2013-04-09 -type f)

for f in $FILES
do
  echo "Processing $f"
  ogr2ogr -f "PostgreSQL" PG:"dbname=gis user=docker password=docker host=192.168.99.100 port=25432" "$f" -append
done

