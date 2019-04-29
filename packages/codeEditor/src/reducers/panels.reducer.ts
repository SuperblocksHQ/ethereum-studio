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

import { panelsActions, IPanelSideData } from '../actions';
import { AnyAction } from 'redux';
import { IPanelsState, IPanelData, Panels } from '../models/state';

export const initialState: IPanelsState = { };

function forEveryInObj(obj: any, modifier: (panel: Panels, panelData: IPanelData) => IPanelData) {
    return Object.keys(obj).reduce((acc: any, curr: string) => {
        acc[curr] = modifier(<Panels>curr, obj[curr]);
        return acc;
    }, { });
}

export default function panelsReducer(state = initialState, action: AnyAction) {
    switch (action.type) {
        case panelsActions.INIT_PANELS:
            return action.data.reduce((acc: any, curr: IPanelSideData) => {
                acc[curr.panel] = <IPanelData>{ open: false, side: curr.side  };
                return acc;
            }, {});

        case panelsActions.CLOSE_ALL_PANELS:
            return forEveryInObj(state, (panel: Panels, panelData: IPanelData) => ({ ...panelData, open: false }));

        case panelsActions.TOGGLE_PANEL: {
            const panelData = state[action.data];
            if (!panelData) {
                return state;
            }
            // toggle the panel and closes all other panels on a same side
            return forEveryInObj(state, (panel: Panels, pd: IPanelData) => {
                if (pd.side === panelData.side) {
                    return {
                        ...pd,
                        open: panel === action.data ? !panelData.open : false
                    };
                }
                return pd;
            });
        }

        case panelsActions.CLOSE_PANEL: {
            const panelData = state[action.data];
            if (!panelData) {
                return state;
            }
            return { ...state, [action.data]: { ...panelData, open: false } };
        }

        case panelsActions.OPEN_PANEL: {
            const panelData = state[action.data];
            if (!panelData) {
                return state;
            }
            // toggle the panel and closes all other panels on a same side
            return forEveryInObj(state, (panel: Panels, pd: IPanelData) => {
                if (pd.side === panelData.side) {
                    return {
                        ...pd,
                        open: panel === action.data
                    };
                }
                return pd;
            });
        }
        default:
            return state;
    }
}
