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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './style.less';
const classNames = require('classnames');

function noop() {
}

class Switch extends Component {
  constructor(props) {
    super(props);

    let checked = false;
    if ('checked' in props) {
      checked = !!props.checked;
    } else {
      checked = !!props.defaultChecked;
    }
    this.state = { checked };
  }

  componentDidMount() {
    const { autoFocus, disabled } = this.props;
    if (autoFocus && !disabled) {
      this.focus();
    }
  }

  componentWillReceiveProps(nextProps) {
    if ('checked' in nextProps) {
      this.setState({
        checked: !!nextProps.checked,
      });
    }
  }

  setChecked(e, checked) {
    if (this.props.disabled) {
      return;
    }
    if (!('checked' in this.props)) {
      this.setState({
        checked,
      });
    }
    this.props.onChange(e, checked);
  }

  toggle = (e) => {
    const { onClick } = this.props;
    const checked = !this.state.checked;
    this.setChecked(e, checked);
    onClick(checked);
  }

  handleKeyDown = (e) => {
    if (e.keyCode === 37) { // Left
      this.setChecked(e, false);
    } else if (e.keyCode === 39) { // Right
      this.setChecked(e, true);
    }
  }

  // Handle auto focus when click switch in Chrome
  handleMouseUp = (e) => {
    if (this.node) {
      this.node.blur();
    }
    if (this.props.onMouseUp) {
      this.props.onMouseUp(e);
    }
  }

  focus() {
    this.node.focus();
  }

  blur() {
    this.node.blur();
  }

  saveNode = (node) => {
    this.node = node;
  }

  render() {
    const { className, prefixCls, disabled, loadingIcon,
      checkedChildren, unCheckedChildren, ...restProps } = this.props;
    const checked = this.state.checked;
    const switchClassName = classNames({
      [className]: !!className,
      [prefixCls]: true,
      [prefixCls.checked]: checked,
      [prefixCls.disabled]: disabled,
    });

    return (
      <button
        {...restProps}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className={switchClassName}
        ref={this.saveNode}
        onKeyDown={this.handleKeyDown}
        onClick={this.toggle}
        onMouseUp={this.handleMouseUp}
      >
        {loadingIcon}
        <span className={prefixCls.inner}>
          {checked ? checkedChildren : unCheckedChildren}
        </span>
      </button>
    );
  }
}

Switch.propTypes = {
  className: PropTypes.string,
  prefixCls: PropTypes.string,
  disabled: PropTypes.bool,
  checkedChildren: PropTypes.any,
  unCheckedChildren: PropTypes.any,
  onChange: PropTypes.func,
  onMouseUp: PropTypes.func,
  onClick: PropTypes.func,
  tabIndex: PropTypes.number,
  checked: PropTypes.bool,
  defaultChecked: PropTypes.bool,
  autoFocus: PropTypes.bool,
  loadingIcon: PropTypes.node,
};

Switch.defaultProps = {
  prefixCls: style.switchPrefixCls,
  checkedChildren: null,
  unCheckedChildren: null,
  className: '',
  defaultChecked: false,
  onChange: noop,
  onClick: noop,
};

export default Switch;
