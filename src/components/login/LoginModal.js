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
import Proptypes from 'prop-types';
import classNames from "classnames";
import style from "./style.less";
import ModalHeader from "../modal/modalHeader";
import GitHubLogin from "./github";

import { authService, userService } from '../../services';

export const LoginModal = (props) => {

    function onCloseClickHandle () {
        props.onCloseClick();
    }

    function onSuccess(response) {
        console.log("Success")
        console.log(response);
        onCloseClickHandle();

        authService.githubAuth(response);
    }

    async function queryUserEndpoint() {
        const user = await userService.getUser();
        console.log(user);
    }

    function onFailure (e) {
        console.log("Failure")
        console.log(e);
    }

    return (
        <div className={classNames([style.importModal, "modal"])}>
            <div className={style.container}>
                <ModalHeader
                    classname={style.header}
                    title="Login"
                    onCloseClick={onCloseClickHandle}
                />
                <div className={style.area}>
                    <GitHubLogin clientId="b6117ba12bf5f306cdad"
                                 redirectUri="http://localhost:3000/github/callback"
                                 scope=""
                                 onSuccess={onSuccess}
                                 onFailure={onFailure}
                    />
                    <br />
                    <button onClick={queryUserEndpoint}>
                        QueryUserEndpoint
                    </button>
                </div>
                <div className={style.footer}>
                    <div className={style.buttonsContainer}>
                        <button onClick={onCloseClickHandle} className="btn2 noBg mr-2">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );

};

LoginModal.proptypes = {
    onCloseClick: Proptypes.func.isRequired,
};
