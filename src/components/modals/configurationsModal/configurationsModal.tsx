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
import { IRunConfiguration } from '../../../models/state';
import SplitterLayout from 'react-splitter-layout';
import { SuperblocksConfig } from '../../../superblocksConfig';

interface IProps {
    selectedConfig: Nullable<IRunConfiguration>;
    runConfigurations: IRunConfiguration[];
    hideModal(): void;
    selectRunConfiguration(id: string): void;
    save(configId: string, name: string): void;
}

interface IState {
    currentConfigName: Nullable<string>;
}

export class ConfigurationsModal extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            currentConfigName: props.selectedConfig ? props.selectedConfig.name : null
        };
    }

    componentDidUpdate(prevProps: IProps) {
        if (!this.props.selectedConfig) {
            return;
        }

        if (!prevProps.selectedConfig || prevProps.selectedConfig.name !== this.props.selectedConfig.name) {
            this.setState(state => ({
                currentConfigName: this.props.selectedConfig ? this.props.selectedConfig.name : ''
            }));
        }
    }

    onConfigNameChange = (e: any) => {
        this.setState({ currentConfigName: e.target.value });
    }

    onSave = () => {
        if (!this.props.selectedConfig) {
            return;
        }

        this.props.save(this.props.selectedConfig.id, this.state.currentConfigName || '');
    }

    render() {
        const { selectedConfig, selectRunConfiguration, hideModal } = this.props;

        const configsList = this.props.runConfigurations.map(c => (
            <div key={c.id} className={style.configItem} onClick={() => selectRunConfiguration(c.id)}>{c.name}</div>
        ));

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
                            <div className={style.configGroup}>Superblocks</div>
                            {configsList}
                        </div>
                        <div className={style.column}>
                            { selectedConfig &&
                                <React.Fragment>
                                    <div className={style.nameContainer}>
                                        <div className={style.label}>Name:</div>
                                        <TextInput value={this.state.currentConfigName} onChange={this.onConfigNameChange} />
                                    </div>
                                    <div className={style.pluginContainer}>
                                        <SuperblocksConfig data={selectedConfig.data} />
                                    </div>
                                    <div className={style.buttonsContainer}>
                                        <button onClick={hideModal} className='btn2 noBg mr-2'>Cancel</button>
                                        <button onClick={this.onSave} className='btn2'>Save</button>
                                    </div>
                                </React.Fragment>
                            }
                        </div>
                    </SplitterLayout>
                </div>
            </div>
        );
    }
}
