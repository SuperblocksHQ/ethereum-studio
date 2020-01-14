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

import { switchMap } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { appActions, panelsActions } from '../../actions';
import { of } from 'rxjs';
import { Panels, PanelSides } from '../../models/state';

export const notifyAppStart: Epic = (action$: any) => action$.pipe(
    ofType(appActions.APP_START),
    switchMap(() => of(
        appActions.notifyAppStarted(),
        panelsActions.initPanels([
            { panel: Panels.Explorer, side: PanelSides.Left },
            { panel: Panels.Interact, side: PanelSides.Left },
            { panel: Panels.Configure, side: PanelSides.Left },
            { panel: Panels.Transactions, side: PanelSides.Right },
            { panel: Panels.Preview, side: PanelSides.Right },
            { panel: Panels.OutputLog, side: PanelSides.Bottom },
            { panel: Panels.MessageLog, side: PanelSides.Bottom },
        ])
    ))
);
