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
import ImportCategory from "./sections/importCategory";
import CodeEditor from "./sections/descriptionArea/CodeEditor";
import SplitterLayout from 'react-splitter-layout';
import Description from "./sections/descriptionArea/Description";

import './react-splitter-layout.css';

import data from '../../assets/static/json/openzeppelin.json';

export default class ImportFileModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedTitle: "",
            selectedSource: "",
            selectedPath: "",
            selectedDescription: "",
            selectedLogo: null,
            selectedDependencies: [],
            selectedCategoryID: 0,
            categories: [{ id: 0, name: "OpenZeppelin", description: "The OpenZeppelin is a library for secure smart contract development. It provides implementations of standards like ERC20 and ERC721 which you can deploy as-is or extend to suit your needs, as well as Solidity components to build custom contracts and more complex decentralized systems.", logo: "/static/img/openzeppelin-solidity.svg"}],
        }
    };

    componentWillMount() {
        // set default
        const {description, logo} = this.state.categories[0];

        this.setState({
            selectedDescription: description,
            selectedLogo: logo
        })
    }

    onCategorySelected(id, description, logo) {
        this.setState({
            selectedCategoryID: id,
            selectedDescription: description,
            selectedLogo: logo
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

            const {project, context} = this.props;
            const {selectedDependencies, selectedTitle, selectedPath, selectedSource} = this.state;

            let baseFolder = "";
            let selectedModifiedPath = "";

            if (context.getFullPath() === "/") {
                // if root folder, import to contracts folder
                baseFolder = "/contracts/";
                selectedModifiedPath = selectedPath;
            } else {
                // else import to selected folder
                baseFolder = context.getFullPath().concat("/");
                selectedModifiedPath = selectedPath.replace("/contracts/", baseFolder);
            }

            try {

                // add selected file
                // NOTE: this depends on that backend.js is saving files synchronously, as it currently is.
                this.addFilesToProject(project, selectedTitle, selectedModifiedPath, selectedSource);

                // add dependencies
                selectedDependencies.map((dependency) => {

                    const file = dependency.fileName;
                    const path = dependency.absolutePath;
                    const browserPath = baseFolder.concat(path);
                    const source = this.getSourceFromAbsolutePath(path);

                    this.addFilesToProject(project, file, browserPath, source, context);

                    });

            } catch (e) {
                // ignore error
            } finally {
                // close the modal
                this.onCloseClickHandle();
            }

    };

    addFilesToProject = (project, file, browserPath, source) => {
        if (file) {
            if (!file.match('(^[a-zA-Z0-9-_.]+[/]?)$') || file.length > 255) {
                alert('Illegal file name. Only A-Za-z0-9, dash (-) and underscore (_) allowed. Max 255 characters.');
                return false;
            }
            project.newFile(browserPath, file, status => {
                if (status === 0) {
                    project.saveFile(browserPath, source, operation => {
                        if (operation.status === 0){
                            let pathArray = this.createPathArray(browserPath);
                            project.getItemByPath(pathArray, project).then((context) => {
                                context.getChildren(true, () => {
                                    context.redrawMain(true);
                                });
                            })
                        } else {
                            alert('An error has occured.', status);
                        }

                    })
                } else {
                    status === 3 ? alert('A file or folder with that name already exists at this location.', status) : alert('Could not create the file.', status);
                }
            });
            this.onCloseClickHandle();
        } else {
            alert('A file must be selected');
        }
    };

    createPathArray = (pathString) => {
        let arr = pathString.split("/");
        arr.pop();
        return arr;
    };

    render() {
        const { categories, selectedCategoryID, selectedTitle, selectedSource, selectedDescription, selectedLogo } = this.state;

        return(
            <div className={classNames([style.importModal, "modal"])}>
                <div className={style.container}>
                    <ModalHeader
                        classname={style.header}
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
                                            <li key={category.id} className={selectedCategoryID === category.id ? style.selected : null}>
                                                <ImportCategory
                                                    title={category.name}
                                                    onCategorySelected={() => this.onCategorySelected(category.id, category.description, category.logo)}/>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                            <SplitterLayout customClassName="secondPane" percentage secondaryInitialSize={70} vertical={false} >
                            <div className={style.finderArea}>
                                <div className={style.title}>Files</div>
                                <FileFinder onFileSelected={this.onFileSelected} selectedTitle={selectedTitle}/>
                            </div>
                            <div className={style.descriptionArea}>
                                <div>
                                    { selectedTitle
                                        ? <CodeEditor source={selectedSource} selectedTitle={selectedTitle}/>
                                        : <Description selectedDescription={selectedDescription} selectedLogo={selectedLogo}/>
                                    }
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
};
