import onClickOutside from 'react-onclickoutside';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class DropdownBasic extends Component {
    render() {
        return (
            <div onClick={this.props.handleClickInside}>
                {this.props.children}
            </div>
        );
    }
}
export const Dropdown = onClickOutside(DropdownBasic);

Dropdown.proptypes = {
    handleClickOutside: PropTypes.func.isRequired,
    handleClickInside: PropTypes.func.isRequired,
};

/**
 * Helper component to handle the state of showing/hiding a dropdown
 */
export class DropdownContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            menuVisible: false,
        };

        // the ignore class name should be specific only this instance of the component
        //  in order to close other dropdown in case a new one is opened
        this.ignoreClassName = 'ignore-react-onclickoutside' + Date.now();
    }

    showMenu = () => {
        this.setState({ menuVisible: true });
    };

    toggleMenu = (e) => {
        e.stopPropagation();
        this.setState((state) => ({ menuVisible: !state.menuVisible }));
    };

    closeMenu = e => {
        e.stopPropagation();
        this.setState({ menuVisible: false });
    };

    render() {
        const { dropdownContent, useRightClick, ...props } = this.props;
        let main;

        if (useRightClick) {
            main = <div onContextMenu={this.showMenu}>{this.props.children}</div>;
        } else {
            main = <div className={this.ignoreClassName} onClick={this.toggleMenu}>{this.props.children}</div>;
        }

        return (
            <div {...props}>
                {main}
                { this.state.menuVisible &&
                <Dropdown
                    outsideClickIgnoreClass={this.ignoreClassName}
                    handleClickOutside={this.closeMenu}
                    handleClickInside={this.closeMenu}
                >
                    {dropdownContent}
                </Dropdown> }
            </div>
        );
    }
}
