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
import {
    IconFolder,
    IconFolderOpen,
    IconAngleRight,
    IconAngleDown,
} from '../icons';
import style from './style.less';
import TreeFileItem from "./TreeFileItem";

export default class TreeFolderItem extends Component {
    constructor(props){
        super(props);
        this.state = {
           toggled:this.props.toggled ? this.props.toggled : false,
           level: this.props.level ? this.props.level : 0
        };
        this.toggleMenu = this.toggleMenu.bind(this);
    }

    toggleMenu() {
        const { toggled } = this.state;
        this.setState({
            toggled: !toggled
        });
    }

    render() {
        const {toggled, level} = this.state;

        const { name, children, onFileSelected, selectedTitle } = this.props;

        const levelNumber = `level${level}`;

        return (
            <div className={style.treeItem} >
                <div className={style.treeItemContainer} onClick={this.toggleMenu}>
                    <div className={`${style.header} ${style[levelNumber]}`}>
                        <div className={style.icons}>
                            <div className={style.caret} >
                                {toggled ? <IconAngleDown className={style.angleDown}/> : <IconAngleRight className={style.angleRight}/>}
                            </div>
                            <div className={style.icon}>
                                {toggled ? <IconFolderOpen/> : <IconFolder/>}
                            </div>
                        </div>
                        <div className={style.title}>
                            <a>{name}</a>
                        </div>
                    </div>
                </div>
                <div className={`${!toggled ? style.collapsed: ''} ${style.treeItemContainer}`}>
                    {children.map(child => {
                        const {name, id, children, source, path, dependencies} = child;

                        if (children) {
                            return <TreeFolderItem name={name} children={children} level={Number(level)+1} key={id} onFileSelected={onFileSelected} selectedTitle={selectedTitle}/>
                        } else {
                            return <TreeFileItem name={name} source={source} path={path} dependencies={dependencies} level={Number(level)+1} key={id} onFileSelected={onFileSelected} selectedTitle={selectedTitle}/>
                        }
                    })}
                </div>
            </div>
        );
    }
}



