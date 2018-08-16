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
        console.log("firing1");
        this.setState({ showMenu: true });
    }

    closeMenu = () => {
        console.log("firing");
        this.setState({ showMenu: false });
    }

    render() {
        let { dropdownContent, ...props } = this.props;
        return (
        <div {...props}>
            <div onClick={this.showMenu} >
                { this.props.children }
            </div>

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
