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

import React from 'react';
import style from './style-editor.less';
import { Tooltip, OnlyIf } from '../../../common';
import { IconSave, IconCompile, IconConfigure, IconDeploy, IconCode, IconFileAlt } from '../../../icons';
import classNames from 'classnames';

export interface IProps {
    isSmartContract: boolean;
    hasUnsavedChanges: boolean;
    onSave: () => void;
    onCompile: () => void;
    onDeploy: () => void;
    onConfigure: () => void;
    isMarkdown: boolean;
    showMarkdownPreview: boolean;
    onShowMarkdownPreview: () => void;
}

export function EditorToolbar(props: IProps) {
    return (
        <div className={style.toolbar}>
            <div className={style.buttons}>
                <button
                    className={classNames('btnNoBg', {[style.hasUnsavedChanges]: props.hasUnsavedChanges})}
                    onClick={props.onSave}
                >
                    <Tooltip title='Save'>
                        <IconSave />
                    </Tooltip>
                </button>
                <OnlyIf test={props.isSmartContract}>
                    <button
                        className='btnNoBg'
                        onClick={props.onCompile}>
                        <Tooltip title='Compile'>
                            <IconCompile />
                        </Tooltip>
                    </button>
                    <button
                        className='btnNoBg'
                        onClick={props.onDeploy}>
                        <Tooltip title='Deploy'>
                            <IconDeploy style={{ verticalAlign: 'middle' }} />
                        </Tooltip>
                    </button>
                    <button
                        className='btnNoBg'
                        onClick={props.onConfigure}>
                        <Tooltip title='Configure'>
                            <IconConfigure />
                        </Tooltip>
                    </button>
                </OnlyIf>
                <OnlyIf test={props.isMarkdown}>
                    <button
                        className='btnNoBg'
                        onClick={props.onShowMarkdownPreview}
                    >
                        <Tooltip title={props.showMarkdownPreview ? 'Display source' : 'Display preview'}>
                            { props.showMarkdownPreview
                                ? <IconCode />
                                : <IconFileAlt />
                            }
                        </Tooltip>
                    </button>
                </OnlyIf>
            </div>
            <div className={style.info}>
                {/* <span>{this.props.item.getFullPath()}</span> */}
            </div>
        </div>
    );
}
