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
import { userActions, authActions, modalActions } from '../../actions';
import { userSelectors, authSelectors } from '../../selectors';
import Dashboard from './Dashboard';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';

const mapStateToProps = (state: any) => ({
    projectList: userSelectors.getProjectList(state),
    isAuthenticated: authSelectors.getIsAuthenticated(state),
    isProjectListLoading: userSelectors.isProjectListLoading(state),
    isLoginInProgress: authSelectors.getIsLoginInProgress(state)
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
    return {
        getProjectList: () => {
            dispatch(userActions.getProjectList());
        },
        githubLoginAction: () => {
            dispatch(authActions.githubLogin());
        },
        showModal: (modalType: string, modalProps: any) => {
            dispatch(modalActions.showModal(modalType, modalProps));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
