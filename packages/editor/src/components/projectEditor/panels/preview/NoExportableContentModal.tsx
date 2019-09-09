import React from 'react';
import { SimpleModal } from '../../../modals/simpleModal';

interface IProps {
    onClose: () => void;
}

export function NoExportableContentModal(props: IProps) {
    return (
        <SimpleModal onClose={props.onClose}>
            <h2>Error: Cannot download DApp.</h2>
            <div>The DApp contracts are not deployed yet.</div>
        </SimpleModal>
    );
}
