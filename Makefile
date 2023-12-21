all: fix test compile

compile:
	npm run compile

lint:
	npm run lint

fix:
	npm run fix

test: .FORCE
	npm run test

.FORCE:
