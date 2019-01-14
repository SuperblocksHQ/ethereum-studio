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
import TopBar from './Topbar';
import { ipfsSelectors } from '../../selectors';
import { projectSelectors } from '../../selectors';
import { ipfsActions } from '../../actions';

const mapStateToProps = state => ({
    selectedProjectName: projectSelectors.getSelectedProjectName(state),
    ipfsActions: {
        showUploadDialog: ipfsSelectors.getShowUploadDialog(state),
        showUploadButton: ipfsSelectors.getShowUploadButton(state),
        showForkButton: ipfsSelectors.getShowForkButton(state),
    }
});

function mapDispatchToProps(dispatch) {
    return {
        hideUploadDialog: () => {
            dispatch(ipfsActions.hideUploadDialog())
        },
        forkProject: () => {
            dispatch(ipfsActions.forkProject())
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);
