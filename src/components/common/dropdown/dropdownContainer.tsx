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

import React from 'react';
import { DropdownBasic } from './dropDownBasic';

interface IProps {
    dropdownContent: React.ReactNode;
    useRightClick?: boolean;
    children: React.ReactNode;
    showMenu: boolean;
    onCloseMenu?: () => void;
    enableClickInside?: boolean;
    className?: string;
}
interface IState { menuVisible: boolean; }

/**
 * Helper component to handle the state of showing/hiding a dropdown
 */
export class DropdownContainer extends React.Component<IProps, IState> {

    public static defaultProps = {
        showMenu: false
    };
    ignoreClassName: string;
    constructor(props: IProps) {
        super(props);
        this.state = {
            menuVisible: this.props.showMenu,
        };

        // the ignore class name should be specific only this instance of the component
        //  in order to close other dropdown in case a new one is opened
        this.ignoreClassName = 'ignore-react-onclickoutside' + Date.now();
    }

    componentDidUpdate(prevProps: IProps) {
        if (prevProps.showMenu !== this.props.showMenu) {
            this.setState({
                menuVisible: this.props.showMenu
            });
        }
    }

    showMenu = () => {
        this.setState({ menuVisible: true });
    }

    toggleMenu: React.MouseEventHandler = (e) => {
        e.stopPropagation();
        this.setState((state) => ({ menuVisible: !state.menuVisible }));
    }

    closeMenu: React.MouseEventHandler = e => {
        e.stopPropagation();

        if (this.props.onCloseMenu) {
            this.props.onCloseMenu();
        }

        this.setState({ menuVisible: false });
    }

    render() {
        const { dropdownContent, useRightClick, enableClickInside, className, ...props } = this.props;
        let main: React.ReactNode;

        if (useRightClick) {
            main = <div onContextMenu={this.showMenu}>{this.props.children}</div>;
        } else {
            main = <div className={this.ignoreClassName} onClick={this.toggleMenu}>{this.props.children}</div>;
        }

        return (
            <div className={className}>
                {main}
                { this.state.menuVisible &&
                <DropdownBasic
                    outsideClickIgnoreClass={this.ignoreClassName}
                    handleClickOutside={this.closeMenu}
                    handleClickInside={!enableClickInside ? this.closeMenu : undefined}
                >
                    {dropdownContent}
                </DropdownBasic> }
            </div>
        );
    }
}
