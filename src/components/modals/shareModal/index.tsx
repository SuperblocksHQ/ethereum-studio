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
import copy from 'copy-to-clipboard';
import classNames from 'classnames';
import style from './style.less';
import {
    IconCopy
} from '../../icons';
import { Tooltip, TextAreaInput, ModalHeader } from '../../common';
import Switch from 'react-switch';

interface IProps {
    defaultUrl: string;
    hideModal: () => void;
}

interface IState {
    shareUrl: string;
    options: {
        hideExplorer: boolean;
        showTransactions: boolean;
        showPreview: boolean;
        [key: string]: boolean;
    };
}

export default class ShareModal extends React.Component<IProps, IState> {

    state: IState = {
        shareUrl: this.props.defaultUrl || String(window.location),
        options: {
            hideExplorer: false,
            showTransactions: false,
            showPreview: false,
        }
    };

    updateUrl = () => {
        const { defaultUrl } = this.props;
        const { options } = this.state;

        const params = Object.keys(options).map( async (key) => {
            if (options[key]) {
                return key + '=' + Number(options[key]);
            }
        });

        Promise.all(params).then((result) => {
            this.setState({
                shareUrl: defaultUrl  + (result.filter(Boolean).length ? '?' : '') + result.filter(Boolean).join('&')
            });
        });
    }

    getEmbedUrl = () => {
        return `<iframe src="${this.state.shareUrl}" style="width:960px;height:500px;border:0;border-radius:4px;overflow:hidden;" allowfullscreen="allowfullscreen"></iframe>`;
    }

    getBtnMdUrl = () => {
        return `[![Edit Project](https://superblocks.com/static/img/open-superblocks.svg)](${this.state.shareUrl})`;
    }

    getBtnHtmlUrl = () => {
        return `<a href="${this.state.shareUrl}"><img alt="Edit Project" src="https://superblocks.com/static/img/open-superblocks.svg"></a>`;
    }

    RenderOptions = () => {
        const { hideExplorer, showTransactions, showPreview } = this.state.options;

        return(
            <div className={style.innerContent}>
                <div className={style.title}>
                    Options
                </div>
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
                               this.setState({options: { ...this.state.options, showTransactions: !showTransactions, showPreview: false }}, () => {
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
                    <p>Show Preview</p>
                    <Switch
                        checked={showPreview}
                        onChange={() => {
                                this.setState({options: { ...this.state.options, showPreview: !showPreview, showTransactions: false }}, () => {
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
            </div>
        );
    }

    RenderInputs = () => {
        const { shareUrl } = this.state;
        const embedUrl = this.getEmbedUrl();
        const btnMdUrl = this.getBtnMdUrl();
        const btnHtmlUrl = this.getBtnHtmlUrl();

        return(
            <React.Fragment>
                <div className={style.innerContent}>
                    <div className={style.title}>
                        Links
                    </div>
                    <div className={style.inputContainer}>
                        <TextAreaInput
                            id='editor'
                            label='Editor'
                            value={shareUrl}
                            disabled={false}
                            readOnly={true}
                            rows={3}
                        />
                        <button className='btnNoBg' onClick={() => copy(shareUrl)}>
                            <Tooltip title='Copy URL'>
                                <IconCopy />
                            </Tooltip>
                        </button>
                    </div>
                    <div className={style.inputContainer}>
                        <TextAreaInput
                            id='embed'
                            label='Embed'
                            value={embedUrl}
                            disabled={false}
                            readOnly={true}
                            rows={3}
                        />
                        <button className='btnNoBg' onClick={() => copy(embedUrl)}>
                            <Tooltip title='Copy URL'>
                                <IconCopy />
                            </Tooltip>
                        </button>
                    </div>
                </div>
                <div className={style.innerContent}>
                    <div className={style.title}>
                        Button
                    </div>
                    <div className={style.inputContainer}>
                        <TextAreaInput
                            id='button-md'
                            label='Markdown'
                            value={btnMdUrl}
                            disabled={false}
                            readOnly={true}
                            rows={3}
                        />
                        <button className='btnNoBg' onClick={() => copy(btnMdUrl)}>
                            <Tooltip title='Copy URL'>
                                <IconCopy />
                            </Tooltip>
                        </button>
                    </div>
                    <div className={style.inputContainer}>
                        <TextAreaInput
                            id='button-html'
                            label='HTML'
                            value={btnHtmlUrl}
                            disabled={false}
                            readOnly={true}
                            rows={3}
                        />
                        <button className='btnNoBg' onClick={() => copy(btnHtmlUrl)}>
                            <Tooltip title='Copy URL'>
                                <IconCopy />
                            </Tooltip>
                        </button>
                    </div>
                    <img className={style.openLabBtn} alt='Superblocks button' src={'/static/img/open-superblocks.svg'}/>
                </div>
            </React.Fragment>
        );
    }

    render() {
        const { hideModal } = this.props;

        return (
            <div className={classNames([style.shareModal, 'modal'])}>
                <ModalHeader
                    title='Share your project'
                    onCloseClick={hideModal}
                />
                <div className={style.content}>
                    {this.RenderOptions()}
                    {this.RenderInputs()}
                </div>
            </div>
        );
    }
}
