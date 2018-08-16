import onClickOutside from 'react-onclickoutside';
import { h, Component } from 'preact';
import PropTypes from 'prop-types';


/**
 * Simple wrapper component over the react-onclickoutside to maek easier the usage of the component
 */
class DropdownBasic extends Component {}
const Dropdown = onClickOutside(DropdownBasic);

export default Dropdown;

Dropdown.proptypes = {
    handleClickOutside: PropTypes.func.isRequired,
}
