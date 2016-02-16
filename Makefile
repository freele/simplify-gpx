simplify:
	babel-node cli.js -f $(filter-out $@,$(MAKECMDGOALS))

%: ;

.PHONY: simplify