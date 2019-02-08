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
import { superFetch } from './utils/superFetch';

export const projectService = {

    async postProject(data) {
        // TODO: FIXME: validate data input
        return superFetch(process.env.REACT_APP_PROJECT_API_BASE_URL + '/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then((response) => {
            // TODO: FIXME: manually check status 201, response.ok or throwErrors
            return response.json();
        })
        .then((data) => {
            return data;
        });
    },

    async postProjectClaim(id) {
        // TODO: FIXME: validate id input
        //              Expects a string (12-byte ObjectId)
        return superFetch(process.env.REACT_APP_PROJECT_API_BASE_URL + '/projects/' + id + '/_claim' , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((response) => {
            // TODO: FIXME: manually check status 201, response.ok or throwErrors
            response.json();
        });
    },

    async getProjectById(id) {
        // TODO: FIXME: validate id input
        //              Expects a string (12-byte ObjectId)
        return superFetch(process.env.REACT_APP_PROJECT_API_BASE_URL + '/projects/' + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        // TODO: FIXME: manually check status 200, response.ok or throwErrors
        .then((response) => response.json())
        .then((project) => {
            // Make sure we transform here the files prop as it is represented in a string format when
            // coming from the back-end.
            const filesString = project.files;
            project.files = JSON.parse(filesString);
            return project;
        });
    },

    async getProjectsInfo() {
        return superFetch(process.env.REACT_APP_PROJECT_API_BASE_URL + '/projectsInfo', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        // TODO: FIXME: manually check status 200, response.ok or throwErrors
        .then((response) => response.json());
    },

    async putProjectById(id, data) {
        // TODO: FIXME: validate id input
        //              Expects a string (12-byte ObjectId)
        // TODO: FIXME: validate data input
        // TODO: Make sure we handle correctly files
        data.files = JSON.stringify(data.files);
        return superFetch(process.env.REACT_APP_PROJECT_API_BASE_URL + '/projects/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        // TODO: FIXME: manually check status 204, response.ok or throwErrors
        // TODO: FIXME: return anything ?
    },

    async deleteProjectById(id) {
        // TODO: FIXME: validate id input
        //              Expects a string (12-byte ObjectId)
        return superFetch(process.env.REACT_APP_PROJECT_API_BASE_URL + '/projects/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((response) => {
            // TODO: FIXME: manually check status 204, response.ok or throwErrors
            // TODO: FIXME: return anything ?
        });
    },
}

// TODO: FIXME: debugging-purposes only
export async function demoProjectService() {

    // Read
    projectService.getProjectsInfo().then(function (response) {
        console.log("getProjectsInfo: ", response);
    });

    //
    // Write
    var data = {
        name: "testproject1",
        description: "my test project 1",
        files: "data here"
    };
    var projectId;
    projectService.postProject(data).then(function (response) {
        console.log("postProject [" + data.name + "]: ", response);

        projectId = response.id;
        // Load by id
        projectService.getProjectById(projectId).then(function (response) {
            console.log("getProjectById [" + projectId + "]: ", response);
        });

        // Read
        projectService.getProjectsInfo().then(function (response) {
            console.log("getProjectsInfo: ", response);

            // Rewrite
            data = {
                name: "testproject1",
            description: "Modified test test project 1: " + (new Date()).toString(),
            files: "new data here"
            };
            projectService.putProjectById(projectId, data).then(function (response) {
                console.log("putProjectById [" + projectId + "]: ", response);

                // Read
                projectService.getProjectById(projectId).then(function (response) {
                    console.log("getProjectById [" + projectId + "]: ", response);

                    // Delete
                    projectService.deleteProjectById(projectId).then(function (response) {
                        console.log("deleteProjectById [" + projectId + "]: ", response);
                    });

                    // Read
                    projectService.getProjectsInfo().then(function (response) {
                        console.log("getProjectsInfo: ", response);
                    });
                });
            });
        });
    });
}
