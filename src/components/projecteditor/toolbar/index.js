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
import PropTypes from 'prop-types';
import classnames from 'classnames';
import style from './style.less';
import { IconRun } from '../../icons';

const Toolbar = ({
        id,
        isRunning,
        onTriggerActionClick,
        status,
        contractPath,
        iconTitle,
        infoTitle
    } = props) => {

    const cls = {};
    cls[style.running] = isRunning;
    return (
        <div className={style.toolbar} id={id + "_header"}>
            <div className={style.buttons}>
                <a className={classnames(cls)} href="#" title={iconTitle} onClick={onTriggerActionClick}><IconRun /></a>
            </div>
            <div className={style.status}>
                {status}
            </div>
            <div className={style.info}>
                <span>
                    {infoTitle} {contractPath}
                </span>
            </div>
        </div>
    );
}

// {contract}

Toolbar.propTypes = {
    id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    contractPath: PropTypes.string.isRequired,
    onTriggerActionClick: PropTypes.func.isRequired,
    iconTitle: PropTypes.string.isRequired,
    infoTitle: PropTypes.string.isRequired,
    isRunning: PropTypes.bool
}

Toolbar.defaultProps = {
    isRunning: false
}

export default Toolbar;




