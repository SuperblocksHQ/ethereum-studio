import {IProjectItem, ProjectItemTypes} from '../models';
import {findItemByPath} from '../reducers/explorerLib';
import {FunctionTypes, IAbiFunctionModel, IFunctionModel} from '../models/abiFunction.model';

export function getContractAbis(project: IProjectItem) {
    const buildFolder = findItemByPath(project, ['build', 'contracts'], ProjectItemTypes.Folder);

    if (buildFolder) {
        return buildFolder.children.map((directory) => {
            // each deployed smart contract has a separate directory
            const projectItem = directory.children.find((contract) => contract.name.endsWith('.abi'));

            if (projectItem) {
                return projectItem.code;
            }
        });
    }
}

export function determineType(abiObject: IAbiFunctionModel) {
    if (abiObject.payable) {
        return FunctionTypes.Payable;
    }
    if (abiObject.constant) {
        return FunctionTypes.Constant;
    } else {
        return FunctionTypes.Transaction;
    }
}

export function getFunctionsFromAbi(abi: any): IFunctionModel[] {
    const abiObjects: IAbiFunctionModel[] = JSON.parse(abi);

    return abiObjects
        .filter((abiObject: IAbiFunctionModel) => abiObject.type !== 'constructor')
        .map((abiObject) => {
            const {name, inputs } = abiObject;

            const functionType = determineType(abiObject);
            return { name, inputs, functionType};
        });
}
