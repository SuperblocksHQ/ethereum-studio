import onClickOutside from 'react-onclickoutside';
import { h, Component } from 'preact';
import PropTypes from 'prop-types';


/**
 * Simple wrapper component over the react-onclickoutside to maek easier the usage of the component
 */
class DropdownBasic extends Component {
    render() {
        return (
            <div onClick={this.props.handleClickInside}>
                { this.props.children }
            </div>
        )
    }
}
export const Dropdown = onClickOutside(DropdownBasic);

Dropdown.proptypes = {
    handleClickOutside: PropTypes.func.isRequired,
    handleClickInside: PropTypes.func.isRequired,
}

/**
 * Helper component to handle the state of showing/hiding a dropdown
 */
export class DropdownContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showMenu: false,
        }
    }

    showMenu = (showMenu) => {
        this.setState({ showMenu: true });
    }

    closeMenu = () => {
        this.setState({ showMenu: false });
    }

    render() {
        let { dropdownContent, useRightClick, ...props } = this.props;
        if (useRightClick) {
            var main = (
                <div onContextMenu={this.showMenu} >
                    { this.props.children }
                </div>
            );
        }
        else {
            var main = (
                <div onClick={this.showMenu} >
                    { this.props.children }
                </div>
            );
        }
        return (
        <div {...props}>
            {main}
            { this.state.showMenu ?
                    <Dropdown
                        handleClickOutside={this.closeMenu}
                        handleClickInside={this.closeMenu}>
                        { dropdownContent }
                    </Dropdown>
                : null }
        </div>
        )
    }
}
