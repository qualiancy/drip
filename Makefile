
TESTS = test/*.js
REPORTER = list
BENCHMARKS = benchmarks/*.js

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		$(TESTS)

benchmark:
	@NODE_ENV=test ./node_modules/.bin/matcha $(BENCHMARKS)

.PHONY: test benchmark