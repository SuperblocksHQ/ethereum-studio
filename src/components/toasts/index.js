import React from 'react';
import classNames from 'classnames';
import { ipfsActions } from '../../actions';
import {
    IconInformation,
    IconWarning,
    IconClose
} from '../icons';

export const CloseButton = ({ closeToast }) => (
    <button className={classNames(['closeIcon', 'btnNoBg'])} onClick={closeToast}>
        <IconClose className={'icon'}/>
    </button>
);

export const ProjectLoadedSuccess = () => (
    <div className={'messageContainer'}>
        <IconInformation/>
        Project Downloaded!
    </div>
);

const ForkSuccessMessage = () => (
    <div className={'messageContainer'}>
        <IconInformation/>
        Project Forked!
    </div>
);

const ForkFailMessage = () => (
    <div className={'messageContainer'}>
        <IconWarning/>
        Error Forking!
    </div>
);

export const getToastComponent = (type) => {
    switch(type) {
        case ipfsActions.FORK_PROJECT_SUCCESS:
            return {
                ToastComponent: ForkSuccessMessage,
                className: classNames(['body', 'info'])
            }
        case ipfsAProjectLoadedSuccessctions.FORK_PROJECT_FAIL:
            return {
                ToastComponent: ForkFailMessage,
                className: classNames(['body', 'error'])
            }
    }
}
