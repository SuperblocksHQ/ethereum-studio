import react, {Component} from 'react';

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
import classNames from "classnames";
import style from "./style.less";
import {IconAngleDown} from "../icons";
import {MenuItem} from "../common/menu";
import { DropdownContainer } from "../common/dropdown";

class Loggedin extends Component{

   constructor(props) {
       super(props);
       this.state = {
           isExtended: false
       }
   }

    logout = () => {
        this.props.logout();
        this.setState({isExtended: false})
    };

    triggerDropdown = () => {
        this.setState(prevState => ({
            isExtended: !prevState.isExtended
        }));
    };

    render() {
        const isExtended = this.state.isExtended;

        return (
            <React.Fragment>
                <DropdownContainer
                    className={style.actionMenu}
                    dropdownContent={
                        <div className={style.menuDialog} >
                            <MenuItem onClick={this.logout} title="Logout" />
                        </div>
                    }>
                    <button
                        className={classNames([style.actionMenu, style.container, "btnNoBg"])}
                        onClick={this.triggerDropdown}
                    >
                        <img className={style.profilePicture} src={this.props.profileImageUrl}/>
                        <div className={style.caret} >
                            <IconAngleDown className={style.angleDown}/>
                        </div>
                    </button>
                </DropdownContainer>
            </React.Fragment>
        );
    }

};

export default Loggedin;

Loggedin.propTypes = {
};
