# Copyright 2018 Superblocks AB
#
# This file is part of Superblocks Studio.
#
# Superblocks Studio is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation version 3 of the License.
#
# Superblocks Studio is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with Superblocks Studio.  If not, see <http://www.gnu.org/licenses/>.

PREACT = ./node_modules/preact-cli/lib/index.js

ifndef PORT
PORT=8181
endif

ifndef ORIGIN_DEV
ORIGIN_DEV=http://localhost:$(PORT)
endif

ifndef ORIGIN_DIST
ORIGIN_DIST=https://studio.superblocks.com
endif

watch: build_external_dev
	PORT=$(PORT) $(PREACT) watch
build: build_external_dist
	$(PREACT) build --no-prerender --service-worker=false --production --clean
build_external_dev:
	mkdir -p ./src/components/superprovider/dist
	sed 's#ORIGIN#"$(ORIGIN_DEV)"#g' ./src/components/superprovider/web3provider.js | ./node_modules/babel-cli/bin/babel.js --presets env >./src/components/superprovider/dist/web3provider.js
build_external_dist:
	mkdir -p ./src/components/superprovider/dist
	sed 's#ORIGIN#"$(ORIGIN_DIST)"#g' ./src/components/superprovider/web3provider.js | ./node_modules/babel-cli/bin/babel.js --presets env >./src/components/superprovider/dist/web3provider.js
dist: build
	rm -rf dist
	mkdir dist
	cp -r ./build/static ./dist
	cp ./build/*.js ./dist
	cp ./build/*.css ./dist
	cp ./build/index.html ./dist
	cp ./build/favicon.ico ./dist
	cp ./build/manifest.json ./dist
	cp -r ./build/vs ./dist
	cp -r ./build/solc ./dist
	cp -r ./build/evm ./dist
	rm ./dist/sw.js
	@echo "Done."
	@echo "You did bump the version (./bump_version.sh) prio, right?"
clean:
	rm -rf build
	rm -rf dist
npm:
	yarn install

.PHONY: npm watch build dist clean build_external
