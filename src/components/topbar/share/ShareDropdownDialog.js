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
import Note from '../../note';
import Switch from '../../switch';

class ShareDropdownDialog extends Component {
    onChange = (e, checked) => {
        e.stopPropagation();
    }

    render() {
        return (
            <div className={style.shareDialogContainer}>
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


                <button className="btn2">Share</button>
            </div>
        )
    }
}

export default ShareDropdownDialog;
