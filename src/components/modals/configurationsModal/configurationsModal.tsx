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
import classNames from 'classnames';
import style from './style.less';
import { ModalHeader, TextInput } from '../../common';
import { IRunConfiguration, IPluginData } from '../../../models/state';
import SplitterLayout from 'react-splitter-layout';
import { SuperblocksConfig } from '../../../superblocksConfig';
import { IconPlus, IconDown, IconAdd } from '../../icons';

interface IProps {
    pluginsState: IPluginData[];
    runConfigurations: IRunConfiguration[];
    hideModal(): void;
    selectRunConfiguration(id: string): void;
    save(configId: string, name: string): void;
    addRunConfiguration(): void;
    removeRunConfiguration(id: string): void;
}

interface IState {
    selectedConfig?: IRunConfiguration;
    currentConfigName: Nullable<string>;
}

export class ConfigurationsModal extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        const selectedConfig = this.props.runConfigurations.find(r => r.selected);
        this.state = {
            selectedConfig,
            currentConfigName: selectedConfig ? selectedConfig.name : null
        };
    }

    componentDidUpdate() {
        const newSelectedConfig = this.props.runConfigurations.find(r => r.selected);
        if (!newSelectedConfig) {
            this.setState({ selectedConfig: undefined });
            return;
        }

        if (!this.state.selectedConfig || this.state.selectedConfig.name !== newSelectedConfig.name) {
            this.setState((state) => ({ ...state, currentConfigName: newSelectedConfig.name, selectedConfig: newSelectedConfig }));
        }

        if (this.state.selectedConfig && this.state.selectedConfig.id !== newSelectedConfig.id) {
            this.setState((state) => ({ ...state, selectedConfig: newSelectedConfig }));
        }
    }

    onConfigNameChange = (e: any) => {
        this.setState({ currentConfigName: e.target.value });
    }

    onSave = () => {
        if (!this.state.selectedConfig) {
            return;
        }

        this.props.save(this.state.selectedConfig.id, this.state.currentConfigName || '');
    }

    render() {
        const { selectRunConfiguration, hideModal, pluginsState, addRunConfiguration, removeRunConfiguration } = this.props;
        const { selectedConfig, currentConfigName } = this.state;

        const configsList = this.props.runConfigurations.map(c => (
            <div key={c.id} className={classNames(style.configItem, { [style.selected]: c.selected })} onClick={() => selectRunConfiguration(c.id)}>{c.name}</div>
        ));

        let selectedConfigJSX = <div></div>;
        if (selectedConfig) {
            const pluginName = selectedConfig.plugin;
            const pluginData = pluginsState.find(p => p.name === pluginName);

            if (pluginData) {
                selectedConfigJSX =
                    <React.Fragment>
                        <div className={style.nameContainer}>
                            <div className={style.label}>Name:</div>
                            <TextInput value={currentConfigName} onChange={this.onConfigNameChange} />
                        </div>
                        <div className={style.pluginContainer}>
                            <SuperblocksConfig data={pluginData.data} />
                        </div>
                        <div className={style.buttonsContainer}>
                            <button onClick={hideModal} className='btn2 noBg mr-2'>Cancel</button>
                            <button onClick={this.onSave} className='btn2'>Save</button>
                        </div>
                    </React.Fragment>;
            }
        }

        return (
            <div className={classNames(style.configurationsModal, ['modal'])}>
                <ModalHeader title='Run Configurations' onCloseClick={this.props.hideModal} />
                <div className={style.container}>
                    <SplitterLayout
                        primaryIndex={1}
                        secondaryMinSize={50}
                        primaryMinSize={200}
                        secondaryInitialSize={130}>
                        <div className={style.column}>
                            <div>
                                <button className='btnNoBg' onClick={addRunConfiguration}><IconAdd /></button>
                                {selectedConfig  &&
                                <button className='btnNoBg' onClick={() => removeRunConfiguration(selectedConfig.id)}><IconDown /></button>
                                }
                            </div>
                            <div className={style.configGroup}>Superblocks</div>
                            {configsList}
                        </div>
                        <div className={style.column}>
                            {selectedConfigJSX}
                        </div>
                    </SplitterLayout>
                </div>
            </div>
        );
    }
}
