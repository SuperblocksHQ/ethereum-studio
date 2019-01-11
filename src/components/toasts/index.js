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

const info = (text) => ({
    ToastComponent: () =>
        <div className={'messageContainer'}>
            <IconInformation/>
            {text}
        </div>
    ,
    className: classNames(['body', 'info'])
});

const error = (text) => ({
    ToastComponent: () =>
        <div className={'messageContainer'}>
            <IconWarning/>
            {text}
        </div>
    ,
    className: classNames(['body', 'error'])
});

export const getToastComponent = (type) => {
    switch(type) {
        case ipfsActions.FORK_PROJECT_SUCCESS:
            return info('Project Forked!');
        case ipfsActions.FORK_PROJECT_FAIL:
            return error('Error while forking!');
        case ipfsActions.IMPORT_PROJECT_FROM_IPFS_SUCCESS:
            return info('Project Downloaded!');
        case ipfsActions.IMPORT_PROJECT_FROM_IPFS_FAIL:
            return error('Error importing project!');
    }
}
