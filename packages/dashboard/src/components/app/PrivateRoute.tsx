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

import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { GenericLoading } from '../common';

interface IProps {
    render: (props: any) => JSX.Element;
    isAuthenticated: boolean;
    isLoading: boolean;
    path: string;
    exact: boolean;
}

const PrivateRoute = ({ render, isAuthenticated, isLoading, ...rest }: IProps) => (
    isLoading
    ? <GenericLoading />
    : <Route {...rest} render={(props) => (
      isAuthenticated === true
        ? render(props)
        : <Redirect to={{
                pathname: '/login',
                state: { from: props.location }
            }}
          />
    )} />
  );

export default PrivateRoute;
