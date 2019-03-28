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
import MonacoEditor from 'react-monaco-editor';
import style from "../../style.less";

export default class CodeEditor extends Component {
    constructor(props) {
        super(props);
    }

    editorDidMount(editor, monaco) {
        editor.focus();
    }

    render() {
        const options = {
            selectOnLineNumbers: false,
            readOnly: true,
            automaticLayout: true,
        };

        const selectedTitle = this.props.selectedTitle;

        return (
            <div>
                <div className={style.title}>{selectedTitle}&nbsp;</div>
                <MonacoEditor
                    height="400"
                    language="sol"
                    theme="vs-dark"
                    value={this.props.source}
                    options={options}
                    onChange={this.onChange}
                    editorDidMount={this.editorDidMount}
                />
            </div>
        );
    }
}



