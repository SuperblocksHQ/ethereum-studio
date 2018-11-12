 # Copyright 2018 Superblocks AB
#
# This file is part of Superblocks Lab.
#
# Superblocks Lab is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation version 3 of the License.
#
# Superblocks Lab is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with Superblocks Lab.  If not, see <http://www.gnu.org/licenses/>.

ifndef PORT
PORT=3000
endif

ifndef ORIGIN_DEV
ORIGIN_DEV=http://localhost:$(PORT)
endif

ifndef ORIGIN_DIST
ORIGIN_DIST=https://studio.superblocks.com
endif

watch: build_external_dev
	yarn start
build: build_external_dist
	yarn build
build_external_dev:
	mkdir -p ./src/components/superprovider/dist
	sed 's#ORIGIN#"$(ORIGIN_DEV)"#g' ./src/components/superprovider/web3provider.js | ./node_modules/babel-cli/bin/babel.js --presets env >./src/components/superprovider/dist/web3provider.js
build_external_dist:
	mkdir -p ./src/components/superprovider/dist
	sed 's#ORIGIN#"$(ORIGIN_DIST)"#g' ./src/components/superprovider/web3provider.js | ./node_modules/babel-cli/bin/babel.js --presets env >./src/components/superprovider/dist/web3provider.js
dist: clean build
	@echo "You did bump the version (./bump_version.sh) prio, right?"
clean:
	rm -rf build
npm:
	yarn

.PHONY: npm watch build dist clean build_external
