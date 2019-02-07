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
            response.json();
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
        .then((response) => response.json());
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
        return superFetch(process.env.REACT_APP_PROJECT_API_BASE_URL + '/projects/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then((response) => {
            // TODO: FIXME: manually check status 204, response.ok or throwErrors
        });
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
        });
    },
}
