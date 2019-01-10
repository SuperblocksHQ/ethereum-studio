import React, { Component } from 'react';
import { toast, ToastContainer as ReactToastContainer } from 'react-toastify';
import { CloseButton, getToastComponent } from '../index';

export default class ToastContainer extends Component {

    componentDidUpdate(prevProps) {
        this.renderToast(prevProps);
    }

    renderToast(prevProps) {
        this.props.toasts.map(toastItem => {
            // New toast
            if (!(prevProps.toasts.some(toast => toast.id === toastItem.id))) {
                const { ToastComponent, className } = getToastComponent(toastItem.type);
                toast(<ToastComponent id={toastItem.id}/>, {
                    className: className,
                    onClose: ({ id }) => this.props.toastDismissed(id)
                });
            }
        })

    }

    render() {
        return <ReactToastContainer
                    position="bottom-right"
                    className={"toastContainer"}
                    autoClose={6000}
                    hideProgressBar
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnVisibilityChange
                    draggable
                    pauseOnHover={false}
                    closeButton={<CloseButton />}
                />
    }
}
