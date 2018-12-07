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
import sha256 from 'crypto-js/sha256';
import style from './style-console.less';
import Toolbar from './toolbar';

export default class Compiler extends Component {

    state = {
        status: "",
        consoleRows: [],
        isRunning: false
    }

    constructor(props) {
        super(props);
        this.id = props.id + '_compiler';
        this.props.parent.childComponent = this;
    }

    componentDidMount() {
        this.run();
    }

    focus = rePerform => {
        if (rePerform) {
            if (!this.state.isRunning) {
                this.run();
            }
        }
    };

    callback = status => {
        const callback = this.props.parent.callback;
        delete this.props.parent.callback;
        if (callback) callback(status);
    };

    _makeFileName = (path, suffix) => {
        const a = path.match(/^(.*\/)([^/]+)$/);
        const dir = a[1];
        const filename = a[2];
        const a2 = filename.match(/^(.+)[.][Ss][Oo][Ll]$/);
        const contractName = a2[1];
        return (
            '/build' + dir + contractName + '/' + contractName + '.' + suffix
        );
    };

    run = e => {
        if (e) {
            e.preventDefault();
            e.stopPropagation(); // Don't auto focus on the window.
        }
        if (this.state.isRunning) return;

        this.setState({
            isRunning: true,
            consoleRows: []
        });

        const contracts = this.props.item
            .getProject()
            .getHiddenItem('contracts')
            .getChildren();

        // TODO:
        // Load all addresses for all contracts, it they are available, to provide them as libraries.
        // If the resulting compilation contains linkReference then we must throw an error.

        // Load all contract source files.
        const sources = [];
        for (var index = 0; index < contracts.length; index++) {
            sources.push(contracts[index].getSource());
        }

        this._loadFiles(
            sources,
            (status, bodies) => {
                if (status != 0) {
                    alert(
                        'Could not load contract source code. Is there any contract not saved?'
                    );
                    this.setState({
                        isRunning: false
                    });
                    return;
                }
                // This timeout can be removed.
                setTimeout(() => {
                    var contractbody;
                    this._updateConsole({
                        channel: 1,
                        msg:
                            'Using Solidity compiler version ' +
                            this.props.functions.compiler.getVersion(),
                    });
                    // Run through all sources loaded and chose one for compilation and the rest for import.
                    // https://solidity.readthedocs.io/en/develop/using-the-compiler.html#compiler-input-and-output-json-description
                    const input = {
                        language: 'Solidity',
                        sources: {},
                        settings: {
                            optimizer: {
                                enabled: false,
                                runs: 200,
                            },
                            evmVersion: 'byzantium',
                            libraries: {},
                            outputSelection: {
                                '*': {
                                    '*': [
                                        'metadata',
                                        'evm.bytecode',
                                        'evm.gasEstimates',
                                    ],
                                },
                            },
                        },
                    };
                    const files = {};
                    const srcfilename = this.props.item.getParent().getSource();
                    for (var index = 0; index < contracts.length; index++) {
                        const source = contracts[index].getSource();
                        // We only put the contract to be compiled in sources.
                        if (source == srcfilename) {
                            //srcfilename=contracts[index].source;
                            contractbody = bodies[index];
                            input.sources[source] = { content: bodies[index] };
                        } else {
                            // Every other source file we put in files, to be importable.
                            files[source] = bodies[index];

                            // TODO: handle libraries
                            // We want to check if this is a library contract and then add it here.
                            //const address="0xabbaabbabbaabbabbaabbabbaabbaaaaabbaabba";
                            //const contractname=contracts[index].name;
                            //input.settings.libraries[filename]={};
                            //input.settings.libraries[filename][contractname]=address;
                        }
                    }

                    const abisrc = this._makeFileName(srcfilename, 'abi');
                    const metasrc = this._makeFileName(srcfilename, 'meta');
                    const binsrc = this._makeFileName(srcfilename, 'bin');
                    const hashsrc = this._makeFileName(srcfilename, 'hash');
                    const delFiles = () => {
                        this.callback(1);
                        // Removed for now, if added back then all compile files should be deleted?
                        //const project = this.props.item.getProject();

                        //project.deleteFile(abisrc, () => {
                        //project.deleteFile(binsrc, () => {
                        //this.props.router.control.redrawMain(true);
                        //this.callback(1);
                        //});
                        //});
                    };

                    this.props.functions.compiler.queue(
                        { input: JSON.stringify(input), files: files },
                        data => {
                            if (data) data = JSON.parse(data);
                            if (!data) {
                                [
                                    'Sorry! We hit a compiler internal error. Please report the problem and in the meanwhile try using a different browser.',
                                ].map(row => {
                                    this._updateConsole({
                                        channel: 3,
                                        msg: row.formattedMessage,
                                    });
                                });
                                // Clear ABI and BIN
                                delFiles();
                            } else {
                                (data.errors || []).map(row => {
                                    if (row.severity === 'warning') {
                                        this._updateConsole({
                                            channel: 3,
                                            msg: row.formattedMessage,
                                        });
                                    } else {
                                        this._updateConsole({
                                            channel: 2,
                                            msg: row.formattedMessage,
                                        });
                                    }
                                });
                                if (
                                    !data.contracts ||
                                    Object.keys(data.contracts).length == 0
                                ) {
                                    this._updateConsole({
                                        channel: 2,
                                        msg: '[ERROR] Ate bad code and died, compilation aborted.',
                                    });
                                    // Clear ABI and BIN
                                    delFiles();
                                } else {
                                    var contractObj;
                                    const filename = srcfilename.match(
                                        '.*/(.*)$'
                                    )[1];
                                    if (data.contracts)
                                        contractObj =
                                            data.contracts[srcfilename][
                                                this.props.item
                                                    .getParent()
                                                    .getName()
                                            ];
                                    if (
                                        contractObj &&
                                        Object.keys(
                                            contractObj.evm.bytecode
                                                .linkReferences || {}
                                        ).length > 0
                                    ) {
                                        contractObj = null;
                                        this._updateConsole({
                                            channel: 2,
                                            msg:
                                                '[ERROR] The contract ' +
                                                srcfilename +
                                                ' references library contracts. Superblocks Lab does not yet support library contract linking, only contract imports.',
                                        });
                                        delFiles();
                                    } else if (contractObj && contractObj.metadata) {
                                        var metadata;
                                        try {
                                            metadata = JSON.parse(
                                                contractObj.metadata
                                            );
                                        }
                                        catch(e) {
                                            console.error("Could not parse compiler output", contractObj);
                                            this._updateConsole({
                                                channel: 2,
                                                msg:
                                                    '[ERROR] The contract ' +
                                                    srcfilename +
                                                    ' could not be compiled.',
                                            });
                                            this.callback(1);
                                            return;
                                        }

                                        // Save ABI and BIN
                                        // First load, then save and close.
                                        const cb = (
                                            fullPath,
                                            contents,
                                            cb2
                                        ) => {
                                            const a = fullPath.match(
                                                '^(.*/)([^/]+)$'
                                            );
                                            const path = a[1];
                                            const file = a[2];
                                            const project = this.props.item.getProject();

                                            project.newFile(path, file, () => {
                                                //if (path[path.length-1] != '/') {
                                                //path = path + "/";
                                                //}
                                                //const fullPath = path + file;
                                                project
                                                    .getItemByPath(
                                                        fullPath.split('/'),
                                                        project
                                                    )
                                                    .then(item => {
                                                        item.setContents(
                                                            contents
                                                        );
                                                        item.save()
                                                            .then(cb2)
                                                            .catch(delFiles);
                                                    })
                                                    .catch(() => {
                                                        delFiles();
                                                    });
                                            });
                                        };

                                        cb(
                                            abisrc,
                                            JSON.stringify(metadata.output.abi, null, 4),
                                            () => {
                                                const meta = {
                                                    compile: {
                                                        gasEstimates:
                                                            contractObj.evm
                                                                .gasEstimates,
                                                    },
                                                };
                                                cb(
                                                    metasrc,
                                                    JSON.stringify(meta, null, 4),
                                                    () => {
                                                        cb(
                                                            binsrc,
                                                            '0x' +
                                                                contractObj.evm
                                                                    .bytecode
                                                                    .object,
                                                            () => {
                                                                const hash = sha256(contractbody).toString();
                                                                cb (hashsrc,
                                                                    hash,
                                                                    () => {
                                                                        // This is the success exit point.
                                                                        this.props.router.control.redrawMain(
                                                                            true
                                                                        );
                                                                        this._updateConsole({
                                                                                channel: 1,
                                                                                msg:
                                                                                    'Success in compilation',
                                                                            }
                                                                        );
                                                                        this.callback(0);
                                                                    }
                                                                );
                                                            }
                                                        );
                                                    }
                                                );
                                            }
                                        );
                                    } else {
                                        if (data.contracts) {
                                            this._updateConsole({
                                                channel: 2,
                                                msg:
                                                    '[ERROR] The contract ' +
                                                    srcfilename +
                                                    ' could not be compiled. The contract is not found in the compiled output. Make sure the contract is configured correctly so that the name matches the (main) contract in the source file.',
                                            });
                                        } else {
                                            this._updateConsole({
                                                channel: 2,
                                                msg:
                                                    '[ERROR] The contract ' +
                                                    srcfilename +
                                                    ' could not be compiled.',
                                            });
                                        }
                                        delFiles();
                                    }
                                }
                            }
                            this.setState({
                                isRunning: false
                            })
                        }
                    );
                }, 1);
            },
            true
        );
    };

