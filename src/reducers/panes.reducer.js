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

import { panesActions, explorerActions } from '../actions'
import { replaceInArray } from './utils';

export const initialState = {
    panes: []
};

export default function panesReducer(state = initialState, action) {
    switch (action.type) {
        case panesActions.ADD_PANE:
            return {
                ...state,
                panes: [ { ...action.data } ].concat(state.panes)
            };
        case panesActions.REMOVE_PANE:
            return {
                ...state,
                panes: state.panes.filter(p => p.id !== action.data.id)
            };
        case panesActions.SET_ACTIVE_PANE: {
            const deactivatedPanes = replaceInArray(state.panes, p => p.active, p => ({ ...p, active: false }))
            return {
                ...state,
                panes: replaceInArray(deactivatedPanes, p => p.id === action.data.id, p => ({ ...p, active: true }))
            };
        }
        case explorerActions.RENAME_FILE: {
            return {
                ...state,
                panes: replaceInArray(state.panes, p => p.fileId === action.data.id, p => ({ ...p, name: action.data.name }))
            };
        }
        default:
            return state;
    }
}
