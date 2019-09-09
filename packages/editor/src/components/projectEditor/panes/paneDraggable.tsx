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
import { DropTarget, DragSource, DragSourceSpec, ConnectDropTarget, ConnectDragSource } from 'react-dnd';

interface IProps {
    index: number;
    isOver: boolean;
    isRoot?: boolean;
    isDragging: boolean;
    connectDragSource: ConnectDragSource;
    connectDropTarget: ConnectDropTarget;
    onMovePane: (fromIndex: number, toIndex: number) => void;
}

// Target container in which the Pane was dropped
const entryTarget = {
    // Returns index of the Pane on drop
    drop: (props: any, monitor: any) => {
        const { index } = props;

        if (monitor.didDrop()) {
            return;
        }

        return {
            index
        };
    },
};

function collectTarget(connectMonitor: any, monitor: any) {
    return {
        connectDropTarget: connectMonitor.dropTarget(),
        isOver: monitor.isOver({ shallow: true }),
    };
}

// Source Pane which is being dragged
const entrySource: DragSourceSpec<IProps, {}> = {
    beginDrag(props: any) {
        const { index } = props;

        return {
            index
        };
    },
    endDrag(props: any, monitor: any) {
        if (!monitor.didDrop()) {
            return;
        }

        const targetId = monitor.getDropResult().index;
        props.onMovePane(props.index, targetId);
    },
    canDrag(props: any) {
        if (props.isRoot) {
            return false;
        }
        return true;
    }
};

const collectSource = (connect: any, monitor: any) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
});

export class Draggable extends React.Component<IProps, {} > {
    render() {
        const { connectDragSource, connectDropTarget, isOver, isDragging, isRoot } = this.props;
        const cls = [
            isOver ? style.isOver : null,
            isDragging ? style.isDragging : null,
            isRoot ? style.isRoot : null
        ];

        return connectDropTarget(
            connectDragSource(
                <div className={classNames(cls)}>
                    {this.props.children}
                </div>
            )
        );
    }
}

export default DropTarget('PANE', entryTarget, collectTarget)(
    DragSource('PANE', entrySource, collectSource)(Draggable)
);
