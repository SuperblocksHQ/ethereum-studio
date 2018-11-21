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
import { Treebeard, decorators } from 'react-treebeard';
import {
    IconContract,
    IconFolder,
} from '../../../icons';
import style from './style.less';
import Theme from './theme';
import data from '../../../../assets/static/json/openzeppelin.json';

export default class FileFinder extends Component {
    constructor(props){
        super(props);
        this.state = {
            cursor: "",
            prevNode: ""
        };
        this.onToggle = this.onToggle.bind(this);
    }

    onToggle(node, toggled) {
        // Store previous node & de-activate
        if (this.state.prevNode !== '') {
            let stateUpdate = Object.assign({}, this.state);
            stateUpdate.prevNode.active = false;
            this.setState(stateUpdate);
        }
        this.setState({prevNode: node});

        // Activate new node
        node.active = true;
        if(node.children) {
            node.toggled = toggled;
        }
        this.setState({cursor: node});

        // only update if a file is selected
        const isFolder = !node.children;

        isFolder && this.props.onFileSelected(node.name, node.source);
    }

    render() {
        const decorator =  {
            Header: ({style, node}) => {
                const isFolder = !node.children;
                const activeBackground = this.state.cursor.id === node.id ? '#8641f2' : '';
                const activeColor = this.state.cursor.id === node.id ? '#FFF' : '';

                return (
                    <div style={{...style.base, ...{background: activeBackground}}}>
                        <div style={{...style.title, ...{color: activeColor}}}>
                            {
                                isFolder
                                    ? <IconContract/>
                                    : <IconFolder/>
                            }
                            {node.name}
                        </div>
                    </div>
                );
            }
        };

        return (
            <div className={style.container}>
                <Treebeard data={data}
                           decorators={{...decorators, Header: decorator.Header}}
                           onToggle={this.onToggle}
                           style={Theme}/>
            </div>
        );
    }
}



