// Copyright 2018 Superblocks AB
//
// This file is part of Superblocks Studio.
//
// Superblocks Studio is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.
//
// Superblocks Studio is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Superblocks Studio.  If not, see <http://www.gnu.org/licenses/>.

import { h, Component } from 'preact';
import sha256 from 'crypto-js/sha256';
import classnames from 'classnames';
import style from './style-console';
import FaIcon  from '@fortawesome/react-fontawesome';
import iconRun from '@fortawesome/fontawesome-free-solid/faBolt';

export default class Compiler extends Component {
    constructor(props) {
        super(props);
        this.id=props.id+"_compiler";
        this.props.parent.childComponent=this;
        this.setState({status:"Space Invaders ready."});
        this.consoleRows=[];
        const projectname=this.props.project.props.state.dir;
        this.dappfile = this.props.project.props.state.data.dappfile;
        this.run();
    }

    componentWillUnmount = () => {
    };

    componentWillReceiveProps(props) {
        this.dappfile = props.project.props.state.data.dappfile;
    }

    canClose = (cb) => {
        cb(0);
    };

    focus = (rePerform) => {
        if(rePerform) {
            if(!this.isRunning) {
                this.run();
            }
        }
    };

    callback = (status) => {
        const callback=this.props.parent.callback;
        delete this.props.parent.callback;
        if(callback) callback(status);
    };

    _makeFileName=(path, tag, suffix)=>{
        const a = path.match(/^(.*\/)([^/]+)$/);
        const dir=a[1];
        const filename=a[2];
        return dir + "." + filename + "." + tag + "." + suffix;
    };

    run = (e) => {
        if(e) {
            e.preventDefault();
            e.stopPropagation();  // Don't auto focus on the window.
        }
        if(this.isRunning) return;
        this.isRunning=true;
        this.setState({status:"Space Invaders chewing source code..."});
        this.redraw();

        const contracts=this.dappfile.contracts();

        // TODO:
        // Load all addresses for all contracts, it they are available, to provide them as libraries.
        // If the resulting compilation contains linkReference then we must throw an error.

        // Load all contract source files.
        const sources=[];
        for(var index=0;index<contracts.length;index++) {
            sources.push(contracts[index].source);
        }

        this._loadFiles(sources, (status, bodies) => {
            if(status!=0) {
                alert("Could not load contract source code. Contract not saved?");
                this.setState({status:"Space Invaders could not find the true meaning of life and dissolved into pixels... To become a higher being."});
                this.isRunning=false;
                return;
            }
            this.consoleRows.length=0;
            // We have a short delay to show the nice Space Invaders image.
            setTimeout(()=>{
                var srcfilename;
                var contractbody;
                // Run through all sources loaded and chose one for compilation and the rest for import.
                // https://solidity.readthedocs.io/en/develop/using-the-compiler.html#compiler-input-and-output-json-description
                const input={
                    language: "Solidity",
                    sources: {},
                    settings: {
                        optimizer: {
                            enabled: false,
                            runs: 200
                        },
                        evmVersion: "byzantium",
                        libraries: {
                        },
                        outputSelection: {
                            "*": {
                                "*": ["metadata", "evm.bytecode", "evm.gasEstimates"]
                            }
                        }
                    }
                };
                const files={};
                for(var index=0;index<contracts.length;index++) {
                    const filename=contracts[index].source.match(".*/(.*)$")[1];
                    // We only put the contract to be compiled in sources.
                    if(contracts[index].name == this.props.contract) {
                        srcfilename=contracts[index].source;
                        contractbody=bodies[index];
                        input.sources[filename]={content:bodies[index]};
                    }
                    else {
                        // Every other source file we put in files, to be importable.
                        files[filename]=bodies[index];

                        // TODO: handle libraries
                        // We want to check if this is a library contract and then add it here.
                        //const address="0xabbaabbabbaabbabbaabbabbaabbaaaaabbaabba";
                        //const contractname=contracts[index].name;
                        //input.settings.libraries[filename]={};
                        //input.settings.libraries[filename][contractname]=address;
                    }
                }

                const env=this.props.project.props.state.data.env;
                const abisrc=this._makeFileName(srcfilename, env, "abi");
                const metasrc=this._makeFileName(srcfilename, env, "meta");
                const binsrc=this._makeFileName(srcfilename, env, "bin");
                const hashsrc=this._makeFileName(srcfilename, env, "hash");
                const delFiles=()=>{
                    this.props.project.deleteFile(abisrc, ()=>{
                        this.props.project.deleteFile(binsrc, ()=>{
                            this.props.router.control._reloadProjects();
                            this.callback(1);
                        });
                    });
                };

                this.props.functions.compiler.queue({input:JSON.stringify(input), files:files}, (data)=>{
                    if(data) data=JSON.parse(data);
                    if(!data) {
                        this.setState({status:"Space Invaders shot down."});
                        (["Sorry! We hit a compiler internal error. Please report the problem and in the meanwhile try using a different browser."]).map((row)=>{
                            this.consoleRows.push({channel:3,msg:row.formattedMessage});
                        });
                        // Clear ABI and BIN
                        delFiles();
                    }
                    else {
                        (data.errors || []).map((row)=>{
                            this.consoleRows.push({channel:3,msg:row.formattedMessage});
                        });
                        if(!data.contracts || Object.keys(data.contracts).length==0) {
                            this.setState({status:"Space Invaders ate bad code and died, compilation aborted."});
                            // Clear ABI and BIN
                            delFiles();
                        }
                        else {
                            this.setState({status:"Space Invaders successfully digested the source code."});
                            const contractName=this.props.contract;
                            var contractObj;
                            const filename=srcfilename.match(".*/(.*)$")[1];
                            if(data.contracts) contractObj=data.contracts[filename][contractName];
                            if(contractObj && Object.keys(contractObj.evm.bytecode.linkReferences || {}).length>0) {
                                contractObj=null;
                                this.consoleRows.push({channel:2,msg:"[ERROR] The contract " + contractName + " references library contracts. Studio does not yet support library contract linking, only contract imports."});
                            }
                            if(contractObj) {
                                const metadata=JSON.parse(contractObj.metadata);
                                // Save ABI and BIN
                                // First load, then save and close.
                                const cb=(file, contents, cb2)=>{
                                    this.props.project.loadFile(file, (body) => {
                                        if(body.status<=1) {
                                            body.contents=contents;
                                            this.props.project.saveFile(file, (body) => {
                                                if(body.status<=1) {
                                                    this.props.project.closeFile(file);
                                                    if(cb2) cb2();
                                                }
                                                else {
                                                    this.consoleRows.push({channel:2,msg:"[ERROR] Could not save the result file."});
                                                    delFiles();
                                                    return;
                                                }
                                            });
                                        }
                                        else {
                                            this.consoleRows.push({channel:2,msg:"[ERROR] Could not prepare the result file."});
                                            delFiles();
                                            return;
                                        }
                                    });
                                };
                                cb(abisrc, JSON.stringify(metadata.output.abi), ()=>{
                                    const meta={
                                        compile: {
                                            gasEstimates: contractObj.evm.gasEstimates,
                                        }
                                    };
                                    cb(metasrc, JSON.stringify(meta), ()=>{
                                        cb(binsrc, "0x"+contractObj.evm.bytecode.object, ()=>{
                                            const hash=sha256(contractbody.contents).toString();
                                            cb(hashsrc, hash, ()=>{
                                                // This is the success exit point.
                                                // Reload projects to update file list and open tabs.
                                                this.props.router.control._reloadProjects();
                                                this.consoleRows.push({channel:1,msg:"Success in compilation"});
                                                this.callback(0);
                                            });
                                        });
                                    });
                                });
                            }
                            else {
                                this.consoleRows.push({channel:2,msg:"[ERROR] The contract " + contractName + " could not be compiled."});
                                delFiles();
                            }
                        }
                    }
                    this.isRunning=false;
                    this.redraw();
                });
            },500);
        },true);
    };

