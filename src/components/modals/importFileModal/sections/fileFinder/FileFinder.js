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
import style from './style.less';
import { Loading } from "../../../../common";
import Loadable from 'react-loadable';

const openZeppelinJson = () => import(/* webpackChunkName: "openzeppelin.json" */ "../../../../../assets/static/json/openzeppelin.json");

const FolderTree = Loadable({
    loader: () => import(/* webpackChunkName: "FolderTree" */"../../../../folderTree/FolderTree"),
    loading: Loading,
});

export default class FileFinder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
        };
    }

    componentDidMount() {
        openZeppelinJson().then((asyncData) => {
           this.setState({
               data: asyncData.default,
           });
       });
    }

    render() {
        const {onFileSelected, selectedTitle} = this.props;
        const { data } = this.state;

        return (
            <div className={style.container}>
                {data !== null &&
                <FolderTree data={data} onFileSelected={onFileSelected} selectedTitle={selectedTitle}/>
                }
            </div>
        );
    }

}
