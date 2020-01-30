import { ofType } from 'redux-observable';
import { AnyAction } from 'redux';
import { compilerActions, panesActions, contractConfigActions } from '../../actions';
import { withLatestFrom, switchMap, catchError } from 'rxjs/operators';
import { IContractConfiguration, IProjectItem, ProjectItemTypes } from '../../models';
import { findItemByPath, traverseTree } from '../../reducers/explorerLib';
import { empty, of } from 'rxjs';

export const updateContractConfig = (action$: AnyAction, state$: any, rootState: any) => action$.pipe(
    ofType(compilerActions.HANDLE_COMPILE_OUTPUT),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
        console.log(state$);
        const firstKey = Object.keys(action.data.contracts)[0];
        const secondKey = Object.keys(action.data.contracts[firstKey])[0];
        const compilerOutputData = action.data.contracts[firstKey][secondKey].metadata;
        const parsedCompilerOutputData = JSON.parse(compilerOutputData);
        const constructorData = parsedCompilerOutputData.output.abi.filter((obj: { type: string; }) => obj.type === 'constructor');
        const numberOfArgs = constructorData[0].inputs.length;
        const rootItem = state$.value.explorer.tree.children;
        return contractConfigActions.CLOSE_CONTRACT_CONFIG;
    }),
    catchError((err: any) => {
        console.log('Error while updating the contract configuration: ', err);
        return of(compilerActions.HANDLE_COMPILE_OUTPUT);
    })
);
