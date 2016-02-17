simplify:
	babel-node --max-old-space-size=2048 src/cli.js --no-overwrite --input-dir $(filter-out $@,$(MAKECMDGOALS))

simplify-o:
	babel-node --max-old-space-size=2048 src/cli.js --input-dir $(filter-out $@,$(MAKECMDGOALS))

simplify-node:
	node --max-old-space-size=6048 lib/cli.js --no-overwrite --input-dir $(filter-out $@,$(MAKECMDGOALS))
	# babel-node cli.js --output sdf -f $(find /Users/kremenets/Dev/Strelka/Mathrioshka/gpx-planet-2013-04-09/identifiable/000/104/ -type f)

%: ;

.PHONY: simplify simplify-node