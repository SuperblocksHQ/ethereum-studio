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
import style from './style.less';
import {
    IconCopy
} from '../../icons';
import Note from '../../note';
import Switch from '../../switch';
import TextInput from '../../textInput';
import Backend from '../../projecteditor/control/backend';

class ShareDialog extends Component {

    state = {
        keepState: false,
        uploading: false,
        shareURL: null
    }

    onChange = (checked) => {
        this.setState({
            keepState: checked
        });
    }

    ipfsSyncUp = () => {
        const { keepState } = this.state;
        const { projectId } = this.props;

        this.setState({
            uploading: true
        });

        const backend = new Backend();
        backend.ipfsSyncUp(projectId, keepState)
            .then(hash => {
                this.setState({
                    shareURL: document.location.href + '#/ipfs/' + hash
                });
            })
            .catch(e => {
                console.log(e);
                alert('Error: Something went wrong when uploading to IPFS. Please try agin later.');
            })
            .finally(() => this.setState({ uploading: false }));
    };

    renderWarning() {
        return (
            <div>
                <div>Upload anonymous (public) project into IPFS?</div>
                <br/>
                <div>- Be sure not to include personal data</div>
                <Note
                    title="Warning"
                    text="Due to the nature of IPFS, might not be possible to delete your project from the network."
                />
                <div className={style.buildInfo}>
                    <div className={style.title}>Include build information</div>
                    <div className={style.descContainer}>
                        <div>This will upload the content of your build folder</div>
                        <Switch
                            onChange={this.onChange}
                        />
                    </div>
                </div>


                <button className="btn2" onClick={this.ipfsSyncUp}>Share</button>
            </div>
        );
    }

    renderUploading() {
        return(
            <div>
                Uploading...
            </div>
        );
    }

    renderShareURL(shareURL) {
        return (
            <div className={style.share}>
                <TextInput
                    label="Share your project"
                    defaultValue={shareURL}
                    disabled={true}
                />
                <div>
                    <IconCopy />
                </div>
            </div>
        );
    }


    render() {
        const { uploading, shareURL } = this.state;
        return (
            <div className={style.shareDialogContainer}>
                { uploading ?
                    this.renderUploading()
                :
                    shareURL ?
                        this.renderShareURL(shareURL)
                    :
                        this.renderWarning()
                }
            </div>
        )
    }
}

export default ShareDialog;
