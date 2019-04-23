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

import { IOrganization } from '../models';

export const organizationActions = {

    GET_ORGANIZATION_LIST: 'GET_ORGANIZATION_LIST',
    getOrganizationList() {
        return {
            type: organizationActions.GET_ORGANIZATION_LIST,
        };
    },
    GET_ORGANIZATION_LIST_SUCCESS: 'GET_ORGANIZATION_LIST_SUCCESS',
    getOrganizationListSuccess(organizationList: IOrganization[]) {
        return {
            type: organizationActions.GET_ORGANIZATION_LIST_SUCCESS,
            data: { organizationList }
        };
    },
    GET_ORGANIZATION_LIST_FAIL: 'GET_ORGANIZATION_LIST_FAIL',
    getOrganizationListFail(error: any) {
        return {
            type: organizationActions.GET_ORGANIZATION_LIST_FAIL,
            data: error
        };
    },

    // ---------- CRUD Organization actions ----------
    CREATE_ORGANIZATION: 'CREATE_ORGANIZATION',
    createOrganization({ name, description }: any, redirect: boolean = false) {
        return {
            type: organizationActions.CREATE_ORGANIZATION,
            data: { name, description, redirect }
        };
    },
    CREATE_ORGANIZATION_SUCCESS: 'CREATE_ORGANIZATION_SUCCESS',
    createOrganizationSuccess() {
        return {
            type: organizationActions.CREATE_ORGANIZATION_SUCCESS,
        };
    },
    CREATE_ORGANIZATION_FAIL: 'CREATE_ORGANIZATION_FAIL',
    createOrganizationFail(error: string) {
        return {
            type: organizationActions.CREATE_ORGANIZATION_FAIL,
            data: error
        };
    },
    DELETE_ORGANIZATION: 'DELETE_ORGANIZATION',
    deleteOrganization(organizationId: string, redirect: boolean = false) {
       return {
            type: organizationActions.DELETE_ORGANIZATION,
            data: { organizationId, redirect }
       };
    },
    DELETE_ORGANIZATION_SUCCESS: 'DELETE_ORGANIZATION_SUCCESS',
    deleteOrganizationSuccess() {
       return {
            type: organizationActions.DELETE_ORGANIZATION_SUCCESS
       };
    },
    DELETE_ORGANIZATION_FAIL: 'DELETE_ORGANIZATION_FAIL',
    deleteOrganizationFail(error: string) {
       return {
            type: organizationActions.DELETE_ORGANIZATION_FAIL,
            data: error
       };
    },
    LOAD_ORGANIZATION: 'LOAD_ORGANIZATION',
    loadOrganization(organizationId: string) {
        return {
            type: organizationActions.LOAD_ORGANIZATION,
            data: { organizationId }
        };
    },
    LOAD_ORGANIZATION_SUCCESS: 'LOAD_ORGANIZATION_SUCCESS',
    loadOrganizationSuccess(organization: IOrganization) {
       return {
            type: organizationActions.LOAD_ORGANIZATION_SUCCESS,
            data: { organization }
       };
    },
    LOAD_ORGANIZATION_FAIL: 'LOAD_ORGANIZATION_FAIL',
    loadOrganizationFail(error: string) {
       return {
            type: organizationActions.LOAD_ORGANIZATION_FAIL,
            data: error
       };
    },
    RENAME_ORGANIZATION: 'RENAME_ORGANIZATION',
    renameOrganization(newName: string) {
       return {
            type: organizationActions.RENAME_ORGANIZATION,
            data: { newName }
       };
    },
    RENAME_ORGANIZATION_FAIL: 'RENAME_ORGANIZATION_FAIL',
    renameOrganizationFail(error: string) {
        return {
            type: organizationActions.RENAME_ORGANIZATION_FAIL,
            data: error
        };
    },
    UPDATE_ORGANIZATION: 'UPDATE_ORGANIZATION',
    updateOrganization(organization: IOrganization) {
       return {
            type: organizationActions.UPDATE_ORGANIZATION,
            data: { organization }
       };
    },
    UPDATE_ORGANIZATION_SUCCESS: 'UPDATE_ORGANIZATION_SUCCESS',
    updateOrganizationSuccess(organization: IOrganization) {
       return {
            type: organizationActions.UPDATE_ORGANIZATION_SUCCESS,
            data: { organization}
       };
    },
    UPDATE_ORGANIZATION_FAIL: 'UPDATE_ORGANIZATION_FAIL',
    updateOrganizationFail(error: string) {
       return {
            type: organizationActions.UPDATE_ORGANIZATION_FAIL,
            data: error
       };
    },
};
