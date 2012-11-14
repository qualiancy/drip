
TESTS = test/*.js
REPORTER = dot
BENCHMARKS = benchmark/*.js

clean:
	@rm -rf lib-cov
	@rm -f coverage.html
	@rm -rf build
	@rm -rf components

docs: clean-docs
	@codex build --in docs
	@codex serve --dir docs/out --mount /drip

clean-docs:
	@rm -rf docs/out

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		$(TESTS)

test-cov: lib-cov
	@DRIP_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html

lib-cov:
	@rm -rf lib-cov
	@jscoverage lib lib-cov

bench:
	@matcha $(BENCHMARKS)

.PHONY: clean-docs docs clean test test-cov lib-cov bench
