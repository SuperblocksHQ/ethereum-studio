import { connect } from 'react-redux';
import { accountActions } from '../../../../actions';
import AccountConfigModal from './AccountConfigModal';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';
import { accountSelectors, projectSelectors } from '../../../../selectors';
import { IAccount } from '../../../../models/state';

const mapStateToProps = (state: any) => ({
    account: projectSelectors.getSelectedAccount(state),
    environments: projectSelectors.getEnvironments(state),
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
    return {
        updateAccountName(account: IAccount, newName: string) {
            dispatch(accountActions.updateAccountName(account, newName));
        },
        // saveAccountConfig(accountConfig: IAccount) {
        //     dispatch(accountActions.saveContractConfig(accountConfig));
        // }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountConfigModal);
