import React from 'react';
import PropTypes from 'prop-types';
import { SimpleModal } from './../../../modals/simpleModal';

export function NoExportableContentModal(props) {
    return (
        <SimpleModal onClose={props.onClose}>
            <h2>Error: Cannot download DApp.</h2>
            <div>The DApp contracts are not deployed yet.</div>
        </SimpleModal>
    );
}

NoExportableContentModal.propTypes = {
    onClose: PropTypes.func.isRequired
};
