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

import { connect } from 'react-redux';
import { explorerActions, panesActions } from '../../../actions';
import { Explorer } from './explorer';
import { Dispatch } from 'redux';
import { ProjectItemTypes, IProjectItem } from '../../../models';

const mapStateToProps = (state: any) => ({
    ...state.explorer
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        onToggleTreeItem: (id: string) => {
            dispatch(explorerActions.toggleTreeItem(id));
        },
        onOpenFile: (file: IProjectItem) => {
            dispatch(panesActions.openFile(file));
        },
        onCreateItem: (parentId: string, type: ProjectItemTypes, name: string) => {
            dispatch(explorerActions.createItem(parentId, type, name));
        },
        onImportFile: (parentId: string) => {
            dispatch(explorerActions.importFile(parentId));
        },
        onRenameItem: (id: string, name: string) => {
            dispatch(explorerActions.renameItem(id, name)); // TODO: check if correct
        },
        onDeleteItem: (id: string) => {
            dispatch(explorerActions.deleteItem(id));
        },

        // smart contract specific
        onConfigureContract: (file: IProjectItem) => {
            dispatch(explorerActions.configureContract(file));
        },
        onCompileContract: (file: IProjectItem) => {
            dispatch(explorerActions.compileContract(file));
        },
        onDeployContract: (file: IProjectItem) => {
            dispatch(explorerActions.deployContract(file));
        },
        onInteractContract: (file: IProjectItem) => {
            dispatch(explorerActions.interactContract(file));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Explorer);
