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
import { fetchJSON } from './utils/fetchJson';
import { switchMap, map } from 'rxjs/operators';
import { IProject } from '../models';
import { Observable } from 'rxjs';

export const projectService = {

    createProject(data: Partial<IProject>): Observable<IProject> {
        return fetchJSON(process.env.REACT_APP_PROJECT_API_BASE_URL + '/projects', {
            method: 'POST',
            body: { ...data, files: JSON.stringify(data.files) }
        })
        .pipe(
            switchMap(response => response.json())
        );
    },

    claimProject(id: string) {
        return fetchJSON(process.env.REACT_APP_PROJECT_API_BASE_URL + '/projects/' + id + '/_claim' , {
            method: 'POST',
        })
        .pipe(
            switchMap(response => response.json())
        );
    },

    getProjectById(id: string) {
        return fetchJSON(process.env.REACT_APP_PROJECT_API_BASE_URL + '/projects/' + id, {})
            .pipe(
                switchMap(response => response.json()),
                map(project => {
                    const filesString = project.files;
                    return { ...project, files: JSON.parse(filesString) };
                })
            );
    },

    getProjectsInfo() {
        return fetchJSON(process.env.REACT_APP_PROJECT_API_BASE_URL + '/projectsInfo', {})
            .pipe(
                switchMap(response => response.json())
            );
    },

    putProjectById(id: string, data: any) {
        data.files = JSON.stringify(data.files);
        return fetchJSON(process.env.REACT_APP_PROJECT_API_BASE_URL + '/projects/' + id, {
            method: 'PUT',
            body: data
        });
    },

    deleteProjectById(id: string) {
        return fetchJSON(process.env.REACT_APP_PROJECT_API_BASE_URL + '/projects/' + id, {
            method: 'DELETE'
        });
    },
};

// TODO: FIXME: debugging-purposes only
// export async function demoProjectService() {

//     // Read
//     projectService.getProjectsInfo().then(function (response) {
//         console.log("getProjectsInfo: ", response);
//     });

//     //
//     // Write
//     var data = {
//         name: "testproject1",
//         description: "my test project 1",
//         files: "data here"
//     };
//     var projectId;
//     projectService.postProject(data).then(function (response) {
//         console.log("postProject [" + data.name + "]: ", response);

//         projectId = response.id;
//         // Load by id
//         projectService.getProjectById(projectId).then(function (response) {
//             console.log("getProjectById [" + projectId + "]: ", response);
//         });

//         // Read
//         projectService.getProjectsInfo().then(function (response) {
//             console.log("getProjectsInfo: ", response);

//             // Rewrite
//             data = {
//                 name: "testproject1",
//             description: "Modified test test project 1: " + (new Date()).toString(),
//             files: "new data here"
//             };
//             projectService.putProjectById(projectId, data).then(function (response) {
//                 console.log("putProjectById [" + projectId + "]: ", response);

//                 // Read
//                 projectService.getProjectById(projectId).then(function (response) {
//                     console.log("getProjectById [" + projectId + "]: ", response);

//                     // Delete
//                     projectService.deleteProjectById(projectId).then(function (response) {
//                         console.log("deleteProjectById [" + projectId + "]: ", response);
//                     });

//                     // Read
//                     projectService.getProjectsInfo().then(function (response) {
//                         console.log("getProjectsInfo: ", response);
//                     });
//                 });
//             });
//         });
//     });
// }
