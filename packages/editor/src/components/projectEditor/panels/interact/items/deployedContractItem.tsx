import React from 'react';
import style from '../style.less';
import { IconContract } from '../../../../icons';
import BaseItem from './baseItem';
import { IDeployedContract } from '../../../../../models/state';
import AbiList from './abiItemList';

interface IProps {
    data: IDeployedContract;
    depth: number;
    onToggle(id: string): void;
    onClick(data: IDeployedContract): void;
}

export function DeployedContractItem(props: IProps) {
    const { data, depth } = props;

    return (
        <div>
            <BaseItem
                {...props}
                depth={depth}
                togglable={true}
                icon={ <IconContract /> }
                iconOpen={ <IconContract /> }
            >
                {data.deployed ?
                    <div className={style.interactContainer}>
                        <div className={style.title}>Contract Address:</div>
                        <div className={style.address} title={data.address}>{data.address}</div>
                        <div className={style.title}>Interact:</div>
                        <AbiList deployedContract={data} />
                    </div> :
                    <div className={style.noContracts}>
                        <p>Contract is not found on current network. Please deploy it first.</p>
                    </div>
                }
            </BaseItem>
        </div>
    );
}
