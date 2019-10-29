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

import { connect } from 'react-redux';
import { AnyAction, Dispatch } from 'redux';
import { appActions, messageLogActions } from '../../actions';
import { getShowAnalyticsTrackingDialog } from '../../selectors/settings';
import { accountsConfigSelectors } from '../../selectors';
import App from './App';
import { LogLevel } from '../../models';

const mapStateToProps = (state: any) => ({
    showTrackingAnalyticsDialog: getShowAnalyticsTrackingDialog(state),
    knownWalletSeed: accountsConfigSelectors.getKnownWalletSeed(state),
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
    return {
        notifyAppStart: (isEmbeddedMode: boolean) => {
            dispatch(appActions.notifyAppStart(isEmbeddedMode));
        },
        addMessageLogRow: (channel: LogLevel, msg: string) => {
            dispatch(messageLogActions.addMessageLogRow(channel, msg));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
