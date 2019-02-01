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



interface IState {
    defaultUrl: string;
    shareUrl: string;
    options: {
        hideExplorer: boolean;
        showTransactions: boolean;
        showAppview: boolean;
        [key: string]: boolean;
    };
}

export default class ShareDialog extends React.Component<{}, IState> {

    constructor(state: IState) {
        super(state);

        this.state = {
            defaultUrl: String(window.location),
            shareUrl: String(window.location),
            options: {
                hideExplorer: false,
                showTransactions: false,
                showAppview: false
            }
        };
    }



    RenderOptions = () => {
        const { hideExplorer, showTransactions, showAppview } = this.state.options;

        return(
            <React.Fragment>
                <div className={classNames([style.inputContainer, style.optionInput])}>
                    <p>Hide Explorer</p>
                    <Switch
                        checked={hideExplorer}
                        onChange={() => {
                                this.setState({options: { ...this.state.options, hideExplorer: !hideExplorer }}, () => {
                                        this.updateUrl();
                                    }
                                );
                            }
                        }
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
                        onChange={() => {
                               this.setState({options: { ...this.state.options, showTransactions: !showTransactions, showAppview: false }}, () => {
                                        this.updateUrl();
                                    }
                               );
                               this.updateUrl();
                           }
                        }
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
                        onChange={() => {
                                this.setState({options: { ...this.state.options, showAppview: !showAppview, showTransactions: false }}, () => {
                                        this.updateUrl();
                                    }
                                );
                            }
                        }
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

    updateUrl = () => {
        const { defaultUrl, options } = this.state;

        const params = Object.keys(options).map( async (key) => key + '=' + Number(options[key]));
        console.log(params);
        Promise.all(params).then((result) => {
            console.log(result);
            this.setState({
                shareUrl: defaultUrl + '?' + result.join('&')
            });
        });


    }
    getParameters = () => {
        const { options } = this.state;
        let result = '?';
        Object.keys(options).map( (k, v) => {
            console.log(k);
            console.log(options[k]);
            result += '&' + k + '=' + Number(options[k]);
        });
        return result;
    }

    copyShareUrl = (type: string) => {
        const { shareUrl, options } = this.state;

        console.log(options);
        // Object.keys(options).entries( (k, v) => {
        //     console.log(k);
        // });



        // for(let key in options) {
        //     console.log(options[key]);
        // }

        switch (type) {
            case 'editor':
                break;
            case 'embed':
                break;
            case 'button-md':
                break;
            case 'button-html':
                break;
            default:
                copy(shareUrl);
        }
    }

    getEmbedUrl = () => {
        return `<iframe src="${this.state.shareUrl}" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"></iframe>`;
    }

    getBtnMdUrl = () => {
        return `<iframe src="${this.state.shareUrl}" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"></iframe>`;
    }

    getBtnHtmlUrl = () => {
        return `<iframe src="${this.state.shareUrl}" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"></iframe>`;
    }



    RenderInputs = () => {
        const { hideExplorer, showTransactions, showAppview } = this.state.options;
        const { shareUrl } = this.state;

        return(
            <React.Fragment>
                <div className={style.inputContainer}>
                    <TextInput
                        id='editor'
                        label='Editor'
                        value={shareUrl}
                        disabled={false}
                        readOnly={true}
                    />
                    <button className='btnNoBg' onClick={() => this.copyShareUrl('editor')}>
                        <Tooltip title='Copy URL'>
                            <IconCopy />
                        </Tooltip>
                    </button>
                </div>
                <div className={style.inputContainer}>
                    <TextInput
                        id='embed'
                        label='Embed'
                        value={this.getEmbedUrl()}
                        disabled={false}
                        readOnly={true}
                    />
                    <button className='btnNoBg' onClick={() => this.copyShareUrl('embed')}>
                        <Tooltip title='Copy URL'>
                            <IconCopy />
                        </Tooltip>
                    </button>
                </div>
                <div className={style.inputContainer}>
                    <TextInput
                        id='button-md'
                        label='Button Markdown'
                        value={this.getBtnMdUrl()}
                        disabled={false}
                        readOnly={true}
                    />
                    <button className='btnNoBg' onClick={() => this.copyShareUrl('button-md')}>
                        <Tooltip title='Copy URL'>
                            <IconCopy />
                        </Tooltip>
                    </button>
                </div>
                <div className={style.inputContainer}>
                    <TextInput
                        id='button-html'
                        label='Button HTML'
                        value={this.getBtnHtmlUrl()}
                        disabled={false}
                        readOnly={true}
                    />
                    <button className='btnNoBg' onClick={() => this.copyShareUrl('button-html')}>
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
