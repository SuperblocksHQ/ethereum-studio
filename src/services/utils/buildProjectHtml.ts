// Copyright 2018 Superblocks AB

// This file is part of Superblocks Lab.

// Superblocks Lab is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.

// Superblocks Lab is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Superblocks Lab.  If not, see <http://www.gnu.org/licenses/>.

// function loadFiles(project, filesArray, cb) {
//     const bodiesArray = [];
//     const fn = (files, bodies, cb2) => {
//         if (files.length === 0) {
//             cb2(0);
//             return;
//         }
//         const file = files.shift();
//         project.loadFile(
//             file,
//             body => {
//                 if (body.status !== 0) {
//                     // NOTE: we currently allow for missing contract compilations.
//                 }
//                 else {
//                     bodies.push(body.contents);
//                 }
//                 fn(files, bodies, status => {
//                     cb2(status);
//                 });
//             },
//             true,
//             true
//         );
//     };
//     fn(filesArray, bodiesArray, status => {
//         cb(status, bodiesArray);
//     });
// }

// function makeFileName(path, network, suffix) {
//     const a = path.match(/^(.*\/)([^/]+)$/);
//     const dir = a[1];
//     const filename = a[2];
//     const contractName = filename.match(/^(.+)[.][Ss][Oo][Ll]$/)[1];
//     return `/build${dir}${contractName}/${contractName}.${network}.${suffix}`;
// }

// function getAccountAddresses(project, wallet, disableAccounts, env) {
//     if (disableAccounts) { return null; }

//     // Check given account, try to open and get address, else return [].
//     const accountName = project.getAccount();
//     if (accountName === '(locked)') { return []; }
//     if (!accountName) { return []; }

//     const accounts = project.getHiddenItem('accounts');
//     const account = accounts.getByName(accountName);
//     const accountIndex = account.getAccountIndex(env);
//     const walletName = account.getWallet(env);
//     const walletsItem = project.getHiddenItem('wallets');
//     const walletItem = walletsItem.getByName(walletName);

//     if (!walletItem) {
//         return [];
//     }
//     const walletType = walletItem.getWalletType();

//     if (walletType === 'external') {
//         // Metamask seems to always only provide one (the chosen) account.
//         if (!window.web3) { return []; }
//         const extAccounts = window.web3.eth.accounts || [];
//         if (extAccounts.length < accountIndex + 1) {
//             // Account not matched
//             return [];
//         }
//         return [extAccounts[accountIndex]];
//     }

//     if (wallet.isOpen(walletName)) {
//         const address = wallet.getAddress(walletName, accountIndex);
//         return [ address ];
//     }

//     return [];
// }

// /**
//  * Create HTML page to preview and download a project
//  * @param {*} project
//  * @param {*} wallet
//  * @param {*} disableAccounts
//  */
// export function buildProjectHtml(project, wallet, disableAccounts, environment) {
//     return new Promise((resolve, reject) => {

//         let js, css, html, contractjs;

//         project.loadFile(
//             '/app/app.html',
//             bodyHtml => {
//                 if (bodyHtml.status !== 0) {
//                     resolve(errorHtml('Missing file(s)'));
//                     return;
//                 }
//                 html = bodyHtml.contents;
//                 project.loadFile(
//                     '/app/app.js',
//                     bodyJs => {
//                         if (bodyJs.status !== 0) {
//                             resolve(errorHtml('Missing file(s)'));
//                             return;
//                         }
//                         js = bodyJs.contents;
//                         project.loadFile(
//                             '/app/app.css',
//                             body => {
//                                 if (body.status !== 0) {
//                                     resolve(errorHtml('Missing file(s)'));
//                                     return;
//                                 }
//                                 css = body.contents;
//                                 const contracts = project.getHiddenItem('contracts').getChildren()
//                                     .map(contract => contract.getName());

//                                 const jsfiles = [];

//                                 for (const contractName of contracts) {
//                                     const contract = project
//                                         .getHiddenItem('contracts')
//                                         .getByName(contractName);

//                                     const src = contract.getSource();
//                                     const jssrc = makeFileName(src, environment.name, "js");
//                                     jsfiles.push(jssrc);
//                                 }

//                                 loadFiles(project, jsfiles, (status, bodies) => {
//                                     if (status !== 0) {
//                                         resolve(errorHtml('Missing contract javascript file, have you deployed all contracts?'));
//                                         return;
//                                     }

//                                     contractjs = bodies.join('\n');
//                                     const content = getInnerContent(
//                                         html,
//                                         css,
//                                         contractjs + '\n' + js,
//                                         project.getTitle(),
//                                         environment.endpoint,
//                                         getAccountAddresses(project, wallet, disableAccounts, environment.name)
//                                     );

//                                     // exportable version.
//                                     const exportableContent = getInnerContent(
//                                         html,
//                                         css,
//                                         contractjs + '\n' + js,
//                                         project.getTitle()
//                                     );

//                                     resolve({ content, exportableContent });
//                                 });
//                             },
//                             true,
//                             true
//                         );
//                     },
//                     true,
//                     true
//                 );
//             },
//             true
//         );
//     });
// }
