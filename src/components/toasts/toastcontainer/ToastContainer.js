import React, { Component } from 'react';
import {toast, ToastContainer as ReactToastContainer } from 'react-toastify';
import { ForkSuccessMessage, CloseButton } from '../index';

export default class ToastContainer extends Component {

    componentDidUpdate(prevProps) {
        if (prevProps.toasts !== this.props.toasts) {
            this.renderToast();
        }
    }

    renderToast() {
        toast(<ForkSuccessMessage index={1}/>, {
            className: "toastBody",
            onClose: ({ index }) => console.log("Dismissed " + index)
        });
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
