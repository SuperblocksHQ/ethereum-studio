import React from 'react';
import classNames from 'classnames';
import {IconInformation, IconClose} from '../icons';

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

export const ForkSuccessMessage = () => (
    <div className={'messageContainer'}>
        <IconInformation/>
        Project Forked!
    </div>
);
