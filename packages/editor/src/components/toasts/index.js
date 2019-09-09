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

import React from 'react';
import classNames from 'classnames';
import { projectsActions } from '../../actions';
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

const info = (text) => ({
    ToastComponent: () =>
    (
        <div className={'messageContainer'}>
            <IconInformation/>
            {text}
        </div>
    ),
    className: classNames(['body', 'info'])
});

const error = (text) => ({
    ToastComponent: () =>
    (
        <div className={'messageContainer'}>
            <IconWarning/>
            {text}
        </div>
    ),
    className: classNames(['body', 'error'])
});

export const getToastComponent = (type) => {
    switch(type) {
        case projectsActions.FORK_PROJECT:
            return info('Forking project...');
        case projectsActions.FORK_PROJECT_FAIL:
            return error('Error while forking!');
        case projectsActions.UPDATE_PROJECT_SETTINGS_FAIL:
            return error('Error updating project settings');
        case projectsActions.CREATE_PROJECT_SUCCESS:
            return info('Project created!');
        case projectsActions.DELETE_PROJECT_FAIL:
            return error('Error deleting project!');
        default:
            return null;
    }
}
