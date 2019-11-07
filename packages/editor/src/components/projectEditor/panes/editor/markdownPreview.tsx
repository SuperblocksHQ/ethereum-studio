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
import { Converter } from 'showdown';
import showdownHighlight from 'showdown-highlight';
import style from './style-markdown-preview.less';

interface IProps {
    markdown?: string;
}

export const MarkdownPreview = (props: IProps) => {
    const converter: Converter = new Converter({
        extensions: [showdownHighlight],
        openLinksInNewWindow: true
    });

    return (
        <div className={style.overflowFix}>
            <div
                className={style.markdownPreview}
                dangerouslySetInnerHTML={{__html: converter.makeHtml(props.markdown ? props.markdown : '')}}
            />
        </div>
    );
};
