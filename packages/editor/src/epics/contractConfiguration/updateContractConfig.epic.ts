import { ofType } from 'redux-observable';
import { AnyAction } from 'redux';
import { compilerActions, panesActions, contractConfigActions } from '../../actions';
import { withLatestFrom, switchMap, catchError } from 'rxjs/operators';
import { IContractConfiguration, IProjectItem, ProjectItemTypes } from '../../models';
import { findItemByPath, traverseTree } from '../../reducers/explorerLib';
import { empty, of } from 'rxjs';
import { ConstructorArgumentsList } from '../../components/projectEditor/editors/contractConfigModal/constructorArgumentsList';
import { number } from 'prop-types';

export const updateContractConfig = (action$: AnyAction, state$: any) => action$.pipe(
    ofType(compilerActions.HANDLE_COMPILE_OUTPUT),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
        console.log(state$);
        const firstKey = Object.keys(action.data.contracts)[0];
        const secondKey = Object.keys(action.data.contracts[firstKey])[0];
        const compilerOutputData = action.data.contracts[firstKey][secondKey].metadata;
        const parsedCompilerOutputData = JSON.parse(compilerOutputData);
        const constructorData = parsedCompilerOutputData.output.abi.filter((obj: { type: string; }) => obj.type === 'constructor');
        console.log('constructor data', constructorData);
        const numberOfArgs = constructorData[0].inputs.length;
        const dappFileItem: Nullable<IProjectItem> = findItemByPath(state.explorer.tree, ['dappfile.json'], ProjectItemTypes.File);
        console.log('BRUH', dappFileItem);
        if (dappFileItem != null && dappFileItem.code != null) {
            const code = dappFileItem.code;
            const parsedCode = JSON.parse(code);
            console.log('parsed code', parsedCode);
            console.log('NUMBER OF ARGS', numberOfArgs);
            console.log('DAPP FILE ARGS', parsedCode.contracts[0].args.length);
            if (numberOfArgs > parsedCode.contracts[0].args.length) {
                for (const el of constructorData[0].inputs.slice(1)) {

                    parsedCode.contracts[0].args.push({ type: 'value', value: el.name });
                }
                console.log('after all', parsedCode);
                return [panesActions.saveFile(dappFileItem.id, JSON.stringify(parsedCode, null, 4))];
            }
            //TODO: not working as intended, find a better way
            if (numberOfArgs < parsedCode.contracts[0].args.length) {
                for (let el of constructorData[0].inputs) {
                    el = { type: 'value', value: el.name };
                    const arr = [el];
                    parsedCode.contracts[0].args = arr;
                }
                console.log('after all 2', parsedCode);
                return [panesActions.saveFile(dappFileItem.id, JSON.stringify(parsedCode, null, 4))];
            } else {
                return empty();
            }
        } else {
            return empty();
        }

    }),
    catchError((err: any) => {
        console.log('Error while updating the contract configuration: ', err);
        return of(compilerActions.HANDLE_COMPILE_OUTPUT);
    })
);
