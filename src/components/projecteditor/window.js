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
import classnames from 'classnames';
import style from './style';
import Editor from './editor.js';
import ContractEditor from './editor-contract.js';
import AppEditor from './editor-app.js';
import AccountEditor from './editor-account.js';
import Compiler from './compiler.js';
import Deployer from './deployer.js';
import TutorialsManual from '../tutorials/manual.js';
import TutorialsOnline from '../tutorials/online.js';
import AppView from './appview.js';
import ConstantEditor from './editor-constant.js';
import ContractInteraction from './contractinteraction.js';
import TransactionLog from '../blockexplorer/transactionlog.js';
import Welcome from './welcome.js';

export class WindowComponent extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.obj.component=this;
    }

    redraw = () => {
        this.setState();
    };

    render() {
        const sub=this.props.obj.renderSub();
        return (
            <div key="window" class="full">
                <div class={style.close_btn}>
                    <a href="#" title="Close" onClick={this.props.obj.close}>X</a>
                </div>
                {sub}
            </div>
        );
    };
}

export class Window {
    constructor(props) {
        this.props=props;
        this.subId="winitem_"+this.props.item.getId();
        this.component;
        this.childComponent;  // Optionally registered by the sub component.
    }

    getItemId = () => {
        return this.props.item.getId();
    };

    focus = (rePerform, cb) => {
        if(cb) {
            this.callback=cb;
        }
        if(this.childComponent && this.childComponent.focus) this.childComponent.focus(rePerform);
    };

    _clickedUpon = () => {
        if(this.props.parent.activeWindowId!=this.props.item.getId()) {
            this.props.parent.focusWindow(this.props.item.getId());
            this.props.parent.props.parent.redraw();
        }
    };

    renderSub = () => {
        if(this.props.item.props.type=="file") {
            return (
                <div class="full" onClick={(e)=>{this._clickedUpon()}}>
                    <Editor id={this.subId} key={this.subId} contract={this.props.item.props._contract} project={this.props.item.props._project} file={this.props.item.props.file} router={this.props.router} item={this.props.item} parent={this} type={this.props.item.props.type} type2={this.props.item.props.type2} />
                </div>
            );
        }
        else if(this.props.item.props.type=="contract" && this.props.item.props.type2=="configure") {
            return (
                <ContractEditor id={this.subId} key={this.subId} project={this.props.item.props._project} contract={this.props.item.props._contract} parent={this} router={this.props.router} />
            );
        }
        else if(this.props.item.props.type=="project") {
            return (
                <AppEditor id={this.subId} key={this.subId} project={this.props.item.props._project} dappfilejson={this.props.item.props._dappfilejson} parent={this} router={this.props.router} />
            );
        }
        else if(this.props.item.props.type=="contract" && this.props.item.props.type2=="compile") {
            return (
                <div class="full" onClick={(e)=>{this._clickedUpon()}}>
                    <Compiler type="contract_compile"
                        id={this.subId}
                        key={this.subId}
                        functions={this.props.functions}
                        project={this.props.item.props._project}
                        contract={this.props.item.props._contract}
                        parent={this}
                        router={this.props.router} />
                </div>
            );
        }
        else if(this.props.item.props.type=="contract" && this.props.item.props.type2=="deploy") {
            return (
                <div class="full" onClick={(e)=>{this._clickedUpon()}}>
                    <Deployer type="contract_deploy"
                        id={this.subId}
                        key={this.subId}
                        item={this.props.item}
                        functions={this.props.functions}
                        project={this.props.item.props._project}
                        contract={this.props.item.props._contract}
                        parent={this}
                        router={this.props.router} />
                </div>
            );
        }
        else if(this.props.item.props.type=="account") {
            return (
                <AccountEditor id={this.subId} key={this.subId} project={this.props.item.props._project} account={this.props.item.props._account} parent={this} router={this.props.router} functions={this.props.functions} />
            );
        }
        else if(this.props.item.props.type=="constant") {
            return (
                <ConstantEditor id={this.subId} key={this.subId} project={this.props.item.props._project} constant={this.props.item.props._constant} parent={this} router={this.props.router} functions={this.props.functions} />
            );
        }
        else if(this.props.item.props.type=="tutorials" && this.props.item.props.type2=="manual") {
            return (
                <TutorialsManual id={this.subId} parent={this} router={this.props.router} functions={this.props.functions} />
            );
        }
        else if(this.props.item.props.type=="tutorials" && this.props.item.props.type2=="online") {
            return (
                <TutorialsOnline id={this.subId} parent={this} router={this.props.router} functions={this.props.functions} />
            );
        }
        else if(this.props.item.props.type=="app" && this.props.item.props.type2=="view") {
            return (
                <AppView id={this.subId} parent={this} project={this.props.item.props._project} router={this.props.router} functions={this.props.functions} />
            );
        }
        else if(this.props.item.props.type=="contract" && this.props.item.props.type2=="interact") {
            return (
                <ContractInteraction id={this.subId} parent={this} contract={this.props.item.props._contract} project={this.props.item.props._project} router={this.props.router} functions={this.props.functions} />
            );
        }
        else if(this.props.item.props.type=="transaction_log") {
            return (
                <TransactionLog id={this.subId} parent={this} name={this.props.item.props._name} project={this.props.item.props._project} router={this.props.router} functions={this.props.functions} />
            );
        }
        else if(this.props.item.props.type=="info" && this.props.item.props.type2=="welcome") {
            return (
                <Welcome />
            );
        }
    };

    close = (e) => {
        if(e) e.preventDefault();
        this.props.parent.closeWindow(this.getItemId());
    };

    canClose = (cb) => {
        if(this.childComponent && this.childComponent.canClose) {
            this.childComponent.canClose((status)=>{
                cb(status);
            });
            return;
        }
        cb(0);
    };

    getTitle = () => {
        if(this.childComponent && this.childComponent.getTitle) return this.childComponent.getTitle();
        if(this.props.item.props.type=="file") return this.props.item.props.title;
        if(this.props.item.props.type=="contract") return this.props.item.props.title;
        return this.props.item.props.title;
    };

    getIcon = () => {
        return this.props.item.getIcon();
    };

    redraw = (props) => {
        if(this.component) this.component.redraw();
        if(this.childComponent) this.childComponent.redraw(props);
    };
}
