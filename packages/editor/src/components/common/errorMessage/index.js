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

import React, { PureComponent } from 'react';

class ErrorMessage extends PureComponent {
  static errorToMessage(error) {
    switch (error) {
      case 'GAS_LIMIT':
        return (
          <div id="error.gasLimit">
            {"The Gas Limit has to be between 1 and 7900000"}
          </div>
        );
      case 'GAS_PRICE':
        return (
          <div id="error.gasPrice">
            {"The Gas Price has to be between 1 and 100000000000"}
          </div>
        );
      case 'PROJECT_NAME':
        return (
          <div id="error.projectName">
            {"Invalid project name. Only alphanumeric characters are allowed."}
          </div>
        );
      case 'ACCOUNT_NAME':
        return (
          <div id="error.accountName">
            {"Invalid account name. Only alphanumeric characters are allowed."}
          </div>
        );
      default:
        // eslint-disable-next-line no-unused-expressions
        (error);
        return error;
    }
  }

  render() {
    const {
      error,
      originalErrorMessage,
      ...props
    } = this.props;
    if (!error) return null;
    const message = ErrorMessage.errorToMessage(error);
    const dev = process.env.NODE_ENV !== 'production';
    return (
      <div {...props} >
        {message}
        {dev && originalErrorMessage != null && `\n${originalErrorMessage}`}
      </div>
    );
  }
}

export default ErrorMessage;
