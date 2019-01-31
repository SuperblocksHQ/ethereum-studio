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

import React, { Component } from 'react';
import copy from 'copy-to-clipboard';
import classNames from 'classnames';
import style from './style.less';
import {
    IconCopy
} from '../../icons';
import TextInput from '../../textInput';
import { Tooltip } from '../../common';
import Switch from 'react-switch';


export default class ShareDialog extends React.Component<IProps, IState> {

    constructor(props: IProps, state: IState) {
        super(props);

        this.state = {
            shareUrl: window.location,
            options: {
                hideExplorer: false,
                showTransactions: false,
                showAppview: false
            }
        };
    }


    copyShareUrl = (url: string) => {
        copy(url);
    }

    updateOption = (optionName, value) => {
        this.setState({
            options: {
                optionName: value
            }
        });
    }


    RenderOptions = () => {
        const { hideExplorer, showTransactions, showAppview } = this.state.options;

        return(
            <React.Fragment>
                <p className={style.title}>Options</p>
                <div className={classNames([style.inputContainer, style.optionInput])}>
                    <p>Hide Explorer</p>
                    <Switch
                        checked={hideExplorer}
                        onChange={() => this.setState({options: { ...this.state.options, hideExplorer: !hideExplorer }})}
                        onColor='#8641F2'
                        className={style.switch}
                        checkedIcon={false}
                        uncheckedIcon={false}
                        height={20}
                        width={40}
                    />
                </div>
                <div className={classNames([style.inputContainer, style.optionInput])}>
                    <p>Show Transactions</p>
                    <Switch
                        checked={showTransactions}
                        onChange={() => this.setState({options: { ...this.state.options, showTransactions: !showTransactions, showAppview: false }})}
                        onColor='#8641F2'
                        className={style.switch}
                        checkedIcon={false}
                        uncheckedIcon={false}
                        height={20}
                        width={40}
                    />
                </div>
                <div className={classNames([style.inputContainer, style.optionInput])}>
                    <p>Show Appview</p>
                    <Switch
                        checked={showAppview}
                        onChange={() => this.setState({options: { ...this.state.options, showAppview: !showAppview, showTransactions: false }})}
                        onColor='#8641F2'
                        className={style.switch}
                        checkedIcon={false}
                        uncheckedIcon={false}
                        height={20}
                        width={40}
                    />
                </div>
            </React.Fragment>
        );
    }


    RenderInputs = () => {
        const { hideExplorer, showTransactions, showAppview } = this.state.options;
        const { shareUrl } = this.state;

        return(
            <React.Fragment>
                <div className={style.inputContainer}>
                    <TextInput
                        id='share-project'
                        label='Editor'
                        defaultValue={shareUrl}
                        disabled={false}
                        readOnly={true}
                    />
                    <button className='btnNoBg' onClick={this.copyShareUrl('1')}>
                        <Tooltip title='Copy URL'>
                            <IconCopy />
                        </Tooltip>
                    </button>
                </div>
                <div className={style.inputContainer}>
                    <TextInput
                        id='share-project'
                        label='Embed'
                        defaultValue={shareUrl}
                        disabled={false}
                        readOnly={true}
                    />
                    <button className='btnNoBg' onClick={this.copyShareUrl('2')}>
                        <Tooltip title='Copy URL'>
                            <IconCopy />
                        </Tooltip>
                    </button>
                </div>
                <div className={style.inputContainer}>
                    <TextInput
                        id='share-project'
                        label='Button Markdown'
                        defaultValue={shareUrl}
                        disabled={false}
                        readOnly={true}
                    />
                    <button className='btnNoBg' onClick={this.copyShareUrl}>
                        <Tooltip title='Copy URL'>
                            <IconCopy />
                        </Tooltip>
                    </button>
                </div>
                <div className={style.inputContainer}>
                    <TextInput
                        id='share-project'
                        label='Button HTML'
                        defaultValue={shareUrl}
                        disabled={false}
                        readOnly={true}
                    />
                    <button className='btnNoBg' onClick={this.copyShareUrl}>
                        <Tooltip title='Copy URL'>
                            <IconCopy />
                        </Tooltip>
                    </button>
                </div>
            </React.Fragment>
        );
    }

    render() {
        return (
            <div className={style.shareDialogContainer}>
                <div className={style.content}>
                    {this.RenderOptions()}
                    {this.RenderInputs()}
                </div>
            </div>
        );
    }
}
