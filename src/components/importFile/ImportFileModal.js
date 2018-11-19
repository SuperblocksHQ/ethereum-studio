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
import Proptypes from 'prop-types';
import classNames from 'classnames';
import style from './style.less';
import ModalHeader from '../modal/modalHeader';
import FileFinder from "./sections/fileFinder/FileFinder";
import ImportCategory from "./ImportCategory";
import CodeEditor from "./sections/codeEditor/CodeEditor";

export default class ImportFileModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedTitle: "",
            selectedSource: "",
            categorySelectedId: 0,
            categories: [{ id: 0, name: "OpenZeppelin" }]
        }
    }

    onCategorySelected(id) {
        console.log("category selected")
        this.setState({
            categorySelectedId: id
        })
    }

    onFileSelected = (title, source) => {
        this.setState({
            selectedTitle: title,
            selectedSource: source
        })
    }

    onCloseClickHandle = () => {
        this.props.onCloseClick();
    }

    onImportClickHandle = () => {

            const project = this.props.project;
            const file = this.state.selectedTitle;
            const source = this.state.selectedSource;

            const path = "/"

            if (file) {
                if (!file.match('(^[a-zA-Z0-9-_.]+[/]?)$') || file.length > 255) {
                    alert('Illegal file name. Only A-Za-z0-9, dash (-) and underscore (_) allowed. Max 255 characters.');
                    return false;
                }
                project.newFile(path, file, status => {
                    if (status == 0) {
                        project.saveFile(`${path}${file}`, source, operation => {
                            if (operation.status == 0){
                               project.redraw()
                            } else {
                                alert('An error has occured.', status);
                            }

                        })
                    } else {
                        status == 3 ? alert('A file or folder with that name already exists at this location.', status) : alert('Could not create the file.', status);
                    }
                });
                this.onCloseClickHandle();
            } else {
                alert('A file must be selected');
            }

    };

    render() {
        const { categories, categorySelectedId, selectedTitle, selectedSource } = this.state;

        return(
            <div className={classNames([style.importModal, "modal"])}>
                <div className={style.container}>
                    <ModalHeader
                        title="Import a Smart Contract"
                        onCloseClick={this.onCloseClickHandle}
                    />
                    <div className={style.area}>
                        <div className={style.categoriesArea}>
                            <div className={style.title}>Categories</div>
                            <div className={style.categoriesContainer}>
                                <ul>
                                    {
                                        categories.map(category =>
                                            <li key={category.id} className={categorySelectedId == category.id ? style.selected : null}>
                                                <ImportCategory
                                                    title={category.name}
                                                    onCategorySelected={() => this.onCategorySelected(category.id)}/>
                                            </li>
                                        )
                                    }
                                </ul>
                            </div>
                        </div>
                        <div className={style.finderArea}>
                            <div className={style.title}>Files</div>
                            <FileFinder onFileSelected={this.onFileSelected}/>
                        </div>
                        <div className={style.descriptionArea}>
                            <div className={style.title}>{selectedTitle}</div>
                            <div>
                                <CodeEditor source={selectedSource}/>
                            </div>
                        </div>
                    </div>
                    <div className={style.footer}>
                        <div className={style.buttonsContainer}>
                            <button onClick={this.onCloseClickHandle} className="btn2 noBg mr-2">Cancel</button>
                            <button disabled={!selectedTitle} onClick={this.onImportClickHandle} className="btn2">Import</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ImportFileModal.proptypes = {
    onCloseClick: Proptypes.func.isRequired,
    savePreferences: Proptypes.func.isRequired
}
