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

import { IPipeline } from '../models';

export const pipelinesActions = {

    GET_PROJECT_PIPELINE_LIST: 'GET_PROJECT_PIPELINE_LIST',
    getProjectPipelineList(projectId: string) {
        return {
            type: pipelinesActions.GET_PROJECT_PIPELINE_LIST,
            data: { projectId },
        };
    },
    GET_PROJECT_PIPELINE_LIST_SUCCESS: 'GET_PROJECT_PIPELINE_LIST_SUCCESS',
    getProjectPipelineListSuccess(pipelineList: IPipeline[]) {
        return {
            type: pipelinesActions.GET_PROJECT_PIPELINE_LIST_SUCCESS,
            data: { pipelineList }
        };
    },
    GET_PROJECT_PIPELINE_LIST_FAIL: 'GET_PROJECT_PIPELINE_LIST_FAIL',
    getProjectPipelineListFail(error: any) {
        return {
            type: pipelinesActions.GET_PROJECT_PIPELINE_LIST_FAIL,
            data: error
        };
    },
    GET_PIPELINE: 'GET_PIPELINE',
    getPipeline() {
        return {
            type: pipelinesActions.GET_PIPELINE,
        };
    },
    GET_PIPELINE_SUCCESS: 'GET_PIPELINE_SUCCESS',
    getPipelineSuccess(pipeline: IPipeline) {
        return {
            type: pipelinesActions.GET_PIPELINE_SUCCESS,
            data: { pipeline }
        };
    },
    GET_PIPELINE_FAIL: 'GET_PIPELINE_FAIL',
    getPipelineFail(error: any) {
        return {
            type: pipelinesActions.GET_PIPELINE_FAIL,
            data: error
        };
    },
};
