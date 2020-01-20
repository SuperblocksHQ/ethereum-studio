// Copyright 2019 Superblocks AB
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

import { AnyAction } from 'redux';
import { outputLogActions, panelsActions } from '../actions';
import { IOutputLogState, Panels } from '../models/state';

const initialState: IOutputLogState = {
    rows: [],
    unreadRows: false
};

export default function consoleReducer(state = initialState, action: AnyAction) {
    switch (action.type) {
        case outputLogActions.ADD_ROWS: {
            return {
                ...state,
                rows: state.rows.concat(action.data).slice(0, 5000), // limit total number or rows,
                unreadRows: true
            };
        }
        case outputLogActions.CLEAR_OUTPUT_LOG: {
            return {
                ...state,
                rows: initialState.rows
            };
        }

        case panelsActions.TOGGLE_PANEL: {
            return {
                ...state,
                unreadRows: action.data === Panels.OutputLog && false
            };
        }

        default:
            return state;
    }
}

