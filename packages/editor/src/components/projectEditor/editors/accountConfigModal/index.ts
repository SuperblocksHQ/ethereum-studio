import { connect } from 'react-redux';
import { accountActions, projectsActions } from '../../../../actions';
import AccountConfigModal from './AccountConfigModal';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';
import { accountsConfigSelectors, projectSelectors } from '../../../../selectors';
import { IAccount } from '../../../../models/state';

const mapStateToProps = (state: any) => ({
    accountInfo: accountsConfigSelectors.getAccountInfo(state),
    environments: projectSelectors.getEnvironments(state),
    environment: accountsConfigSelectors.getEnvironment(state),
    accounts: state.projects.accounts
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
    return {
        updateAccountName(account: IAccount, newName: string) {
            dispatch(accountActions.updateAccountName(account, newName));
        },
        changeEnvironment(environmentName: string) {
           dispatch(accountActions.changeEnvironment(environmentName));
        },
        updateAddress(address: string) {
            dispatch(accountActions.updateAddress(address));
        },
        openWallet(walletName: string) {
            dispatch(projectsActions.openWallet(walletName));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountConfigModal);
