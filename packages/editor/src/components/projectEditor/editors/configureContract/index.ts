import { connect } from 'react-redux';
import { projectsActions, contractConfigurationActions } from '../../../../actions';
import ConfigureContract from './ConfigureContract';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';
import { IContractConfiguration } from '../../../../models';

const mapStateToProps = (state: any) => ({
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
    return {
        saveContractConfig(contractConfig: IContractConfiguration) {
            dispatch(contractConfigurationActions.saveContractConfiguration(contractConfig));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfigureContract);
