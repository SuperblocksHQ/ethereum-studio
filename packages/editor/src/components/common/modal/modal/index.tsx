// Copyright 2019 Superblocks AB
//
// This file is part of Superblocks.
//
// Superblocks is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.
//
// Superblocks is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Superblocks.  If not, see <http://www.gnu.org/licenses/>.

import React, { Component } from 'react';
import style from './style.less';

interface IProps {
    children: JSX.Element | JSX.Element[];
    hideModal: () => void;
}

export class Modal extends Component<IProps> {

    constructor(props: IProps) {
        super(props);
        this.hideOnEsc = this.hideOnEsc.bind(this);
    }

    componentDidMount() {
        window.addEventListener('keydown', this.hideOnEsc, false);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.hideOnEsc, false);
    }

    hideOnEsc(e: any) {
        // Hide modal with escape button
        if ( e.keyCode === 27) {
            e.preventDefault();
            this.props.hideModal();
        }
    }

    render() {
        return (
            <div className={style.modalContainer}>
                {this.props.children}
            </div>
        );
    }
}
