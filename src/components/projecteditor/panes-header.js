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
import PropTypes from 'prop-types';
import classnames from 'classnames';
import style from './style.less';
import { IconClose } from '../icons';
import { DropdownContainer } from '../common';

export default class PanesHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mousePosition: 0
        }
    }

    getContextMenuElement() {
        return (
            <div className={style.contextMenu} style={{left: this.state.mousePosition}}>
                <div className={style.item} onClick={this.props.closeAllPanes}>
                    Close all
                </div>
                <div className={style.item} onClick={this.props.closeAllOtherPanes}>
                    Close all other
                </div>
            </div>
        );
    }

    getClassnames(paneData) {
        const cls = {};
        cls[style.tab] = true;
        cls[style.selected] = paneData.active;
        return classnames(cls);
    }

    render() {
        return this.props.panes.map((paneData, index) => {
            const iconElement = this.props.paneComponents[index].getIcon();
            const contextMenu = this.getContextMenuElement();

            return (
                    <div key={index}
                        className={ this.getClassnames(paneData) }
                        onMouseDown={e => this.props.tabClicked(e, paneData.id)}
                        onContextMenu={e => {
                                this.props.tabRightClicked(e, paneData.id)
                                this.setState({mousePosition: e.pageX})
                            }
                        }
                    >
                        <DropdownContainer
                            dropdownContent={contextMenu}
                            useRightClick={true}
                        >
                            <div className={style.tabContainer}>
                                <div className={style.title}>
                                    <div className={style.icon}>{iconElement}</div>
                                    <div className={style.title2}>{paneData.name}</div>
                                </div>
                                <div className={style.close}>
                                    <button className="btnNoBg" 
                                        onClick={e => this.props.tabClickedClose(e, paneData.id)}>
                                        <IconClose />
                                    </button>
                                </div>
                            </div>
                        </DropdownContainer>
                    </div>
            );
        });
    }
}

PanesHeader.propTypes = {
    panes: PropTypes.array.isRequired,
    paneComponents: PropTypes.array.isRequired,  // paneComponents are only needed to get an icon. TODO: remove it as soon as possible
    closeAllPanes: PropTypes.func,
    closeAllOtherPanes: PropTypes.func,
    tabClicked: PropTypes.func,
    tabRightClicked: PropTypes.func,
    tabClickedClose: PropTypes.func
};
