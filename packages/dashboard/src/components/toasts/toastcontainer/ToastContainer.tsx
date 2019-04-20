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
import { toast, ToastContainer as ReactToastContainer } from 'react-toastify';
import { CloseButton, getToastComponent } from '../index';
import { IToast } from '../../../models/toast.model';

interface IProps {
    toasts: [IToast];

    toastDismissed: (id: string) => void;
}

export default class ToastContainer extends Component<IProps> {

    componentDidUpdate(prevProps: IProps) {
        this.renderToast(prevProps);
    }

    renderToast(prevProps: IProps) {
        this.props.toasts.map(toastItem => {
            // New toast
            if (!(prevProps.toasts.some(item => item.id === toastItem.id))) {
                const { ToastComponent, className }: any = getToastComponent(toastItem.type);
                toast(<ToastComponent id={toastItem.id}/>, {
                    className,
                    onClose: () => this.props.toastDismissed(toastItem.id)
                });
            }
        });
    }

    render() {
        return <ReactToastContainer
                    position='bottom-right'
                    className={'toastContainer'}
                    autoClose={6000}
                    hideProgressBar
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    draggable
                    pauseOnHover={false}
                    closeButton={<CloseButton />}
                />;
    }
}
