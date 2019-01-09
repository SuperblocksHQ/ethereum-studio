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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import copy from 'copy-to-clipboard';
import classNames from 'classnames';
import style from './style.less';
import {
    IconCopy,
    IconConfigure
} from '../../icons';
import Note from '../../note';
import TextInput from '../../textInput';
import Tooltip from '../../tooltip';
import UploadSettings from './settings';

class UploadDialog extends Component {

    state = {
        ipfs: {
            uploading: this.props.ipfs.uploading,
            shareURL: this.props.ipfs.shareURL,
            lastUploadTimestamp: this.props.ipfs.lastUploadTimestamp,
            error: this.props.ipfs.error,
            showUploadSettings: this.props.ipfs.showUploadSettings,
            uploadSettings: this.props.ipfs.uploadSettings,
        },
    }

    componentDidUpdate(prevProps) {
        if (prevProps.ipfs !== this.props.ipfs) {
            this.setState({
                ipfs: {...this.props.ipfs}
            });
        }
    }

    ipfsSyncUp = () => {
        const { ipfs } = this.state;
        const { uploadToIPFS } = this.props;

        uploadToIPFS(ipfs.uploadSettings);
    }

    copyShareUrl = () => {
        const { shareURL } = this.state.ipfs;
        copy(shareURL);
    }

    uploadSettingsClick = () => {
        this.props.showUploadSettings();
    }

    onUploadSettingsBackClicked = () => {
        this.props.hideUploadSettings();
    }

    onUploadSettingsChanged = (uploadSettings) => {
        this.props.uploadSettingsChanged(uploadSettings);
    }

    renderDialog() {
        return (
            <div className={style.content}>
                <img src={'/static/img/img-ipfs-logo.svg'} className={style.logo}/>
                <h3>Upload project to IPFS</h3>
                <div className={style.description}>Backup and share your project by uploading it to IPFS. Remember to not include any personal data, and enjoy decentralization!</div>
                <br/>
                <div>
                    <button className="btn2" onClick={this.ipfsSyncUp}>Upload Project</button>
                    <button className={classNames([style.uploadSettings, "btnNoBg"])} onClick={this.uploadSettingsClick}>
                        <Tooltip title="Upload Settings">
                            <IconConfigure />
                        </Tooltip>
                    </button>
                </div>
                <br/>
                <Note
                    textClassName={style.note}
                    title="Warning"
                    text="Due to the nature of IPFS, might not be possible to delete your project from the network."
                />
            </div>
        );
    }

    renderUploading() {
        return(
            <div className={style.content}>
                <img src={'/static/img/img-ipfs-logo.svg'} className={style.logo}/>
                <div className={style.uploadingContainer}>
                    <h3>Uploading project to IPFS</h3>
                    <div className={style.loadBar}>
                        <div className={style.bar}></div>
                        <div className={style.bar}></div>
                        <div className={style.bar}></div>
                    </div>
                    <div>You can keep working while your project is being uploaded.</div>
                </div>
            </div>
        );
    }

    renderShareURL(shareURL, lastUploadTimestamp) {
        return (
            <div className={style.content}>
                <img src={'/static/img/img-ipfs-logo.svg'} className={style.logo}/>
                <div className={style.share}>
                    <TextInput
                        id="share-project"
                        label="Share your project"
                        defaultValue={shareURL}
                        disabled={true}
                    />
                    <button className="btnNoBg" onClick={this.copyShareUrl}>
                        <Tooltip title="Copy URL">
                            <IconCopy />
                        </Tooltip>
                    </button>
                </div>
                <div className={style.newUploadContainer}>
                    <button className="btn2" onClick={this.ipfsSyncUp}>New Upload</button>
                    <button className={classNames([style.uploadSettings, "btnNoBg"])} onClick={this.uploadSettingsClick}>
                        <Tooltip title="Upload Settings">
                            <IconConfigure />
                        </Tooltip>
                    </button>
                </div>

            </div>
        );
    }

    render() {
        const { ipfs } = this.state;
        return (
            <div className={style.shareDialogContainer}>
                { ipfs.uploading ?
                    this.renderUploading()
                :
                    ipfs.showUploadSettings ?
                        <UploadSettings
                            uploadSettings={ipfs.uploadSettings}
                            onBackClicked={this.onUploadSettingsBackClicked}
                            onChange={this.onUploadSettingsChanged}
                        />
                    :
                        ipfs.shareURL ?
                            this.renderShareURL(ipfs.shareURL, ipfs.lastUploadTimestamp)
                        :
                            this.renderDialog()
                }
            </div>
        )
    }
}

export default UploadDialog;

UploadDialog.propTypes = {
    ipfs: PropTypes.object.isRequired,
    uploadToIPFS: PropTypes.func.isRequired,
    showUploadSettings: PropTypes.func.isRequired,
    hideUploadSettings: PropTypes.func.isRequired,
    uploadSettingsChanged: PropTypes.func.isRequired,
}
