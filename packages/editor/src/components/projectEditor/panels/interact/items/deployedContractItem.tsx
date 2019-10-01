import React from 'react';
import { IconFolderOpen, IconContract } from '../../../../icons';
import BaseItem from './baseItem';
import { IDeployedContract } from '../../../../../models';

interface IProps {
    data: IDeployedContract;
    children: JSX.Element | Nullable<JSX.Element>[];
    depth: number;
    onToggle(id: string): void;
    onClick(data: IDeployedContract): void;
}

export function DeployedContractItem(props: IProps) {
    const { depth } = props;

    return (
        <div>
            <BaseItem
                {...props}
                depth={depth}
                togglable={true}
                icon={ <IconContract /> }
                iconOpen={ <IconContract /> }
            >
            </BaseItem>
        </div>
    );
}

export default DeployedContractItem;
