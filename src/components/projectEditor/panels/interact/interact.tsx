// Copyright 2019 Superblocks AB
//
// This file is part of Superblocks Lab.
//
// Superblocks Lab is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.
//
// Superblocks Lab is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Superblocks Lab.  If not, see <http://www.gnu.org/licenses/>.

import React from 'react';
import style from './style.less';
import { IDeployedContract } from '../../../../models';
import { DeployedContractItem } from './items/deployedContractItem';

interface IProps {
    deployedItems: IDeployedContract[];
}

export class InteractPanel extends React.Component<IProps> {

    render() {
        const { deployedItems } = this.props;

        return (
            <div className={ style.treeContainer }>
                {
                    deployedItems.map((item, index) => (
                        <DeployedContractItem key={ item.id }
                            data={item}
                            depth={0}
                            onClick={ (i: IDeployedContract) => console.log(i.id) }
                            onToggle={ () => console.log('toggled')  }>
                            { <div>Patata</div> }
                        </DeployedContractItem>
                    ))
                }
            </div>
        );
    }
}
