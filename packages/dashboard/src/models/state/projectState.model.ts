import { IProjectItem } from '../project';

export interface IProjectState {
    projectList: Partial<IProjectItem[]>;
    loadingProjectList: boolean;
    project?: Partial<IProjectItem>;
    loadingProject: boolean;
}
