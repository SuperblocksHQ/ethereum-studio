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
import { panesActions, explorerActions } from '../../../actions';
import { deployerActions } from '../../../actions/deployer.actions';

const mapStateToProps = (state: any) => ({
    panes: state.panes.items,
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
        onUnsavedChange(fileId: string, hasUnsavedChanges: boolean) {
            dispatch(panesActions.setUnsavedChanges(fileId, hasUnsavedChanges));
        },
        onMovePane(fromIndex: number, toIndex: number) {
            dispatch(panesActions.movePane(fromIndex, toIndex));
        },

        // contract related
        onConfigureContract: (file: IProjectItem) => {
            dispatch(explorerActions.configureContract(file));
        },
        onCompileContract: (file: IProjectItem) => {
            dispatch(explorerActions.compileContract(file));
        },
        onDeployContract: (file: IProjectItem) => {
            dispatch(deployerActions.deployContract(file));
        },
        onInteractContract: (file: IProjectItem) => {
            dispatch(explorerActions.interactContract(file));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Panes);
