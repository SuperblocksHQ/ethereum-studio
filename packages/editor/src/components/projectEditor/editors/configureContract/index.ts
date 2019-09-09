import { connect } from 'react-redux';
import { projectsActions } from '../../../../actions';
import ConfigureContract from './ConfigureContract';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';

const mapStateToProps = (state: any) => ({
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfigureContract);
