import { connect } from 'react-redux';
import { accountActions } from '../../../../actions';
import AccountConfigModal from './AccountConfigModal';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';
import { projectSelectors, contractConfigSelectors } from '../../../../selectors';
import { IAccount } from '../../../../models/state';

const mapStateToProps = (state: any) => ({
    accounts: projectSelectors.getAccounts(state),
    selectedContract: contractConfigSelectors.getSelectedContract(state),
    otherContracts: contractConfigSelectors.getOtherContracts(state)
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
    return {
        saveAccountConfig(accountConfig: IAccount) {
            dispatch(accountActions.saveContractConfig(accountConfig));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountConfigModal);
