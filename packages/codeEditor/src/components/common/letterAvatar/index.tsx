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
import classNames from 'classnames';

interface IProps {
    title: string;
    customClassName?: string;
}

export class LetterAvatar extends React.Component<IProps> {
    render() {
        const { title, customClassName } = this.props;

        // Colors taken from https://flatuicolors.com/palette/se
        const defaultColors = [
            '#ef5777',
            '#575fcf',
            '#4bcffa',
            '#0be881',
            '#f53b57',
            '#3c40c6',
            '#0fbcf9',
            '#00d8d6',
            '#05c46b',
            '#ffc048',
            '#ffdd59',
            '#ff5e57',
            '#d2dae2',
            '#485460',
            '#ffa801',
            '#ff3f34',
            '#808e9b',
        ];

        function sumChars(str: string) {
            let sum = 0;
            for (let i = 0; i < str.length; i++) {
                sum += str.charCodeAt(i);
            }

            return sum;
        }

        // Pick a deterministic color from the list
        const color = sumChars(title) % defaultColors.length;
        const background = defaultColors[color];

        return (
            <div className={classNames([style.letterAvatar, customClassName])} style={{backgroundColor: background}}>
                <div className={style.letterAvatarInner}>
                    {title[0]}
                </div>
            </div>
        );
    }
}
