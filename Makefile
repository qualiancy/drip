
BENCHMARKS = benchmarks/*.js

benchmarks:
	@NODE_ENV=test ./node_modules/.bin/matcha $(BENCHMARKS)

.PHONY:  benchmarks