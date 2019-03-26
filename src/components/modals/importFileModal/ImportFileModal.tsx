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

import React, {Component} from 'react';
import classNames from 'classnames';
import style from './style.less';
import FileFinder from './sections/fileFinder/FileFinder';
import ImportCategory from './sections/importCategory';
import CodeEditor from './sections/descriptionArea/CodeEditor';
import SplitterLayout from 'react-splitter-layout';
import Description from './sections/descriptionArea/Description';

import data from '../../../assets/static/json/openzeppelin.json';
import {IDependenciesModel, ICategory, IProjectItem, ProjectItemTypes} from '../../../models';
import {generateUniqueId} from '../../../services/utils';
import ModalHeader from '../../common/modal/modalHeader';
import {insert} from '../../../reducers/utils';

interface IProps {
    parentId: string;
    importFiles(parentId: string, items: IProjectItem[]): void;
    hideModal(): void;
}

interface IState {
    selectedTitle: string;
    selectedSource: string;
    selectedPath: string;
    selectedDescription: string;
    selectedLogo: string;
    selectedDependencies: IDependenciesModel[];
    selectedCategoryID: number;
    categories: ICategory[];
}

export default class ImportFileModal extends Component<IProps, IState> {
    state: IState = {
        selectedTitle: '',
        selectedSource: '',
        selectedPath: '',
        selectedDescription: '',
        selectedLogo: '',
        selectedDependencies: [],
        selectedCategoryID: 0,
        categories: [{ id: 0,
            name: 'OpenZeppelin',
            description: 'The OpenZeppelin is a library for secure smart contract development.' +
                ' It provides implementations of standards like ERC20 and ERC721 which you can deploy as-is or extend to suit your needs, as well as Solidity components to build custom contracts and more complex decentralized systems.',
            logo: '/static/img/openzeppelin-solidity.svg'}],
    };
    constructor(props: IProps) {
        super(props);
    }

    componentWillMount() {
        // set default
        const {description, logo} = this.state.categories[0];

        this.setState({
            selectedDescription: description,
            selectedLogo: logo
        });
    }

    onCategorySelected(id: number, description: string, logo: string) {
        this.setState({
            selectedCategoryID: id,
            selectedDescription: description,
            selectedLogo: logo
        });
    }

    onFileSelected = (title: string, source: string, path: string, dependencies: IDependenciesModel[]) => {
        this.setState({
            selectedTitle: title,
            selectedSource: source,
            selectedPath: path,
            selectedDependencies: dependencies,
        });
    }

    onCloseClickHandle = () => {
        this.props.hideModal();
    }

    getSourceFromAbsolutePath = (absolutePath: any): string => {
        // remove first element from array
        const pathParts = absolutePath.split('/');
        let currentNode: any = data;
        let source: string = '';

        pathParts.map((part: any) => {
            if (currentNode && currentNode.children) {
                currentNode = currentNode.children.find((child: any) => child.name === part);
                if (currentNode.source) {
                    source = currentNode.source;
                }
            }
        });
        return source;
    }

    onImportClickHandle = () => {
        const {parentId, importFiles} = this.props;
        const {selectedDependencies, selectedPath, selectedSource} = this.state;

        const importPathArray = [];
        const importSourceArray: string[] = [];

        // Import selected contract file
        importPathArray.push(selectedPath.replace('/contracts', ''));
        importSourceArray.push(selectedSource);

        // Import dependencies if any
        selectedDependencies.forEach((dependency: IDependenciesModel) => {

            const path = dependency.absolutePath;

            importPathArray.push(path);

            // get source code for given dependency
            const source = this.getSourceFromAbsolutePath(path);
            importSourceArray.push(source);
        });

        // create array to be inserted into state
        const objectArray: IProjectItem[] = importPathArray
            .map((path: string) => path.startsWith('/') ? path : '/' + path)
            .map((path: any) => path.split('/').slice(1))
            .reduce((children: any, path: any, idx: any) => insert(children, path, importSourceArray[idx]), []);

        importFiles(parentId, objectArray);

        // Close modal
        this.onCloseClickHandle();
    }

    createPathArray = (pathString: string) => {
        const arr = pathString.split('/');
        arr.pop();
        return arr;
    }

    render() {
        const { categories, selectedCategoryID, selectedTitle, selectedSource, selectedDescription, selectedLogo } = this.state;

        return(
            <div className={classNames([style.importModal, 'modal'])}>
                <div className={style.container}>
                    <ModalHeader
                        className={style.header}
                        title='Import a Smart Contract'
                        onCloseClick={this.onCloseClickHandle}
                    />
                    <div className={style.area}>
                        <SplitterLayout
                            customClassName={style.draggableImport}
                            vertical={false}
                            percentage={true}
                            secondaryInitialSize={85}
                        >
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
                            <SplitterLayout
                                customClassName='secondPane'
                                percentage
                                secondaryInitialSize={70}
                                vertical={false}
                            >
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
                            <button onClick={this.onCloseClickHandle} className='btn2 noBg mr-2'>Cancel</button>
                            <button disabled={!selectedTitle} onClick={this.onImportClickHandle} className='btn2'>Import</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
