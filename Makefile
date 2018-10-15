.PHONY: test test-only test-agreed test-clinet test-core test-server lint lint-core

NPM_TEST := npm test

test: lint test-only

test-only: test-agreed test-client test-core test-server

test-agreed:
		cd packages/agreed; $(NPM_TEST)

test-client:
		cd packages/client; $(NPM_TEST)

test-core:
		cd packages/core; $(NPM_TEST)

test-server:
		cd packages/server; $(NPM_TEST)

lint: lint-core

lint-core:
		cd packages/core; npm run lint
