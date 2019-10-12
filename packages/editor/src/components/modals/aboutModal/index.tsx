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

import React, { Component } from 'react';
import { Modal, ModalHeader } from '../../common';
import classNames from 'classnames';
import style from './style.less';

interface IProps {
    hideModal: () => void;
}

export default class AboutModal extends Component<IProps> {

    render() {
        const { hideModal } = this.props;

        return (
            <Modal hideModal={hideModal}>
                <div className={classNames([style.aboutModal, 'modal'])}>
                    <ModalHeader
                        title='About Ethereum Studio'
                        onCloseClick={hideModal}
                    />
                    <div className={classNames([style.content, 'scrollable-y'])}>
                        <div className={style.inner}>
                            <p>Ethereum Studio was built by <b>Superblocks</b>, and is now an open-source tool maintained in collaboration with <b>Ethereum.org</b>. You can learn more about Superblocks
                                <a href='https://superblocks.com' target='_blank' rel='noopener noreferrer' title='Superblocks home page'> here</a>.
                                <br />
                                <br />
                                Do you want to contribute to improving this tool? Check out the Github repository <a href='https://github.com/SuperblocksHQ/ethereum-studio' target='_blank' rel='noopener noreferrer' title='Ethereum Studio Github'>here</a>
                            </p>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}
