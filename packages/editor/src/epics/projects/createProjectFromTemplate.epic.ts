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

import { of, from } from 'rxjs';
import { switchMap, withLatestFrom, catchError, tap } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { projectsActions } from '../../actions';
import { projectService} from '../../services/project.service';
import { ITemplate } from '../../models';
import * as analytics from '../../utils/analytics';

export const createProjectFromTemplateEpic: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(projectsActions.CREATE_PROJECT_FROM_TEMPLATE_REQUEST),
    withLatestFrom(state$),
    switchMap(([action]) => {
        const template: ITemplate = action.data.template;
        return from(projectService.createProject(template.content))
            .pipe(
                tap(() => analytics.logEvent('CREATE_PROJECT_FROM_TEMPLATE', { template: template.name } )),
                switchMap((newProject) => {
                    // Redirect
                    window.location.href = `${window.location.origin}/${newProject.id}?openFile=README.md`;

                    return [projectsActions.createProjectSuccess()];
                }),
                catchError((error) => {
                    console.log('There was an issue loading the project: ' + error);
                    return of(projectsActions.loadProjectFail(error));
                }
            )
        );
    })
);

