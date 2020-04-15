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

import React from 'react';
import LoadingBar from 'react-redux-loading-bar';
import style from './style.less';
import './react-splitter-layout.css';
import Panes from './panes';
import TopBar from '../topbar';
import BottomBar from './bottomBar';
import ContactContainer from '../contactContainer';
import { PreviewPanel, TransactionLogPanel, OutputPanel, Explorer, InteractPanel, DeployPanel } from './panels';
import { IconTransactions, IconFolderOpen, IconInteract, IconDownloadDApp, IconTogglePreview, IconRocket } from '../icons';
import { SideButton } from './sideButton';
import { SplitterLayout } from './splitterLayout';
import { Panel, PanelAction } from './panel';
import classnames from 'classnames';
import { Panels, IPanelsState, IEnvironment } from '../../models/state';
import { Deployer } from './deployer';
import { OnlyIf } from '../common';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import ContractConfigModal from './editors/contractConfigModal';
import ExternalProviderInfo from '../externalProviderInfo';
import classNames from 'classnames';
import { PaneAction } from './paneAction';
import { IOutputLogRow } from '../../models/state';

interface IProps {
    panels: IPanelsState;
    selectedEnvironment: IEnvironment;
    showContractConfig: boolean;
    showTemplateModal?: boolean;
    showExternalProviderInfo: boolean;
    unreadRows: boolean;
    rows: IOutputLogRow[];
    showModal: (modalType: string, modalProps: any) => void;
    togglePanel(panel: Panels): void;
    openPanel(panel: Panels): void;
    closePanel(panel: Panels): void;
    closeContractConfigModal(): void;
    exportProject(): void;
}

interface IState {
    sidePanelDragging: boolean;
    verticalPanelDragging: boolean;
    outputPanelSize: number;
}

@DragDropContext(HTML5Backend)
export class ProjectEditor extends React.Component<IProps, IState> {
    state: IState = {
        sidePanelDragging: false,
        verticalPanelDragging: false,
        outputPanelSize: 30
    };

    constructor(props: IProps) {
        super(props);
        // Mute defalt ctrl-s behavior.
        window.addEventListener(
            'keydown',
            (e) => {
                if (e.keyCode === 83 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
                    e.preventDefault();
                }
            },
            false
        );
    }

    componentDidMount() {
        const { showTemplateModal, showModal } = this.props;

        if (showTemplateModal) {
            showModal('PROJECT_TEMPLATE_MODAL', null);
        }
    }

    componentDidUpdate(prevProps: IProps) {
        const { rows, togglePanel } = this.props;
        if (prevProps.rows !== this.props.rows && rows.length === 1) {
            togglePanel(Panels.OutputLog);
        }
    }

    toggleSidePanelDragging() {
        this.setState({ sidePanelDragging: !this.state.sidePanelDragging });
    }

    toggleVerticalPanelDragging() {
        this.setState({ verticalPanelDragging: !this.state.verticalPanelDragging });
    }

    isPanelOpen = (panel: Panels) => this.props.panels[panel] && this.props.panels[panel].open;

