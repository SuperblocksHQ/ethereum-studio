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
import { projectSelectors } from '../../selectors';

class NetworkAccountSelector extends Component {
    render() {
        const { project, selectedEnvironment, onNetworkSelected, environments, onAccountSelected, accounts, selectedAccount } = this.props;
        return (
            <OnlyIf test={Boolean(project.id)}>
                <div className={style.container}>
                    <div className={style.actionWrapper}>
                        <NetworkSelector
                            selectedNetwork={selectedEnvironment}
                            networks={environments}
                            onNetworkSelected={onNetworkSelected} />
                    </div>
                    <div className={style.actionWrapper}>
                        <AccountSelector
                            accounts={accounts}
                            selectedAccount={selectedAccount}
                            onAccountSelected={onAccountSelected} />
                    </div>
                </div>
            </OnlyIf>
        );
    }
}

const mapStateToProps = state => ({
    project: projectSelectors.getProject(state),
    selectedEnvironment: projectSelectors.getSelectedEnvironment(state),
    environments: projectSelectors.getEnvironments(state),
    selectedAccount: projectSelectors.getSelectedAccount(state),
    accounts: state.projects.accounts
});

const mapDispatchToProps = dispatch => {
    return {
        onNetworkSelected(environment) {
            dispatch(projectsActions.setEnvironment(environment));
        },
        onAccountSelected(name) {
            dispatch(projectsActions.selectAccount(name))
        },
        onAccountEdit(name) {

        },
        onAccountDelete(name) {

        },
        onAccountCreate() {

        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NetworkAccountSelector);
