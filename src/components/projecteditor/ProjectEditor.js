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
import style from './style.less';
import Control from './control';
import Panes from './panes1';
import Explorer from './explorer';
import TopBar from '../topbar';
import BottomBar from './bottomBar';
import ContactContainer from '../contactContainer';
import SplitterLayoutBase from 'react-splitter-layout';
import { PreviewSidePanel, TransactionLogPanel, CompilerPanel } from './sidePanels';
import { IconTransactions, IconShowPreview, IconFileAlt, IconCompile } from '../icons';
import { SideButton } from './sideButton';
import classnames from 'classnames';

class SplitterLayout extends SplitterLayoutBase {
    handleResize() {
        // all this does is just disabling recalculation of sizes in non-persengate mode when window is resized
    }
}

export default class ProjectEditor extends Component {
    state = {
        sidePanelDragging: false
    };

    constructor(props) {
        super(props);
        // Mute defalt ctrl-s behavior.
        window.addEventListener(
            'keydown',
            function(e) {
                if (
                    e.keyCode === 83 &&
                    (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)
                ) {
                    e.preventDefault();
                }
            },
            false
        );
    }

    toggleSidePanelDragging() {
        this.setState({ sidePanelDragging: !this.state.sidePanelDragging });
    }

    render() {
        const { router,
                functions,
                displayTransactionsPanel,
                displayFileSystemPanel,
                previewSidePanel,
                toggleTransactionsHistoryPanel,
                toggleFileSystemPanel,
                previewSidePanelActions,
                selectedEnvironment } = this.props;

        const { sidePanelDragging } = this.state;

        return (
            <div className={style.projecteditor}>
                <TopBar functions={functions} />
                <div className={style.mainWrapper}>
                    <div className={classnames([style.sideButtonsContainer, style.sideButtonsContainerLeft])}>
                        <SideButton name="Explorer"
                            icon={<IconFileAlt style={{width: 12}} />}
                            onClick={toggleFileSystemPanel}
                        />
                    </div>

                    <div className={style.mainLayout}>
                        <div className={style.splitterContainer}>
                            <SplitterLayout
                                primaryIndex={1}
                                secondaryMinSize={0}
                                secondaryInitialSize={280}
                                onSecondaryPaneSizeChange={() => {}}
                                customClassName={!displayFileSystemPanel ? "hideFileSystemPanel" : null}>
                                <div className={style.control}>
                                    <Explorer />
                                    <ContactContainer />
                                </div>
                                <div>
                                    <SplitterLayout
                                        primaryIndex={0}
                                        secondaryMinSize={232}
                                        secondaryInitialSize={500}
                                        onDragStart={() => this.toggleSidePanelDragging()}
                                        onDragEnd={() => this.toggleSidePanelDragging()}
                                        onSecondaryPaneSizeChange={() => {}}>

                                        <Panes dragging={sidePanelDragging} />

                                        { displayTransactionsPanel &&
                                        <TransactionLogPanel
                                            dragging={sidePanelDragging}
                                            router={router}
                                            onClose={toggleTransactionsHistoryPanel}
                                            selectedEnvironment={selectedEnvironment.name}
                                        /> }

                                        { previewSidePanel.open &&
                                        <PreviewSidePanel
                                            dragging={sidePanelDragging}
                                            {...previewSidePanel}
                                            {...previewSidePanelActions}
                                            selectedEnvironment={selectedEnvironment.name}
                                        /> }

                                    </SplitterLayout>
                                </div>
                            </SplitterLayout>
                        </div>

                        <div className={style.bottomBarContainer}>
                            <div className={style.bottomPanelContainer}>
                                <CompilerPanel />
                            </div>
                            <SideButton name="Compiler output"
                                icon={<IconCompile />}
                                onClick={toggleTransactionsHistoryPanel}  />
                             <BottomBar endpoint={selectedEnvironment.endpoint} />
                        </div>
                    </div>

                    <div className={classnames([style.sideButtonsContainer, style.sideButtonsContainerRight])}>
                        <SideButton name="Transactions"
                            icon={<IconTransactions />}
                            onClick={toggleTransactionsHistoryPanel}  />

                        <SideButton name="Preview"
                            icon={<IconShowPreview />}
                            onClick={previewSidePanelActions.onOpen}  />
                    </div>
                </div>               
            </div>
        );
    }
}
