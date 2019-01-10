import { from, of, empty } from 'rxjs';
import { switchMap, withLatestFrom, map, catchError, mergeMap, tap, filter, delayWhen } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { getSelectedProjectId } from '../../selectors/projects';
import { ipfsActions } from '../../actions';

const addProjectToUserList = (backend, control) => {
    return new Promise((resolve, reject) => {
        backend.assignNewInode(1, () => {
            control._loadProjects(() => {
                control._closeProject(status => {
                    if (status == 0) {
                        // Open last project
                        control.openProject(
                            control._projectsList[
                                control._projectsList.length - 1
                            ]
                        );
                        backend._stripIpfsHash();
                        backend.deleteProject(1, () => {})
                        resolve();
                    } else {
                        reject("Couldn't close the project")
                    }
                })
            })
        })
    })
};

const forkTempProject$ = (backend, router) => from(addProjectToUserList(backend, router.control));

const forkOwnProject$ = (projectId, backend, router) => of(projectId).pipe(
    tap(console.log("Forking own project")),
    switchMap(() => {
        if(confirm('Are you sure you want to fork your own project?')) {
            return from(backend.getProjectFiles(projectId)).pipe(
                map(backend.modifyDappFile),
                tap(modifiedFiles => router.control.importProject(modifiedFiles, false))
            )
        } else {
            return empty();
        }
    })
);

const forkProject = (action$, state$, { backend, router }) => action$.pipe(
    ofType(ipfsActions.FORK_PROJECT),
    withLatestFrom(state$),
    switchMap(([,state]) => {
        const projectId = getSelectedProjectId(state);
        return of(projectId)
        .pipe(
            switchMap(projectId => {
                // project from a shared link
                // assign a new inode number to existing project
                if (projectId === 1) {
                    return forkTempProject$(backend, router);
                } else {
                    return forkOwnProject$(projectId, backend, router);
                }
            }),
            map(ipfsActions.forkProjectSuccess),
            catchError((error) => {
                console.log("There was an issue forking the project: " + error);
                return of(ipfsActions.forkProjectFail())
            })
        )
    })
);

export default forkProject;
