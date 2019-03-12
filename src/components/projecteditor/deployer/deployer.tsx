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
import { MainnetWarning } from './mainnetWarning';
import OnlyIf from '../../onlyIf';
import { Modal } from '../../modal/new';

interface IProps {
    projectName: string;
    showMainnetWarning: boolean;
    showExternalProviderInfo: boolean;
    hideMainnetWarning(): void;
    deployToMainnet(): void;
}

export function Deployer(props: IProps) {
    return (
        <React.Fragment>
            <OnlyIf test={props.showMainnetWarning}>
                <MainnetWarning
                    projectName={props.projectName}
                    onCloseClick={props.hideMainnetWarning}
                    onDeployConfirmed={props.deployToMainnet} />
            </OnlyIf>
            <OnlyIf test={props.showExternalProviderInfo}>
                <Modal onClose={() => null}>
                    <h2>WARNING: Invoking external account provider</h2>
                    <div style={{textAlign: 'center'}}>Please understand that Superblocks Lab has no power over which network is targeted
                    when using an external provider. It is your responsibility that the network is the same as it is expected to be.</div>
                </Modal>
            </OnlyIf>
        </React.Fragment>
    );
}