    _loadFiles = (files, cb) => {
        const project = this.props.item.getProject();
        const bodies = [];
        var fn;
        fn = (files, bodies, cb2) => {
            if (files.length == 0) {
                cb2(0);
                return;
            }
            const file = files.shift();
            const pathArray = file.split('/');
            project
                .getItemByPath(pathArray, project)
                .then(item => {
                    item.load()
                        .then(() => {
                            bodies.push(item.getContents());
                            fn(files, bodies, status => {
                                cb(status, bodies);
                            });
                        })
                        .catch(() => {
                            console.log('could not load file', file);
                            cb(1);
                        });
                })
                .catch(() => {
                    console.log('could not find file', file);
                    cb(1);
                });
        };
        fn(files, bodies, status => {
            cb(status, bodies);
        });
    };

    _updateConsole(row) {
        this.setState(prevState => ({
            consoleRows: [...prevState.consoleRows, row]
          }))
    }

    renderToolbar = () => {
        const { isRunning, status } = this.state;
        const { item } = this.props;
        return (
            <Toolbar
                id={this.id}
                status={status}
                contractPath={item.getParent().getSource()}
                onTriggerActionClick={this.run}
                isRunning={isRunning}
                iconTitle="Recompile"
                infoTitle="compile"
            />
        );
    };

