import React from 'react';
import classNames from 'classnames';
import { ipfsActions } from '../../actions';
import {IconInformation, IconClose} from '../icons';
import { throwError } from 'rxjs';

export const CloseButton = ({ closeToast }) => (
    <button className={classNames(['closeIcon', 'btnNoBg'])} onClick={closeToast}>
        <IconClose className={'icon'}/>
    </button>
);

export const ProjectLoadedSuccess = () => (
    <div className={'messageContainer'}>
        <IconInformation/>
        Project downloaded!
    </div>
);

const ForkSuccessMessage = () => (
    <div className={'messageContainer'}>
        <IconInformation/>
        Project Forked!
    </div>
);

export const getToastComponent = (type) => {
    switch(type) {
        case ipfsActions.FORK_PROJECT_SUCCESS:
            return ForkSuccessMessage;
    }
}
