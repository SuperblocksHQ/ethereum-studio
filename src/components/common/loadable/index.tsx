// Copyright 2019 Superblocks AB
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

import React from 'react';
import Loadable from 'react-loadable';

const divStyle = {
    color: 'white',
};

// Creating a wrapper HOF breaks Babel, so can only export Loading component
export class Loading extends React.Component<
    Loadable.LoadingComponentProps
    > {
    render() {
        return (
            <div>
                {this.props.error || this.props.timedOut ? (
                    <>
                        Unexpected error while loading your content! Please try again later.
                    </>
                ) : this.props.pastDelay ? (
                    <div>
                       <h2 style={divStyle}>Loading...</h2>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        );
    }
}
