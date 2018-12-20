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

// Items are recreated very often, so only keep state in the `state` object.
// The `state` object is copied from item to item.
// Only put real static scalars diurectly in `props`.
// A state object can be manipulated, but only with caution, since
// the proper way is to manipulate the dappfile through the ProjectItem and then the items will recreate and
// state will be copied. But for a few cases one must also directly manipulate the item state, such a case is when
// renaming an item such as it's `key` value is changed. then `reKey` the item and manipulate the dappfile config,
// the reloading and recreation of items will then merge gracefully.

import React, { Component } from 'react';
import {
    IconFile,
    IconFolder,
    IconFolderOpen,
    IconContract,
} from '../../../icons';
import Caret from '../../../caret';

import style from '../style.less';
import classnames from 'classnames';

export default class Item {
    props;
    static idCounter = 0;
    constructor(props, router, functions) {
        if (props.state == null) props.state = {};
        if (props.state.id == null) props.state.id = this.generateId();
        if (props.state.toggable == null) {
            props.state.toggable = props.state.children != null && props.state.children.length > 0;
        }
        if (props.state.toggable && props.state.open == null) {
            props.state.open = true;
        }

        this.props = props;
        this.router = router;
        this.functions = functions;

        // If item is open then we auto load the children, but we can't do it directly from the constructor since
        // a derived class might not be ready for it. So we put it in a timeout.
        if (this.props.state.open) {
            setTimeout(() => {
                this.getChildren(true, () => {
                    this.redraw();
                });
            }, 1);
        }
    }

    generateId = () => {
        return 'Item_' + ++Item.idCounter;
    };

    getId = () => {
        return this.props.state.id;
    };

    getName = () => {
        return this.props.state.name || '';
    };

    setName = name => {
        this.props.state.name = name;
    };

    /**
     * Return the parent item, if any.
     *
     */
    getParent = () => {
        return this.props.state.__parent;
    };

    /**
     * Set the children of this item.
     * Either an array or a function.
     *
     */
    setChildren = children => {
        this.props.state.children = children;
        if (this.props.state.children) {
            this.props.state.toggable = true;
        }
    };

    /**
     * Set hidden Item of this item.
     * This is a way of using items without showing them in the explorer.
     *
     * @param key: name of this item type.
     * @param: item
     *
     */
    setHiddenItem = (key, item) => {
        this.props.state.hiddenItems = this.props.state.hiddenItems || {};
        this.props.state.hiddenItems[key] = item;
    };

    getHiddenItem = key => {
        this.props.state.hiddenItems = this.props.state.hiddenItems || {};
        return this.props.state.hiddenItems[key];
    };

    getChildren = (force, cb) => {
        if (this.props.state.children instanceof Function) {
            if (this.props.lazy && !force)
                return this._sort(this.props.state._children || []);
            return this._sort(this.props.state.children(cb) || []);
            // We need to return empty set first time since it is async.
            // The callback will trigger when children are ready and cached.
        }
        if (this.props.state.children == null) this.props.state.children = [];
        if (cb) cb();
        return this._sort(this.props.state.children);
    };

    /** Override if needed */
    _sort = (items) => {
        return items;
    };

    getTitle = () => {
        return (this.props.state || {}).title;
    };

    getIcon = () => {
        return this.props.icon ? this.props.icon : <IconFile />;
    };

    getType = () => {
        return this.props.type;
    };

    getType2 = () => {
        return this.props.type2;
    };

    /**
     * Return the project item this item belongs to.
     *
     */
    getProject = () => {
        return this.props.state.project;
    };

    reKey = newKey => {
        this.props.state.key = newKey;
    };

    _copyState = (target, source, keyName) => {
        keyName = keyName || 'key';
        var ret = [];
        for (var index = 0; index < target.length; index++) {
            var targetChild = target[index];
            for (var index2 = 0; index2 < source.length; index2++) {
                var sourceChild = source[index2];
                // Compare properties.
                if (this._cmpItem(targetChild.props, sourceChild.props, keyName)) {
                    // Copy over original state object to new item.
                    // But copy back all value which are double underscored, those we actually want the latest properties of,
                    // such as `__parent`, which will refer to the newly created parent item.
                    // Also copy back any keys which are defined in targetChild._preserveProps array
                    const newState = targetChild.props.state;
                    targetChild.props.state = sourceChild.props.state;
                    const keys = Object.keys(newState);
                    for (let index = 0; index < keys.length; index++) {
                        let key = keys[index];
                        if (key.substr(0, 2) == '__' || (targetChild.props._preserveProps || []).indexOf(key) > -1) {
                            targetChild.props.state[key] = newState[key];
                        }
                    }

                    delete targetChild.props._preserveProps;
                }
            }
        }
    };

