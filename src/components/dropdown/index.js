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

DropdownBasic.proptypes = {
    handleClickOutside: PropTypes.func.isRequired,
    handleClickInside: PropTypes.func.isRequired,
};

/**
 * Helper component to handle the state of showing/hiding a dropdown
 */
export class DropdownContainer extends Component {

    state = {
        showMenu: this.props.showMenu ? this.props.showMenu : false,
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

    closeMenu = e => {
        e.stopPropagation();

        if (this.props.onCloseMenu) {
            this.props.onCloseMenu();
        }

        this.setState({ showMenu: false });
    };

    render() {
        let { dropdownContent, useRightClick, enableClickInside, className } = this.props;
        if (useRightClick) {
            var main = (
                <div onContextMenu={this.showMenu}>{this.props.children}</div>
            );
        } else {
            var main = <div onClick={this.showMenu}>{this.props.children}</div>;
        }

        return (
            <div className={className}>
                {main}
                {this.state.showMenu ? (
                    <Dropdown
                        handleClickOutside={this.closeMenu}
                        handleClickInside={!enableClickInside ? this.closeMenu : undefined}
                    >
                        {dropdownContent}
                    </Dropdown>
                ) : null}
            </div>
        );
    }
}

DropdownBasic.proptypes = {
    enableClickInside: PropTypes.bool,
    dropdownContent: PropTypes.object,
    className: PropTypes.string.object,
    useRightClick: PropTypes.bool,
    showMenu: PropTypes.bool,
    onCloseMenu: PropTypes.func,
};
