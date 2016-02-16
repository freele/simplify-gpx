simplify:
	babel-node cli.js -f $(filter-out $@,$(MAKECMDGOALS)) --output-folder $(PWD)/output
	# babel-node cli.js --output sdf -f $(find /Users/kremenets/Dev/Strelka/Mathrioshka/gpx-planet-2013-04-09/identifiable/000/104/ -type f)

%: ;

.PHONY: simplify