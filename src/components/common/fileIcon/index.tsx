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

import { IconContract, IconHtml, IconCss, IconJS, IconMd, IconJSON, IconBinary, IconFile } from '../../icons';
import React from 'react';
import { getFileExtension } from '../../../utils/file';

interface IProps {
    filename: string;
}

export function FileIcon(props: IProps) {
    const fileExtension = getFileExtension(props.filename);
    switch (fileExtension) {
        case 'sol':
            return <IconContract />;
        case 'html':
            return <IconHtml />;
        case 'css':
            return <IconCss />;
        case 'js':
            return <IconJS />;
        case 'md':
            return <IconMd />;
        case 'json':
            return <IconJSON />;
        case 'bin':
            return <IconBinary />;
        default:
            return <IconFile />;
    }
}
