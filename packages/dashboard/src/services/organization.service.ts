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
import { switchMap } from 'rxjs/operators';
import { IOrganization } from '../models';
import { Observable, throwError } from 'rxjs';
import { IOrganizationMember, IRole } from '../models/organizationMember.model';

export const organizationService = {

    createOrganization(data: Partial<IOrganization>): Observable<IOrganization> {
        return fetchJSON(process.env.REACT_APP_API_BASE_URL + '/organizations/v1/organizations', {
            method: 'POST',
            body: data
        })
        .pipe(
            switchMap(response => response.json())
        );
    },

    getOrganizationById(id: string) {
        return fetchJSON(process.env.REACT_APP_API_BASE_URL + '/organizations/v1/organizations/' + id, {})
            .pipe(
                switchMap(response => response.json())
            );
    },

    getOrganizationsInfo() {
        return fetchJSON(process.env.REACT_APP_API_BASE_URL + '/organizations/v1/organizationsInfo', {})
            .pipe(
                switchMap(response => response.json())
            );
    },

    putOrganizationById(id: string, data: any) {
        return fetchJSON(process.env.REACT_APP_API_BASE_URL + '/organizations/v1/organizations/' + id, {
            method: 'PUT',
            body: data
        }).pipe(
            switchMap(r => (r.ok ? r.statusText : throwError(r.statusText)))
        );
    },

    deleteOrganizationById(id: string) {
        return fetchJSON(process.env.REACT_APP_API_BASE_URL + '/organizations/v1/organizations/' + id, {
            method: 'DELETE'
        });
    },

    // ---------- Organization Member endpoints ----------
    inviteMemberToOrganization(organizationId: string, email: string) {
        return fetchJSON(`/${process.env.REACT_APP_API_BASE_URL}/organizations/v1/organization/${organizationId}/members/_invite`, {
            method: 'POST',
            body: { email }
        })
        .pipe(
            switchMap(response => response.json())
        );
    },
    addMemberToOrganization(organizationId: string, data: Partial<IOrganizationMember>) {
        return fetchJSON(`/${process.env.REACT_APP_API_BASE_URL}/organizations/v1/organization/${organizationId}/members`, {
            method: 'POST',
            body: data
        })
        .pipe(
            switchMap(response => response.json())
        );
    },

    changeMemberRoleInOrganization(organizationId: string, memberId: any, newRole: IRole) {
        return fetchJSON(`/${process.env.REACT_APP_API_BASE_URL}/organizations/v1/organization/${organizationId}/members/${memberId}/_change-role`, {
            method: 'PUT',
            body: { newRole }
        }).pipe(
            switchMap(r => (r.ok ? r.statusText : throwError(r.statusText)))
        );
    },

    removeMemberFromOrganization(organizationId: string, memberId: string) {
        return fetchJSON(`/${process.env.REACT_APP_API_BASE_URL}/organizations/v1/organization/${organizationId}/members/${memberId}`, {
            method: 'DELETE',
        });
    },
};