    getHeight = () => {
        const a = document.getElementById(this.id);
        const b = document.getElementById(this.id + '_header');
        if (!a) return 99;
        return a.offsetHeight - b.offsetHeight;
    };

    getWait = () => {
        if (this.state.consoleRows.length == 0) {
            return (
                <div className={style.loading}>
                    <span>Loading...</span>
                </div>
            );
        }
    };

    renderContents = () => {
        const waiting = this.getWait();
        const scrollId = 'scrollBottom_' + this.props.id;

        return (
            <div className={style.console}>
                <div className={style.terminal} id={scrollId}>
                    { waiting }
                    { this.state.consoleRows.map((row, index) => {
                        return row.msg.split('\n').map((line, lineIndex) => {
                            var cl = style.std1;
                            if (row.channel == 2) cl = style.std2;
                            else if (row.channel == 3) cl = style.std3;
                            return <div key={index + lineIndex} className={cl}>{line}</div>;
                        });
                    })}
                </div>
            </div>
        );
    };

    render() {
        const toolbar = this.renderToolbar();
        const contents = this.renderContents();
        const height = this.getHeight();
        const maxHeight = {
            height: height + 'px',
        };
        return (
            <div className="full" id={this.id}>
                {toolbar}
                <div
                    id={this.id + '_scrollable'}
                    className="scrollable-y"
                    style={maxHeight}
                >
                    {contents}
                </div>
            </div>
        );
    }
}