    _loadFiles=(files, cb)=>{
        const bodies=[];
        var fn;
        fn=((files, bodies, cb2)=>{
            if(files.length==0) {
                cb2(0);
                return;
            }
            const file=files.shift();
            this.props.project.loadFile(file, (body) => {
                if(body.status!=0) {
                    cb(1);
                    return;
                }
                bodies.push(body.contents);
                fn(files, bodies, (status)=>{
                    cb2(status);
                });
            }, true, true);
        });
        fn(files, bodies, (status)=>{
            cb(status, bodies);
        });
    };

    componentDidMount() {
        this.redraw();
    }

    redraw = () => {
        this.setState();
    };

    renderToolbar = () => {
        const cls={};
        cls[style.running] = this.isRunning;
        return (
            <div class={style.toolbar} id={this.id+"_header"}>
                <div class={style.buttons}>
                    <a class={classnames(cls)} href="#" title="Recompile" onClick={this.run}><FaIcon icon={iconRun}/></a>
                </div>
                <div class={style.status}>
                    {this.state.status}
                </div>
                <div class={style.info}>
                    <span>
                        Compile {this.props.contract}
                    </span>
                </div>
            </div>
        );
    };

    getHeight = () => {
        const a=document.getElementById(this.id);
        const b=document.getElementById(this.id+"_header");
        if(!a) return 99;
        return (a.offsetHeight - b.offsetHeight);
    };

    getWait = () => {
        if(this.consoleRows.length == 0) {
            return <div class={style.space_invaders}>
                    <img src="/static/img/space-invaders.jpg" alt="" />
                </div>;
        }
    };

    renderContents = () => {
        const waiting=this.getWait();
        const scrollId="scrollBottom_"+this.props.id;
        return (
            <div class={style.console}>
                <div class={style.terminal} id={scrollId}>
                    {waiting}
                    {this.consoleRows.map((row, index) => {
                        return row.msg.split("\n").map(i => {
                            var cl=style.std1;
                            if(row.channel==2)
                                cl=style.std2;
                            else if(row.channel==3)
                                cl=style.std3;
                            return <div class={cl}>{i}</div>;
                        })
                    })}
                </div>
            </div>
        );
    };

    render() {
        const toolbar=this.renderToolbar();
        const contents=this.renderContents();
        const height=this.getHeight();
        const maxHeight = {
            height: height + "px"
        };
        return (
          <div class="full" id={this.id}>
            {toolbar}
            <div id={this.id+"_scrollable"} class="scrollable-y" style={maxHeight}>
                {contents}
            </div>
          </div>
        );
    }
}
