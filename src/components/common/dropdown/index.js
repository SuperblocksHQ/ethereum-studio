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

    state = {
        showMenu: this.props.showMenu,
    }

    constructor(props) {
        super(props);

        // the ignore class name should be specific only this instance of the component
        //  in order to close other dropdown in case a new one is opened
        this.ignoreClassName = 'ignore-react-onclickoutside' + Date.now();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.showMenu !== this.props.showMenu) {
            this.setState({
                showMenu: {...this.props.showMenu}
            });
        }
    }

    showMenu = () => {
        this.setState({ showMenu: true });
    };

    toggleMenu = (e) => {
        e.stopPropagation();
        this.setState((state) => ({ showMenu: !state.showMenu }));
    };

    closeMenu = e => {
        e.stopPropagation();

        if (this.props.onCloseMenu) {
            this.props.onCloseMenu();
        }

        this.setState({ showMenu: false });
    };

    render() {
        const { dropdownContent, useRightClick, enableClickInside, className } = this.props;
        let main;

        if (useRightClick) {
            main = <div onContextMenu={this.showMenu}>{this.props.children}</div>;
        } else {
            main = <div className={this.ignoreClassName} onClick={this.toggleMenu}>{this.props.children}</div>;
        }

        return (
            <div className={className}>
                {main}
                { this.state.showMenu &&
                <Dropdown
                    outsideClickIgnoreClass={this.ignoreClassName}
                    handleClickOutside={this.closeMenu}
                    handleClickInside={!enableClickInside ? this.closeMenu : undefined}
                >
                    {dropdownContent}
                </Dropdown> }
            </div>
        );
    }
}

DropdownContainer.proptypes = {
    enableClickInside: PropTypes.bool,
    dropdownContent: PropTypes.object,
    className: PropTypes.string.object,
    showMenu: PropTypes.bool,
    onCloseMenu: PropTypes.func,
};
