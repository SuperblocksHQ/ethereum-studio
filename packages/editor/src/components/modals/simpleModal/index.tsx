import React, { ReactNode } from 'react';
import style from './style.less';

interface IProps {
    onClose: () => void;
    children: ReactNode;
}

export const SimpleModal = (props: IProps) => {
    return (
        <div className={style.modalContainer} onClick={props.onClose}>
            <div className={style.modal}>
                {props.children}
            </div>
        </div>
    );
};

export default SimpleModal;
