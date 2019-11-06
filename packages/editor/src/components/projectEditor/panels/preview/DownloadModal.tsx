import React from 'react';
import style from './style.less';
import { SimpleModal } from '../../../modals/simpleModal';
import { IEnvironment } from '../../../../models/state';
import { StyledButton } from '../../../common';
import { StyledButtonType } from '../../../common/buttons/StyledButtonType';

interface IProps {
    onDownload: () => void;
    onClose: () => void;
    environment: IEnvironment;
}

export function DownloadModal(props: IProps) {
    return (
        <SimpleModal onClose={props.onClose}>
            <h2>Download DApp for the <b>{props.environment.name}</b> network</h2>
            <div style={{ textAlign: 'center' }}>
                <p>
                    You are downloading this DApp pre-configured for the{' '}
                    <b>{props.environment.name}</b> network.
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
                <div className={style.modalButtonsContainer}>
                    <StyledButton
                        type={StyledButtonType.Secondary}
                        text='Cancel'
                        onClick={props.onClose}
                        className={style.cancelButton}
                    />
                    <StyledButton
                        type={StyledButtonType.Primary}
                        text='Download'
                        onClick={props.onDownload}
                    />
                </div>
            </div>
        </SimpleModal>
    );
}
