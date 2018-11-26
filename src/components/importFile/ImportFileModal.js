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
import SplitterLayout from 'react-splitter-layout';

import './react-splitter-layout.css';

import data from '../../assets/static/json/openzeppelin.json';

export default class ImportFileModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedTitle: "",
            selectedSource: "",
            selectedPath: "",
            selectedDependencies: [],
            categorySelectedId: 0,
            categories: [{ id: 0, name: "OpenZeppelin" }]
        }
    };

    onCategorySelected(id) {
        this.setState({
            categorySelectedId: id
        })
    };

    onFileSelected = (title, source, selectedPath, dependencies) => {
        this.setState({
            selectedTitle: title,
            selectedSource: source,
            selectedPath: selectedPath,
            selectedDependencies: dependencies
        });
    };

    getSourceFromAbsolutePath = (absolutePath) => {
        // remove first element from array
        const pathParts = absolutePath.split("/");
        let currentNode = data;
        let source = "";

        pathParts.map(part => {
            if (currentNode && currentNode.children) {
                currentNode = currentNode.children.find(child => child.name === part);
                if (currentNode.source) {
                    source = currentNode.source
                }
            }
        });
        return source;
    };

    onCloseClickHandle = () => {
        this.props.onCloseClick();
    };

    onImportClickHandle = () => {

            const project = this.props.project;
            const {selectedDependencies, selectedTitle, selectedPath, selectedSource} = this.state;

            try {

                // add selected file
                this.addFilesToProject(project, selectedTitle, selectedPath, selectedSource);

                // add dependencies
                selectedDependencies.map((dependency) => {

                    const file = dependency.fileName;
                    const path = dependency.absolutePath;
                    const browserPath = "/contracts/".concat(path);
                    const source = this.getSourceFromAbsolutePath(path);

                    this.addFilesToProject(project, file, browserPath, source);

                    });

            } catch (e) {
                // triggered if file with existing filename is imported
            }

    };

    addFilesToProject = (project, file, browserPath, source) => {
        if (file) {
            if (!file.match('(^[a-zA-Z0-9-_.]+[/]?)$') || file.length > 255) {
                alert('Illegal file name. Only A-Za-z0-9, dash (-) and underscore (_) allowed. Max 255 characters.');
                return false;
            }
            project.newFile(browserPath, file, status => {
                if (status == 0) {
                    project.saveFile(browserPath, source, operation => {
                        if (operation.status == 0){
                            //@TODO figure out redraw
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
                        <SplitterLayout customClassName={style.draggableImport} horizontal={true} percentage secondaryInitialSize={85}>
                            <div className={style.categoriesArea}>
                                <div className={style.title}>Categories</div>
                                <div className={style.categoriesContainer}>
                                    <ul>
                                        {categories.map(category =>
                                            <li key={category.id} className={categorySelectedId === category.id ? style.selected : null}>
                                                <ImportCategory
                                                    title={category.name}
                                                    onCategorySelected={() => this.onCategorySelected(category.id)}/>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                            <SplitterLayout customClassName="secondPane" percentage secondaryInitialSize={70} vertical={false} >
                            <div className={style.finderArea}>
                                <div className={style.title}>Files</div>
                                <FileFinder onFileSelected={this.onFileSelected}/>
                            </div>
                            <div className={style.descriptionArea}>
                                <div className={style.title}>{selectedTitle}&nbsp;</div>
                                <div>
                                    <CodeEditor source={selectedSource}/>
                                </div>
                            </div>
                            </SplitterLayout>
                        </SplitterLayout>
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
