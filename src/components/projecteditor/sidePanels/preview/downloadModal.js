import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from '../../../modal/new';

export function DownloadModal(props) {
    return (
        <Modal onClose={props.onClose}>
            <h2>Download DApp for the {props.environment} network</h2>
            <div style={{ 'textAlign': 'center' }}>
                <p>
                    You are downloading this DApp preconfigured for the{' '}
                    {props.environment} network.
                </p>
                <p>
                    The HTML file you are about to download contains everything
                    which the DApp needs, such as HTML, CSS, Javascript,
                    contract data and network configurations.
                </p>
                <p>
                    After download you can upload the DApp HTML file to any
                    (decentralized) web host of choice.
                </p>
                <div style={{marginTop: 15}}>
                    <a  className="btn2"
                        style={{marginRight: 30}}
                        onClick={props.onClose}>
                        Cancel
                    </a>
                    <a className="btn2 filled" onClick={props.onDownload}>
                        Download
                    </a>
                </div>
            </div>
        </Modal>
    );
}

DownloadModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onDownload: PropTypes.func.isRequired,
    environment: PropTypes.string.isRequired
};
