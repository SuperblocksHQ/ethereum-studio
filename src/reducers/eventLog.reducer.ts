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
import { eventLogActions } from '../actions';
import { IEventLogState } from '../models/state';

const initialState: IEventLogState = {
    rows: [],
};

export default function eventLogReducer(state = initialState, action: AnyAction) {
    switch (action.type) {
        case eventLogActions.ADD_EVENT_LOG_ROW: {
            return {
                ...state,
                rows: [...state.rows, action.data]
            };
        }
        case eventLogActions.CLEAR_EVENT_LOG: {
            return {
                ...state,
                rows: initialState.rows
            };
        }

        default:
            return state;
    }
}