    render() {
        const { togglePanel,
            openPanel,
            exportProject,
            showContractConfig,
            closeContractConfigModal,
            showExternalProviderInfo,
            unreadRows
        } = this.props;

        const { sidePanelDragging } = this.state;
        const rightPanelSize = window.innerWidth < 1000 ? 280 : 500;
        return (
            <div className={style.projecteditor}>
                <TopBar />
                <LoadingBar className='loading' />
                <div className={style.mainWrapper}>
                    <div className={classnames([style.sideButtonsContainer, style.sideButtonsContainerLeft])}>
                        <SideButton
                            icon={<IconFolderOpen color='#fff' />}
                            onClick={() => togglePanel(Panels.Explorer)}
                            className={this.isPanelOpen(Panels.Explorer) && style.active}
                        />
                        <SideButton
                            icon={<IconRocket color='#fff'/>}
                            onClick={() => togglePanel(Panels.Configure)}
                            className={this.isPanelOpen(Panels.Configure) && style.active}
                        />
                        <SideButton
                            icon={<IconInteract color='#fff' />}
                            onClick={() => togglePanel(Panels.Interact)}
                            className={this.isPanelOpen(Panels.Interact) && style.active}
                        />
                    </div>

                    <div className={style.mainLayout}>
                        <div className={style.splitterContainer}>
                            <SplitterLayout
                                primaryIndex={1}
                                secondaryMinSize={0}
                                secondaryInitialSize={280}
                                customClassName={!this.isPanelOpen(Panels.Explorer) && !this.isPanelOpen(Panels.Interact) && !this.isPanelOpen(Panels.Configure) ? 'hideFileSystemPanel' : undefined}
                                onSecondaryPaneSizeChange={() => null}
                            >
                                <div className={style.control}>
                                    {this.isPanelOpen(Panels.Explorer) &&
                                        <React.Fragment>
                                            <Panel
                                                name='EXPLORER'
                                                dragging={this.state.sidePanelDragging}
                                                actions={
                                                    <PanelAction
                                                        tooltipText={'Export to ZIP'}
                                                        icon={<IconDownloadDApp />}
                                                        onClick={exportProject}
                                                    />
                                                }
                                            >
                                                <Explorer />
                                            </Panel>
                                            <ContactContainer />
                                        </React.Fragment>
                                    }
                                    {this.isPanelOpen(Panels.Configure) &&
                                        <React.Fragment>
                                            <Panel
                                                name='DEPLOY'
                                                dragging={this.state.sidePanelDragging}>
                                                <DeployPanel />
                                            </Panel>
                                            <ContactContainer />
                                        </React.Fragment>
                                    }
                                    {this.isPanelOpen(Panels.Interact) &&
                                        <React.Fragment>
                                            <Panel
                                                name='INTERACT'
                                                dragging={this.state.sidePanelDragging}>
                                                <InteractPanel />
                                            </Panel>
                                            <ContactContainer />
                                        </React.Fragment>
                                    }
                                </div>
                                <SplitterLayout
                                    primaryIndex={0}
                                    secondaryInitialSize={rightPanelSize}
                                    onDragStart={() => this.toggleSidePanelDragging()}
                                    onDragEnd={() => this.toggleSidePanelDragging()}
                                    onSecondaryPaneSizeChange={() => null}
                                    customClassName={!this.isPanelOpen(Panels.Preview) && !this.isPanelOpen(Panels.Transactions) ? 'hidePreviewSystemPanel' : style.overflowHidden}
                                >
                                    <Panes dragging={sidePanelDragging} />
                                    <div className={style.rightPanel}>
                                        <SplitterLayout
                                            primaryIndex={0}
                                            onDragStart={() => this.toggleSidePanelDragging()}
                                            onDragEnd={() => this.toggleSidePanelDragging()}
                                            vertical={true}
                                            secondaryMinSize={30}
                                            secondaryInitialSize={250}
                                            customClassName={style.rightSplitter}
                                        >
                                            <div className={style.rightPanelWrapper}>
                                                <div className={classnames([style.panelButtonsContainer])}>
                                                    <SideButton
                                                        name='Browser'
                                                        onClick={() => openPanel(Panels.Preview)}
                                                        active={this.isPanelOpen(Panels.Preview)}
                                                    />
                                                    <SideButton
                                                        name='Transactions'
                                                        onClick={() => openPanel(Panels.Transactions)}
                                                        active={this.isPanelOpen(Panels.Transactions)}
                                                    />
                                                    <PaneAction
                                                        tooltipText='Toggle Preview'
                                                        icon={<IconTogglePreview />}
                                                        onClick={() => togglePanel(Panels.Preview)}
                                                    />
                                                </div>
                                                {this.isPanelOpen(Panels.Transactions) &&
                                                    <Panel icon={<IconTransactions />} dragging={sidePanelDragging}>
                                                        <TransactionLogPanel />
                                                    </Panel>
                                                }

                                                {this.isPanelOpen(Panels.Preview) &&
                                                    <Panel dragging={sidePanelDragging}>
                                                        <PreviewPanel />
                                                    </Panel>
                                                }
                                            </div>
                                            {this.isPanelOpen(Panels.OutputLog) &&
                                                <Panel name={'Console'} dragging={sidePanelDragging}>
                                                    <OutputPanel />
                                                </Panel>
                                            }
                                        </SplitterLayout>
                                        <div className={classNames([style.panelButtonsContainer, style.bottomButtonsContainer])}>
                                            <SideButton
                                                name='Console'
                                                onClick={() => togglePanel(Panels.OutputLog)}
                                                pillStatus={unreadRows && !this.isPanelOpen(Panels.OutputLog) ? '1' : '0'}
                                                active={this.isPanelOpen(Panels.OutputLog)}
                                            />
                                        </div>
                                    </div>
                                </SplitterLayout>
                            </SplitterLayout>
                        </div>
                    </div>
                </div>

                <OnlyIf test={showContractConfig}>
                    <ContractConfigModal
                        hideModal={closeContractConfigModal}
                    />
                </OnlyIf>

                <OnlyIf test={showExternalProviderInfo}>
                    <ExternalProviderInfo />
                </OnlyIf>


                <BottomBar />
                <Deployer />
            </div>
        );
    }
}
