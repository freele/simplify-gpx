simplify:
	babel-node src/cli.js --input-dir $(filter-out $@,$(MAKECMDGOALS))

simplify-node:
	# node lib/cli.js -f $(filter-out $@,$(MAKECMDGOALS))
	# babel-node cli.js --output sdf -f $(find /Users/kremenets/Dev/Strelka/Mathrioshka/gpx-planet-2013-04-09/identifiable/000/104/ -type f)

%: ;

.PHONY: simplify simplify-node