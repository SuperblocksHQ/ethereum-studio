// Copyright 2019 Superblocks AB
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
import style from './style-editor.less';
import classnames from 'classnames';
import MonacoEditor from 'react-monaco-editor';
import { IProjectItem } from '../../../../models';
import { EditorToolbar } from './editorToolbar';
import { isSmartContract, getFileExtension, isMarkdown } from '../../../../utils/file';
import { MarkdownPreview } from './markdownPreview';
import { getItemPath } from '../../../../reducers/explorerLib';

interface IProps {
    file: IProjectItem;
    tree: IProjectItem;
    visible: boolean;
    hasUnsavedChanges: boolean;
    onSave: (fileId: string, code: string) => void;
    onUnsavedChange: (fileId: string, hasUnsavedChanges: boolean, code: any) => void;
}

interface IState {
    hasUnsavedChanges: boolean;
    showMarkdownPreview: boolean;
}

const langmap: any = {
    js: 'javascript',
    sh: 'shell',
    bash: 'shell',
    md: 'markdown',
};

const requireConfig = {
    paths: { vs: 'vs' },
    url: '/vs/loader.js',
    baseUrl: '/'
};

export class FileEditor extends React.Component<IProps, IState> {
    language: string = '';
    options: any = {};
    code: string = '';
    contractSource: string = '';

    constructor(props: IProps) {
        super(props);

        this.state = {
            hasUnsavedChanges: false,
            showMarkdownPreview: true
        };

        const suffix = getFileExtension(props.file.name);
        if (suffix) {
            this.language = langmap[suffix] ? langmap[suffix] : suffix;
        }

        this.options = {
            selectOnLineNumbers: true,
            readOnly: !this.props.file.mutable,
            folding: 'true',
            foldingStrategyif: 'indentation',
            automaticLayout: 'true',
        };

        this.code = props.file.code || '';
        this.contractSource = getItemPath(props.tree, props.file);
    }

    componentDidUpdate(prevProps: IProps) {
        const monaco: any = this.refs.monaco;
        if (monaco) {
            monaco.editor.layout();

            if (this.props.visible && !prevProps.visible) {
                setTimeout(() => monaco.editor.focus(), 100);
            }
        }
    }

    editorDidMount = (editor: any, monacoObj: any) => {
        editor.addCommand(monacoObj.KeyMod.CtrlCmd | monacoObj.KeyCode.KEY_S, this.onSave);
        editor.focus();
    }

    onFileChange = (value: string) => {
        this.code = value;
        const hasUnsavedChanges = this.code !== this.props.file.code;
        // TODO cleaner redux log
        this.props.onUnsavedChange(this.props.file.id, hasUnsavedChanges, value);
    }

    onSave = () => {
        this.props.onSave(this.props.file.id,  this.code);
    }

    toggleMarkdownPreview = () => {
        this.setState({
            showMarkdownPreview: !this.state.showMarkdownPreview
        });
    }

    render() {
        const { file, visible, hasUnsavedChanges } = this.props;
        const { showMarkdownPreview } = this.state;

        return (
            <div className={classnames(style.fileEditorContainer, { [style.visible]: visible })}>
                <EditorToolbar
                    isSmartContract={isSmartContract(file.name)}
                    hasUnsavedChanges={hasUnsavedChanges}
                    onSave={this.onSave}
                    isMarkdown={isMarkdown(file.name)}
                    showMarkdownPreview={showMarkdownPreview}
                    onShowMarkdownPreview={ () => this.toggleMarkdownPreview()} />

                { isMarkdown(file.name) && showMarkdownPreview
                    ?
                        <MarkdownPreview markdown={file.code} />
                    :
                        <MonacoEditor
                            ref='monaco'
                            language={this.language}
                            theme='vs-dark'
                            defaultValue={file.code}
                            value={file.code}
                            options={this.options}
                            onChange={this.onFileChange}
                            editorDidMount={this.editorDidMount}
                            requireConfig={requireConfig}
                            automaticLayout={true}
                            height='calc(100% - 42px)'
                        />
                }
            </div>
        );
    }
}
