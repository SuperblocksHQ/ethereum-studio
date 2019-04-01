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

import { ConfigurationsModal as ConfigurationsModalImpl } from './configurationsModal';
import { projectSelectors } from '../../../selectors';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { projectsActions } from '../../../actions';

const mapStateToProps = (state: any) => ({
    // selectedConfig: state.projects.selectedRunConfig,
    pluginsState: projectSelectors.getPluginsState(state),
    runConfigurations: projectSelectors.getRunConfigs(state)
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
    return {
        selectRunConfiguration(id: string) {
            dispatch(projectsActions.showRunConfiguration(id));
        },
        save(configId: string, name: string) {
            dispatch(projectsActions.saveRunConfiguration(configId, name));
        }
    };
};

export const ConfigurationsModal = connect(mapStateToProps, mapDispatchToProps)(ConfigurationsModalImpl);

