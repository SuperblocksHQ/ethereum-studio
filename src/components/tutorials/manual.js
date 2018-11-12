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
import style from './style.less';

export default class TutorialsManual extends Component {
    constructor(props) {
        super(props);
        this.id = props.id + '_tutorial_manual';
    }

    redraw = () => {
        this.forceUpdate();
    };

    render() {
        return (
            <div id={this.id} className={style.main}>
                <div className="scrollable-y" id={this.id + '_scrollable'}>
                    <h1 className={style.title}>Reference manual</h1>
                    <div className={style.body}>
                        <p>
                            Superblocks Lab is a toolchain for coding, building,
                            testing and deploying smart contracts and
                            blockchain-based applications.
                        </p>
                        <p>
                            Superblocks Lab provides local execution of
                            projects, as well as other services and tools for
                            developing decentralized applications through a
                            friendly browser-based experience.
                        </p>

                        <h2>Typical, single-contract, development workflow</h2>
                        <ol>
                            <li>Create new project</li>
                            <li>Inspect and edit existing contract file</li>
                            <li>Create new contract file</li>
                            <li>Configure contract settings</li>
                            <li>Compile the contract</li>
                            <li>Deploy contract to the local network</li>
                            <li>
                                Interact with contracts by calling functions and
                                sending transactions
                            </li>
                        </ol>
                        <p>
                            The example workflow disconsiders formal testing,
                            that evaluate certain assumptions programmatically,
                            and debugging, often used as means for finding and
                            fixing bugs, improving checks and optimizing code
                        </p>

                        <h3>Create a new project</h3>
                        <p>
                            A project can be composed of one or more contract
                            files and optionally a web application. The
                            combination of web front-end and decentralized data
                            results in a decentralized application, or simply:
                            dapp.
                        </p>
                        <p>
                            Create a new project by clicking the <b>New DApp</b>{' '}
                            button, located at the top left corner of the page.
                            Follow the instructions on the screen.
                            <br />A project <b>name</b> and a <b>title</b> will
                            be required. The <b>name</b> will be used for
                            referencing and accessing the project after
                            creation. The <b>title</b> represents the
                            application name, which will be used as the main web
                            application title in the <i>HTML</i> file. Finally,
                            for the base structure, choose an existing template
                            as the starting point. The simplest and recommended
                            template is the <b>HelloWorld</b> dapp.
                        </p>
                        <p>
                            After choosing the starting project settings, click
                            the <b>Create</b> button. The project will be listed
                            in the <b>DApps</b> drop-down list, located at the
                            left side menu. Selecting the project from the{' '}
                            <b>DApps</b> list will always bring it to the menu,
                            if it is not already there, enabling further
                            inspection. Click the arrow icon to expand the
                            content and explore the project hierarchy.
                        </p>

                        <h3>Inspect and edit existing contract file</h3>
                        <p>
                            After selecting a project from the <b>DApps</b>{' '}
                            drop-down list, expand the project files by clicking
                            on the arrow next to the project name, located on
                            the left side menu. All contract files, application
                            files and account settings are listed in their
                            respective project folder (<b>Contracts</b>,{' '}
                            <b>App</b> and <b>Accounts</b>
                            ).
                        </p>
                        <p>
                            Now, access the contract by clicking the contract
                            name on the menu, located inside the{' '}
                            <b>Contracts</b> folder. This opens the file in the
                            editor main area, at the right side of the screen.
                            After editing the contract, save the changes by
                            clicking the <b>Save</b> icon in the toolbar,
                            presented at the top of the editor window.
                        </p>

                        <h3>Create a new contract file</h3>
                        <p>
                            Creating a new contract can be done by clicking the{' '}
                            <b>New contract</b> icon located on the right side
                            of the <b>Contracts</b> menu item, on the left side
                            menu. This adds a new file under the{' '}
                            <b>Contracts</b> folder.
                        </p>
                        <p>
                            The order in which the contracts appear on the{' '}
                            <b>Contracts</b> menu list can be configured with
                            the up and arrow icons, next to the contract name in
                            the hierarchy.
                        </p>

                        <h3>Configure contract settings</h3>
                        <p>
                            The <b>Configure</b> option is located inside each
                            contract item and it can be accessed by expanding
                            the contract file clicking the arrow indicator next
                            to the contract name. Each contract listed in a
                            project <b>Contracts</b> folder carries a set of
                            configurations, apart from the initial{' '}
                            <b>file name</b> and <b>account</b> settings. Other
                            important configurations are:{' '}
                            <b>constructor arguments</b>, <b>environment</b> and{' '}
                            <b>network</b> selection.
                        </p>
                        <p>
                            <b>Constructor arguments</b> are needed for
                            generating a compiled binary with the added
                            arguments and, most importantly, initializing a
                            contract during deployment. The most common use case
                            is passing a <b>value</b> to the contract
                            constructor to be read during creation.
                            Additionally, it is also possible to link the
                            constructor parameter with an existing user{' '}
                            <b>account</b> or another <b>contract</b>, as long
                            as they have been previously declared and defined in
                            the current project.
                        </p>

                        <h3>Compile the contract</h3>
                        <p>
                            With the contract file ready, compilation can be
                            done directly from the editor window, while editing
                            the contract, by clicking the <b>Compile</b> button
                            located at the toolbar, or by selecting the{' '}
                            <b>Compile</b> item listed under the contract name
                            in the main menu.
                        </p>
                        <p>
                            When the action starts, a new panel will appear
                            showing the connectivity details, compilation
                            progress and a status code with a success or failure
                            message at the end.
                        </p>

                        <h3>Deploy contract to the local network</h3>
                        <p>
                            In order to have the contract available on any
                            network, a deployment process must be executed.
                            <br />
                            Press the <b>Deploy</b> button located at the top of
                            the editor window, available when editing the
                            contract, or click the <b>Deploy</b> item listed
                            under the contract name in the main menu. A new
                            window will appear describing the whole process
                            while the toolchain automates the tasks until
                            completion. All the steps needed to deploy the
                            contract will be performed, including compilation,
                            recompilation and rebuild, when applicable.
                        </p>
                        <p>
                            A contract will only be recompiled if one of the
                            following events happen:
                            <br />
                            <ol>
                                <li>
                                    a given source file hasn't been compiled yet
                                </li>
                                <li>a file has been updated</li>
                            </ol>
                            Alternatively, for recompiling a single source file
                            that has not been changed, a simple method is to
                            touch the file by simply saving it again.
                            <br />
                            Similarly, project redeployment only happens when
                            one of the following events happen:
                            <br />
                            <ol>
                                <li>
                                    a given compiled contract hasn't been
                                    deployed yet
                                </li>
                                <li>a contract binary has been changed</li>
                            </ol>
                        </p>

                        <h3>
                            Interact with contracts by calling functions and
                            sending transactions
                        </h3>
                        <p>
                            After a contract is deployed, the <b>Interact</b>{' '}
                            section, located at the top of the editor window
                            while editing the contract, or listed under the
                            contract name in the main menu, makes it possible to
                            interact with a given contract after the contract
                            address and the interface (ABI) are known.
                        </p>
                        <p>
                            It will now be possible to perform reads and writes
                            to the contract directly. A procedure can be invoked
                            by clicking the buttons named after each operation.
                            For transactions that require signing, an account
                            will have to be selected from the drop-down list
                            located at the top of the screen, marked as{' '}
                            <b>Account</b>.
                        </p>
                        <p>
                            For contracts that work in conjunction with web
                            applications (DApps), the <b>App</b> section of the
                            menu will also be available. All available templates
                            contain a working web application that can be run by
                            accessing the <b>View</b> item inside the <b>App</b>{' '}
                            section in the left menu.
                        </p>

                        <h3>Inspect transaction history</h3>
                        <p>
                            All transactions that occur within a project can be
                            inspected by accessing the{' '}
                            <b>Transaction history</b> section, located inside
                            each project in the main menu.
                        </p>
                        <p>
                            Latest transactions are listed first, describing all
                            common details such as the transaction hash, gas
                            price, amount of gas used. Other details specific to
                            Superblocks Lab includes who originated the
                            transaction and which network it relates to.
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}
