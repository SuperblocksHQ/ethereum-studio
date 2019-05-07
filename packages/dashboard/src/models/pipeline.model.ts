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

export enum PipelineStatus {
    Queued = 'queued',
    Running = 'running',
    Success = 'success',
    Failed = 'failed',
}

export interface IJob {
    id: string;
    status: string;
    log: string;
}

export interface IPipelineCommit {
    ownerAvatar: string;
    ownerName: string;
    repository: string;
    description: string;
    hash: string;
    branch: string;
    branchUrl: string;
    commitUrl: string;
}

export interface IPipeline {
    id: string;
    projectId: string;
    commit: IPipelineCommit;
    jobs: IJob[];
    status: PipelineStatus;
    createdAt: Date;
    startedAt: Date;
    finishedAt: Date;
}
