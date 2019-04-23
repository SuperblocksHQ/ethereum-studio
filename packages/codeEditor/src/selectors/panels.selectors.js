// Copyright 2018 Superblocks AB
//
// This file is part of Superblocks Lab.
//
// Superblocks Lab is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.
//
// Superblocks Lab is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Superblocks Lab.  If not, see <http://www.gnu.org/licenses/>.

import { Panels } from "../models/state";

export const panelsSelectors = {
    getShowTransactionsHistory: state => state.panels[Panels.Transactions] && state.panels[Panels.Transactions].open,
    getShowFileSystem:  state => state.panels[Panels.Explorer] && state.panels[Panels.Explorer].open,
    getShowPreview: state => state.panels[Panels.Preview] && state.panels[Panels.Preview].open,
    getShowConsole: state => state.panels[Panels.CompilerOutput] && state.panels[Panels.CompilerOutput].open,
}