    _cmpItem = (item1, item2, keyName) => {
        return item1.state[keyName] === item2.state[keyName];
    };

    redraw = () => {
        if (this.router) this.router.control.redraw();
    };

    redrawMain = redrawAll => {
        if (this.router) this.router.main.redraw(redrawAll);
    };

    _openItem = (e, item) => {
        e.preventDefault();
        e.stopPropagation();

        if (this.router.panes) this.router.panes.openItem(this);
    };

    _angleClicked = e => {
        e.preventDefault();
        e.stopPropagation();
        this.props.state.open = !this.props.state.open;

        if (this.props.state.open && this.props.lazy) {
            this.getChildren(true, () => {
                // Since we get child list async, we need to redraw when we got it.
                this.redraw();
            });
        }
        // Always redraw
        this.redraw();
    };

    _renderIcons = (level, index) => {
        var caret;
        var isToggable =
            this.props.state.toggable &&
            (this.getChildren().length > 0 || this.props.lazy);
        if (isToggable) {
            caret = (
                <Caret
                    expanded={this.props.state.open}
                    onClick={e => this._angleClicked(e)}
                />
            );
        } else {
            caret = (
                <div className={style.nocaret} />
            );
        }

        var iconOpen;
        var iconCollapsed;
        if (this.props.icon !== undefined) {
            iconOpen = this.props.icon;
            iconCollapsed = this.props.iconCollapsed || iconOpen;
        } else {
            if (this.props.type == 'folder') {
                iconOpen = <IconFolderOpen />;
                iconCollapsed = <IconFolder />;
            } else if (this.props.type2 == 'contract') {
                iconOpen = <IconContract />;
                iconCollapsed = <IconContract />;
            } else {
                iconOpen = <IconFile />;
                iconCollapsed = <IconFile />;
            }
        }

        var icon;
        if (iconOpen == null) {
            icon = <div className={style.noicon} />;
        } else {
            var iconIcon = iconCollapsed;
            if (this.props.state.open) {
                iconIcon = iconOpen;
            }
            if (isToggable) {
                icon = (
                    <div
                        className={style.icon}
                        onClick={e => this._angleClicked(e)}
                    >
                        {iconIcon}
                    </div>
                );
            } else {
                if (this.props.onClick) {
                    icon = (
                        <div
                            className={style.icon}
                            onClick={e => {
                                this.props.onClick(e, this);
                            }}
                        >
                            {iconIcon}
                        </div>
                    );
                } else {
                    icon = <div className={style.icon}>{iconIcon}</div>;
                }
            }
        }

        return (
            <div className={style.icons}>
                {caret}
                {icon}
            </div>
        );
    };

    _getClasses = (level, index) => {
        const cls = {};
        cls[style.item] = true;
        if (style['level' + level]) cls[style['level' + level]] = true;
        if (style['index' + index]) cls[style['index' + index]] = true;
        if (this.getChildren().length > 0 || this.props.lazy)
            cls[style.haschildren] = true;
        for (var i = 0; i < (this.props.classes || []).length; i++) {
            var classs = this.props.classes[i];
            if (style[classs]) {
                cls[style[classs]] = true;
            } else {
                cls[classs] = true;
            }
        }
        return cls;
    };

    _packageChildren = (level, index, renderedChildren) => {
        if (renderedChildren.length == 0) return;
        const cls = {};
        if (this.props.state.open == false) cls[style.collapsed] = true;
        return <div className={classnames(cls)}>{renderedChildren}</div>;
    };

    /**
     * Default render implementation.
     */
    _defaultRender = (level, index) => {
        return (
            <div title={this.props.state.title} className={style.title}>
                {this.getTitle()}
            </div>
        );
    };

    _render2 = (level, index, renderedChildren) => {
        var output;
        if (this.props.render) {
            output = this.props.render(level, index, this);
        } else {
            output = this._defaultRender(level, index, this);
        }

        const icons = this._renderIcons(level, index);
        const childrenPkg = this._packageChildren(
            level,
            index,
            renderedChildren
        );
        const classes = this._getClasses(level, index);
        const key = (level + index).toString();
        return (
            <div
                key={key}
                className={classnames(classes)}
                onClick={
                    this.props.onClick ? e => this.props.onClick(e, this) : null
                }
            >
                <div className={style.header}>
                    {icons}
                    {output}
                </div>
                {childrenPkg}
            </div>
        );
    };

    render = (level, index) => {
        level = level !== undefined ? level : 0;
        index = index !== undefined ? index : 0;
        const renderedChildren = this.getChildren().map((item, index2) => {
            return item.render(level + 1, index2);
        });
        return this._render2(level, index, renderedChildren);
    };
}
