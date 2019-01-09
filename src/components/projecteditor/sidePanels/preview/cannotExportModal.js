import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from '../../../modal/new';

export function CannotExportModal(props) {
    return (
        <Modal onClose={props.onClose}>
            <h2>Cannot export DApp for the Browser network</h2>
            <div style={{ textAlign: 'center' }}>
                <p>Computer says no.</p>
                <p>
                    When you download your creation, it is configured for
                    the specific network you have chosen (up to the far
                    left). Right now you have chosen the Browser network,
                    which only exists in your browser when using Superblocks
                    Lab, so downloading your DApp makes no sense until you
                    choose any other network than Browser.
                </p>
                <div style={{marginTop: 15}}>
                    <a className="btn2" onClick={props.onClose}>
                        Thanks, but I already knew that
                    </a>
                </div>
            </div>
        </Modal>
    );
}

CannotExportModal.propTypes = {
    onClose: PropTypes.func.isRequired
};
