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

import { pipelinesActions } from '../actions';
import { IPipelineState } from '../models/state';
import { AnyAction } from 'redux';

export const initialState: IPipelineState = {
    projectPipelineList: [],
    loadingProjectPipelineList: false,
    pipeline: undefined,
    loadingPipeline: false,
};

export default function projectsReducer(state = initialState, action: AnyAction) {
    switch (action.type) {
        case pipelinesActions.GET_PROJECT_PIPELINE_LIST: {
            return {
                ...state,
                loadingProjectPipelineList: true
            };
        }
        case pipelinesActions.GET_PROJECT_PIPELINE_LIST_SUCCESS: {
            return {
                ...state,
                projectPipelineList: action.data.pipelineList,
                loadingProjectPipelineList: false
            };
        }
        case pipelinesActions.GET_PROJECT_PIPELINE_LIST_FAIL: {
            console.log('Error retrieving project pipeline list: ', action.data);

            return {
                ...state,
                projectPipelineList: [],
                loadingProjectPipelineList: false
            };
        }
        case pipelinesActions.GET_PIPELINE: {
            return {
                ...state,
                loadingPipeline: true
            };
        }
        case pipelinesActions.GET_PIPELINE_SUCCESS: {
            return {
                ...state,
                pipeline: { ...action.data.pipeline },
                loadingPipeline: false
            };
        }
        case pipelinesActions.GET_PIPELINE_FAIL: {
            console.log('pipeline load failed', action.data);

            return {
                ...state,
                loadingPipeline: false
            };
        }
        default:
            return state;
    }
}
