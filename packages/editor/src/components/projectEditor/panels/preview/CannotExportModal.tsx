import React from 'react';
import style from './style.less';
import { SimpleModal } from '../../../modals/simpleModal';
import { StyledButton } from '../../../common';
import { StyledButtonType } from '../../../common/buttons/StyledButtonType';

interface IProps {
    onClose: () => void;
}

export function CannotExportModal(props: IProps) {
    return (
        <SimpleModal onClose={props.onClose}>
            <h2>Cannot export DApp for the Browser network</h2>
            <div style={{ textAlign: 'center' }}>
                <p>Computer says no.</p>
                <p>
                    When you download your creation, it is configured for
                    the specific network you have chosen (up to the far
                    left). Right now you have chosen the Browser network,
                    which only exists in your browser when using Ethereum Studio,
                    so downloading your DApp makes no sense until you
                    choose any other network than Browser.
                </p>
                <div className={style.modalButtonsContainer}>
                    <StyledButton
                        type={StyledButtonType.Primary}
                        text='Thanks, but I already knew that'
                        onClick={props.onClose}
                    />
                </div>
            </div>
        </SimpleModal>
    );
}
