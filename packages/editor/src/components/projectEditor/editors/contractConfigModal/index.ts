import { connect } from 'react-redux';
import { contractConfigActions, deployerActions } from '../../../../actions';
import ContractConfigModal from './ContractConfigModal';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';
import { IContractConfiguration, IProjectItem } from '../../../../models';
import { projectSelectors, contractConfigSelectors } from '../../../../selectors';

const mapStateToProps = (state: any) => ({
    accounts: projectSelectors.getAccounts(state),
    selectedContract: contractConfigSelectors.getSelectedContract(state),
    tree: state.explorer.tree
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
    return {
        saveContractConfig(contractConfig: IContractConfiguration) {
            dispatch(contractConfigActions.saveContractConfig(contractConfig));
        },
        onDeployContract: (file: IProjectItem) => {
            dispatch(deployerActions.deployContract(file));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ContractConfigModal);
