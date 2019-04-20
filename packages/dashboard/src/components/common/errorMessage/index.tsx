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

interface IProps {
    error: string;
    originalErrorMessage?: string;
    className: string;
}
class ErrorMessage extends PureComponent<IProps> {
  static errorToMessage(error: string) {
    switch (error) {
      case 'PROJECT_NAME':
        return (
          <div id='error.projectName'>
            {'Invalid project name. Only alphanumeric characters are allowed.'}
          </div>
        );
      default:
        return error;
    }
  }

  render() {
    const { error, originalErrorMessage, ...props} = this.props;
    if (!error) {
        return null;
    }
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
