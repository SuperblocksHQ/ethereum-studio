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
import { authActions } from '../../actions'
import { authSelectors } from "../../selectors";
import Login from "./Login";

const mapStateToProps = state => ({
    authActions: {
        getIsAuthenticated: authSelectors.getIsAuthenticated(state)
    }
});

const mapDispatchToProps = (dispatch) => {
    return {
        githubLogin: (anything) => {
            dispatch(authActions.githubLogin(anything))
        },
        loginSuccess: () => {
            dispatch(authActions.loginSuccess())
        },
        logout: () => {
            dispatch(authActions.logout())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
