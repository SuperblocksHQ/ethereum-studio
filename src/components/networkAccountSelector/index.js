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

import React, { Component } from 'react';
import { connect } from 'react-redux';

import style from './style.less';
import OnlyIf from '../onlyIf';
import { NetworkSelector } from './networkSelector';
import { AccountSelector } from './accountSelector';
import { projectsActions } from '../../actions';

class NetworkAccountSelector extends Component {
    render() {
        const { selectedProject, selectedAccount, onNetworkSelected, onAccountSelected } = this.props;
        return (
            <OnlyIf test={Boolean(selectedProject.id)}>
                <div className={style.container}>
                    <div className={style.actionWrapper}>
                        <NetworkSelector 
                            selectedNetwork={selectedProject.selectedEnvironment}
                            networks={selectedProject.environments}
                            onNetworkSelected={onNetworkSelected} />
                    </div>

                    <div className={style.actionWrapper}>
                        <AccountSelector {...this.props} onAccountSelected={onAccountSelected} selectedEnvironment={selectedProject.selectedEnvironment.name} />
                    </div>
                </div>
            </OnlyIf>
        );
    }
}

const mapStateToProps = state => ({
    selectedProject: state.projects.selectedProject,
    selectedAccount: state.projects.selectedAccount
});

const mapDispatchToProps = dispatch => {
    return {
        onNetworkSelected(environment) {
            dispatch(projectsActions.setEnvironment(environment));
        },
        onAccountSelected: (name, balance, address) => {
            dispatch(projectsActions.updateSelectAccount(name, balance, address))
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NetworkAccountSelector);
