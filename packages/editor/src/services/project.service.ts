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
import { switchMap, tap } from 'rxjs/operators';
import { IProject } from '../models';
import { Observable, throwError, of } from 'rxjs';

export const projectService = {

    createProject(data: Partial<IProject>): Observable<IProject> {
        return fetchJSON(window.ENV.API_BASE_URL + '/v1/projects', {
            method: 'POST',
            body: data
        })
        .pipe(
            switchMap(response => response.json()),
            tap((project: IProject) => {
                if (project.anonymousToken) {
                    fetchJSON.setAnonymousToken(project.anonymousToken);
                }
            })
        );
    },

    getProjectById(id: string) {
        return fetchJSON(window.ENV.API_BASE_URL + '/v1/projects/' + id, {})
            .pipe(
                switchMap(response => response.json())
            );
    },

    getProjectsInfo() {
        return fetchJSON(window.ENV.API_BASE_URL + '/v1/projectsInfo', {})
            .pipe(
                switchMap(response => response.json())
            );
    },

    putProjectById(id: string, data: any) {
        return fetchJSON(window.ENV.API_BASE_URL + '/v1/projects/' + id, {
            method: 'PUT',
            body: data
        }).pipe(
            switchMap(r => r.ok ? of(r.statusText) : throwError(r.statusText))
        );
    },

    deleteProjectById(id: string) {
        return fetchJSON(window.ENV.API_BASE_URL + '/v1/projects/' + id, {
            method: 'DELETE'
        }).pipe(
            switchMap(r => r.ok ? of(r.statusText) : throwError(r.statusText))
        );
    },
};
