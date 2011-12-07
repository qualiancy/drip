
TESTS = test/*.js
REPORTER = dot
BENCHMARKS = benchmarks/*.js

all:
	@node support/compile

clean:
	@rm -f dist/drip.js dist/drip.min.js

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		$(TESTS)

benchmark:
	@NODE_ENV=test ./node_modules/.bin/matcha $(BENCHMARKS)

.PHONY: all clean test benchmark