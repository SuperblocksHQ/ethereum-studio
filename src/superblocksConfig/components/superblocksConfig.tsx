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

import React from 'react';
import style from './style.less';
import { Select } from '../../components/common';
import { InputRow } from './inputRow';
import { ISuperblocksRunConfigurationData, INetwork, IEnvironment, IAccount } from '../models';
import { IconDots } from '../../components/icons';
import classNames from 'classnames';
import { NetworksSelect } from './networksSelect';

interface IProps {
    data: ISuperblocksRunConfigurationData;
    setNetwork(network: INetwork): void;
    setAccount(name: string): void;
    setEnvironment(name: string): void;
}

enum Tabs {
    Configuration,
    Deployment
}

interface IState {
    currentTab: Tabs;
}

export class SuperblocksConfig extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            currentTab: Tabs.Configuration
        };
    }

    selectTab(tab: Tabs) {
        this.setState({ currentTab: tab });
    }

    getTabStyle(tab: Tabs) {
        return classNames(style.tab, { [style.selected]: this.state.currentTab === tab });
    }

    render() {
        const { currentTab } = this.state;
        const { data, setNetwork, setEnvironment, setAccount } = this.props;

        // todo: think!
        const environment = data.environments.find(e => e.name === data.environmentName) as IEnvironment;
        const allEnvironments = data.environments.map(e => e.name);
        const account = environment.accounts.find(a => !!a.default) as IAccount;
        const allAccounts = environment.accounts.map(a => a.name);

        return (
            <div className={style.container}>
                <InputRow labelText='Environment'>
                    <Select value={environment.name} options={allEnvironments} onChange={a => setEnvironment(a)} />
                </InputRow>

                <div className={style.flex}>
                    <div className={this.getTabStyle(Tabs.Configuration)} onClick={() => this.selectTab(Tabs.Configuration)}>Configuration</div>
                    <div className={this.getTabStyle(Tabs.Deployment)} onClick={() => this.selectTab(Tabs.Deployment)}>Deployment</div>
                </div>

                {currentTab === Tabs.Configuration &&
                <div className={style.configurationArea}>
                    <InputRow labelText='Network'>
                        <div className={style.flex}>
                            <NetworksSelect currentNetwork={environment.network} networks={data.networks} onChange={e => setNetwork(e)} />
                            <button className='btnNoBg'><IconDots /></button>
                        </div>
                    </InputRow>

                    <InputRow labelText='Account'>
                        <div className={style.flex}>
                            <Select value={account.name} options={allAccounts} onChange={a => setAccount(a)} />
                            <button className='btnNoBg'><IconDots /></button>
                        </div>
                    </InputRow>
                </div>
                }

                {currentTab === Tabs.Deployment &&
                <div className={style.deploymentArea}>
                    do deploy
                </div>
                }


            </div>
        );
    }
}
