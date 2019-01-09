import onClickOutside from 'react-onclickoutside';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Simple wrapper component over the react-onclickoutside to make easier the usage of the component
 */
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
            main = <div className="ignore-react-onclickoutside" onClick={this.toggleMenu}>{this.props.children}</div>;
        }

        return (
            <div {...props}>
                {main}
                { this.state.menuVisible &&
                <Dropdown
                    handleClickOutside={this.closeMenu}
                    handleClickInside={this.closeMenu}
                >
                    {dropdownContent}
                </Dropdown> }
            </div>
        );
    }
}
