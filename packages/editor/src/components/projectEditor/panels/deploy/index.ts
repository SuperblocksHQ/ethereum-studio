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
import { DeployPanel } from './DeployPanel';
import { projectSelectors } from '../../../../selectors';
import { Dispatch } from 'redux';
import { contractConfigActions, deployerActions } from '../../../../actions';
import { IProjectItem } from '../../../../models';

const mapStateToProps = (state: any) => ({
    dappFileData: projectSelectors.getDappFileData(state),
    ...state.explorer
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        onConfigureContract: (contractSource: string) => {
            dispatch(contractConfigActions.openContractConfig(contractSource));
        },
        onDeployContract: (file: IProjectItem) => {
            dispatch(deployerActions.deployContract(file));
        },
    };
};

export default connect<any, any, any, any>(mapStateToProps, mapDispatchToProps)(DeployPanel);
