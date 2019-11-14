// Copyright 2018 Superblocks AB
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

import React, { useRef, useEffect } from 'react';
import classNames from 'classnames';
import style from '../../style-console.less';
import { IOutputLogRow } from '../../../../models/state';
import { IconTrash } from '../../../icons';
import { Tooltip } from '../../../common';

interface IProps {
    outputRows: IOutputLogRow[];
    clearOutputLog: () => void;
}

export const OutputPanel = (props: IProps) => {
    const messagesAnchor: any = useRef(null);

    const scrollToBottom = () => {
        if (messagesAnchor !== null && messagesAnchor.current !== null) {
            messagesAnchor.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    });

    return (
        <div className='scrollable-y'>
            <div className={style.console}>
                <div className={style.actionMenu}>
                    <button className={classNames([style.icon, 'btnNoBg'])} onClick={props.clearOutputLog}>
                        <Tooltip title='Clear All'>
                            <IconTrash />
                        </Tooltip>
                    </button>
                </div>
                <div className={style.terminal}>
                    { props.outputRows.map((row, index) => {
                        return row.msg.toString().split('\n').map((line: string, lineIndex: number) => {
                            let cl = style.std1;
                            if (row.channel === 2) {
                                cl = style.std2;
                            } else if (row.channel === 3) {
                                cl = style.std3;
                            } else if (row.channel === 4) {
                                cl = style.std4;
                            }
                            return <div key={index + lineIndex} className={cl}>{line}</div>;
                        });
                    })}
                    <div ref={messagesAnchor} />
                </div>
            </div>
        </div>
    );
};
