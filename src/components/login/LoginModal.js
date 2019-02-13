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
import PropTypes from 'prop-types';
import classNames from "classnames";
import style from "./style.less";
import OnlyIf from '../onlyIf';
import { authService, userService } from '../../services';
import {IconClose, IconSuperblocks, PictureVargavintern} from "../icons";
import GithubLoginButton from "../common/buttons/githubLogin";

export const LoginModal = (props) => {

    function onCloseClickHandle () {
        props.onCloseClick();
    }

    function onSuccess(response) {
        console.log("Success");
        console.log(response);

        props.loginSuccess();
        onCloseClickHandle();

        authService.githubAuth(response);
    }

    async function queryUserEndpoint() {
        const user = await userService.getUser();
        console.log(user);
    }

    function random() {
        props.loginSuccess();
        onCloseClickHandle();
    }

    function onFailure (e) {
        console.log("Failure");
        console.log(e);
    }

    function githubLogin() {
        props.githubLogin();
    }

    return (
        <div className={classNames([style.loginModal, props.customClassName, "modal"])}>
            <div className={style.container}>
                <div className={style.area}>
                    <PictureVargavintern className={style.background}/>
                    <OnlyIf test={!props.hideCloseButton}>
                        <IconClose className={style.closeIcon} onClick={onCloseClickHandle}/>
                    </OnlyIf>
                    <div className={style.headerText}>
                        <span>Login wih Github and sync all your projects</span>
                    </div >
                    <div className={style.superblocks}>
                        <IconSuperblocks />
                    </div>
                    <div className={style.promoText}>
                        <span>Discover the world's top blockchain companies and developers</span>
                    </div>
                </div>
                <div className={style.footer}>
                    <div className={style.buttonsContainer}>
                        <GithubLoginButton githubLogin={githubLogin}/>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default LoginModal;

LoginModal.propTypes = {
    onCloseClick: PropTypes.func,
    githubLogin: PropTypes.func.isRequired,
    hideCloseButton: PropTypes.bool,
    customClassName: PropTypes.string
};
