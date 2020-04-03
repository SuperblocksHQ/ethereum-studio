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

import { Dispatch } from 'redux';
import { IProjectItem } from '../../../models';
import { connect } from 'react-redux';
import { Panes } from './panes';
import { panesActions, explorerActions, contractConfigActions, panelsActions } from '../../../actions';
import { deployerActions } from '../../../actions/deployer.actions';
import { Panels } from '../../../models/state';

const mapStateToProps = (state: any) => ({
    tree: state.explorer.tree,
    panes: state.panes.items,
    panels: state.panels,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        onSaveFile(fileId: string, code: string) {
            dispatch(panesActions.saveFile(fileId, code));
        },
        onOpenFile(fileItem: IProjectItem) {
            dispatch(panesActions.openFile(fileItem));
        },
        onClosePane(fileId: string) {
            dispatch(panesActions.closePane(fileId));
        },
        onCloseAllOtherPanes(fileId: string) {
            dispatch(panesActions.closeAllOtherPanes(fileId));
        },
        onCloseAllPanes() {
            dispatch(panesActions.closeAllPanes());
        },
        onUnsavedChange(fileId: string, hasUnsavedChanges: boolean, code: any) {
            dispatch(panesActions.setUnsavedChanges(fileId, hasUnsavedChanges, code));
        },
        onMovePane(fromIndex: number, toIndex: number) {
            dispatch(panesActions.movePane(fromIndex, toIndex));
        },

        // Actions
        togglePanel(panel: Panels) {
            dispatch(panelsActions.togglePanel(panel));
        },

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Panes);
