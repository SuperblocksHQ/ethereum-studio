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

import { empty } from 'rxjs';
import { switchMap, withLatestFrom } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { appActions } from '../../actions';
import * as analitics from '../../utils/analytics';

// TODO - To fix before 2.0
// import Modal from '../../modal';
// import Dappfile from '../../projecteditor/control/item/dappfileItem';

// importProject = e => {
//     // Thanks to Richard Bondi for contributing with this upload code.
//     e.preventDefault();
//     var uploadAnchorNode = document.createElement('input');
//     uploadAnchorNode.setAttribute('id', 'importFileInput');
//     uploadAnchorNode.setAttribute('type', 'file');
//     uploadAnchorNode.onchange = this.importProject2;
//     document.body.appendChild(uploadAnchorNode); // required for firefox
//     uploadAnchorNode.click();
//     uploadAnchorNode.remove();
// };

// importProject2 = e => {
//     var file = e.target.files[0];
//     var reader = new FileReader();

//     reader.onloadend = evt => {
//         var project;
//         if (evt.target.readyState == FileReader.DONE) {
//             if (evt.target.result.length > 1024**2) {
//                 alert('File to big to be handled. Max size in 1 MB.');
//                 return;
//             }

//             const backend = new Backend();
//             backend.unZip(evt.target.result).then( (project) => {
//                 this.importProject3(project);
//             })
//                 .catch( () => {
//                     console.log("Could not parse import as zip, trying JSON.");
//                     try {
//                         const obj = JSON.parse(evt.target.result);
//                         if (!obj.files) {
//                             alert('Error: Invalid project file. Must be ZIP-file (or legacy JSON format).');
//                             return;
//                         }
//                         project = obj;
//                     } catch (e) {
//                         alert('Error: Invalid project file. Must be ZIP-file (or legacy JSON format).');
//                         return;
//                     }
//                     this.importProject3(project);
//                 });

//         }
//     };
//     var blob = file.slice(0, file.size);
//     reader.readAsBinaryString(blob);
// };

// importProject3 = project => {
//     const backend = new Backend();
//     backend.convertProject(project, (status, project2) => {
//         if (status > 1) {
//             const modalData = {
//                 title: 'Project converted',
//                 body: (
//                     <div>
//                         <div>
//                             The imported project has been converted to the
//                             new Superblocks Lab format.
//                             <br />
//                             You might need to reconfigure your accounts and
//                             contract arguments due to these changes. We are
//                             sorry for any inconvenience.
//                         </div>
//                         <div>
//                             Please see the Superblocks Lab help center for
//                             more information on this topic.
//                         </div>
//                     </div>
//                 ),
//                 style: { width: '680px' },
//             };
//             const modal = <Modal data={modalData} />;
//             this.props.functions.modal.show({
//                 cancel: () => {
//                     this.importProject4(project2.files);
//                     return true;
//                 },
//                 render: () => {
//                     return modal;
//                 },
//             });
//         } else if (status == -1) {
//             alert('Error: Could not import project.');
//         } else {
//             this.importProject4(project.files);
//         }
//     });
// };

// importProject4 = files => {
//     var title = '';
//     var name = '';
//     var dappfile;

//     // Try to decode the `/dappfile.json`.
//     try {
//         dappfile = JSON.parse(
//             files['/'].children['dappfile.json'].contents
//         );
//     } catch (e) {
//         // Create a default dappfile.
//         console.log('Create default dappfile.json for import');
//         dappfile = Dappfile.getDefaultDappfile();
//         files['/'].children['dappfile.json'] = {type: 'f'};
//     }

//     try {
//         title = dappfile.project.info.title || '';
//         name = dappfile.project.info.name || '';
//     } catch (e) {
//         dappfile.project = { info: {} };
//     }

//     // This will make sure the dappfile has a sane state.
//     Dappfile.validateDappfile(dappfile);

//     do {
//         var name2 = prompt('Please give the project a name.', name);
//         if (!name2) {
//             alert('Import cancelled.');
//             return;
//         }
//         if (!name2.match(/^([a-zA-Z0-9-]+)$/) || name2.length > 30) {
//             alert(
//                 'Illegal projectname. Only A-Za-z0-9 and dash (-) allowed. Max 30 characters.'
//             );
//             continue;
//         }
//         name = name2;
//         break;
//     } while (true);

//     do {
//         var title2 = prompt(
//             'Please give the project a snappy title.',
//             title
//         );
//         if (!title2) {
//             alert('Import cancelled.');
//             return;
//         }
//         if (title2.match(/([\"\'\\]+)/) || title2.length > 100) {
//             alert(
//                 'Illegal title. No special characters allowed. Max 100 characters.'
//             );
//             continue;
//         }
//         title = title2;
//         break;
//     } while (true);

//     try {
//         dappfile.project.info.name = name;
//         dappfile.project.info.title = title;
//         files['/'].children['dappfile.json'].contents = JSON.stringify(
//             dappfile, null, 4
//         );
//     } catch (e) {
//         console.error(e);
//         alert('Error: could not import project.');
//         return;
//     }

//     this.props.router.control.importProject(files);
// };

const initTrackingAnalytics: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(appActions.APP_START),
    withLatestFrom(state$),
    switchMap(([, state]) => {
        const { trackAnalytics } = state.settings.preferences.advanced;
        analitics.setEnable(trackAnalytics);
        return empty();
    }));

export default initTrackingAnalytics;
