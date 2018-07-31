// Copyright 2018 Superblocks AB
//
// This file is part of Superblocks Studio.
//
// Superblocks Studio is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.
//
// Superblocks Studio is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Superblocks Studio.  If not, see <http://www.gnu.org/licenses/>.

import { IconFile } from '../icons';

export default class Item {
    props;
    constructor(props) {
        if(props.state.open==null) props.state.open=true;
        if(props.toggable==null) props.toggable = (props.children!=null && props.children.length>0);
        this.props=props;
    }

    getId = () => {
        return this.props.state.id;
    };

    getChildren = (goLazy) => {
        if(this.props.state.children==null) this.props.state.children=[];
        if(this.props.state.children instanceof Function) {
            if(this.props._lazy && !goLazy) return this.props.state._children || [];
            return this.props.state.children(this);
        }
        return this.props.state.children;
    };

    getTitle = () => {
        return this.props.title;
    }

    getIcon = () => {
        return this.props.icon ? this.props.icon : <IconFile />;
    };
}
