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

import { organizationActions } from '../actions';
import { IOrganizationState } from '../models/state';
import { AnyAction } from 'redux';

export const initialState: IOrganizationState = {
    organizationList: [],
    loadingOrganizationList: false,
    organization: undefined,
    showCreateOrganizationModal: false,
    showDeleteOrganizationModal: false,
    showInvitePeopleModal: false,
};

export default function projectsReducer(state = initialState, action: AnyAction) {
    switch (action.type) {
        case organizationActions.GET_ORGANIZATION_LIST: {
            return {
                ...state,
                loadingOrganizationList: true
            };
        }
        case organizationActions.GET_ORGANIZATION_LIST_SUCCESS: {
            return {
                ...state,
                organizationList: action.data.organizationList,
                loadingOrganizationList: false
            };
        }
        case organizationActions.GET_ORGANIZATION_LIST_FAIL: {
            console.log('Error retrieving organization list: ', action.data);

            return {
                ...state,
                organizationList: [],
                loadingOrganizationList: false
            };
        }
        case organizationActions.LOAD_ORGANIZATION_SUCCESS: {
            return {
                ...state,
                organization: { ...action.data.organization },
            };
        }
        case organizationActions.LOAD_ORGANIZATION_FAIL: {
            console.log('project load failed', action.data);

            return {
                ...state,
            };
        }
        case organizationActions.DELETE_ORGANIZATION_FAIL: {
            return {
                ...state,
                organization: null
            };
        }
        case organizationActions.UPDATE_ORGANIZATION_SUCCESS: {
            return {
                ...state,
                organization: { ...action.data.organization }
            };
        }
        case organizationActions.TOGGLE_CREATE_ORGANIZATION_MODAL: {
            return {
                ...state,
                showCreateOrganizationModal: !state.showCreateOrganizationModal
            };
        }
        case organizationActions.TOGGLE_DELETE_ORGANIZATION_MODAL: {
            return {
                ...state,
                showDeleteOrganizationModal: !state.showDeleteOrganizationModal
            };
        }
        case organizationActions.TOGGLE_INVITE_PEOPLE_MODAL: {
            return {
                ...state,
                showInvitePeopleModal: !state.showInvitePeopleModal
            };
        }
        default:
            return state;
    }
}
