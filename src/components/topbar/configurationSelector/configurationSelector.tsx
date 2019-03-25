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
import classnames from 'classnames';
import style from '../../networkAccountSelector/style.less';
import { DropdownContainer } from '../../common';
import { IconDropdown, IconDeploy } from '../../icons';

interface IProps {
    items: { id: string, name: string, active: boolean } [];
    onChange(id: string): void;
    onAddConfig(): void;
}

export function ConfigurationSelector(props: IProps) {
    const selectedItem = props.items.find(p => p.active);

    const dropDownContent = props.items.map(i => (
        <div
            key={i.name}
            onClick={e => props.onChange(i.id)}
            className={classnames(style.networkLink, style.capitalize, {[style.networkLinkChosen]: i.active})}
        >
            {i.name}
        </div>
    ));

    return (
        <div className={style.container}>
            <div className={style.actionWrapper}></div>
            <DropdownContainer dropdownContent={
                <div className={style.networks}>
                    <div onClick={props.onAddConfig}
                        className={classnames(style.networkLink, style.capitalize)}>
                        New configuration...
                    </div>
                    {dropDownContent}
                </div>
            }>
                <div className={classnames([style.selector])}>
                    <IconDeploy />
                    <div className={classnames([style.capitalize, style.nameContainer])}>
                        {selectedItem && selectedItem.name}
                    </div>
                    <div className={style.dropdownIcon}>
                        <IconDropdown />
                    </div>
                </div>
            </DropdownContainer>
        </div>
    );
}
