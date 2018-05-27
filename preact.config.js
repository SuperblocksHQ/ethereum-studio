// Copyright 2018 Superblocks AB
//
// This file is part of Superblocks Studio.
//
// Superblocks Studio is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.
//
// Superblocks Studio is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Superblocks Studio.  If not, see <http://www.gnu.org/licenses/>.

import CopyWebpackPlugin from 'copy-webpack-plugin';

export default config => {
        config.plugins.push( new CopyWebpackPlugin([{ context: `${__dirname}/src/assets`, from: `**/*` }]) );
        config.plugins.push( new CopyWebpackPlugin([ { context: `${__dirname}`, from: 'node_modules/monaco-editor/min/vs', to: 'vs', } ]));
        config.plugins.push( new CopyWebpackPlugin([ { context: `${__dirname}/src/components/solc/dist`, from: '**/*', to: 'solc', } ]));
        config.plugins.push( new CopyWebpackPlugin([ { context: `${__dirname}/src/components/evm/dist`, from: '**/*', to: 'evm', } ]));
        config.plugins.push( new CopyWebpackPlugin([ { context: `${__dirname}/src/components/superprovider/dist`, from: 'web3provider.js', to: 'static/js', } ]));
};
