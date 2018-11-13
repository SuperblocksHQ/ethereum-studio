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

import {FontAwesomeIcon as FaIcon} from '@fortawesome/react-fontawesome';
import {faSync as iconRun} from '@fortawesome/free-solid-svg-icons/faSync'
import {faSave as iconSave} from '@fortawesome/free-regular-svg-icons/faSave';
import {faPuzzlePiece as iconCompile} from '@fortawesome/free-solid-svg-icons/faPuzzlePiece';
import {faCog as iconConfigure} from '@fortawesome/free-solid-svg-icons/faCog';
import {faTrashAlt as iconTrash} from '@fortawesome/free-regular-svg-icons/faTrashAlt';
import {faGem as iconGem} from '@fortawesome/free-regular-svg-icons/faGem';
import {faFile as iconFile} from '@fortawesome/free-solid-svg-icons/faFile';
import {faFileAlt as iconFileAlt} from '@fortawesome/free-regular-svg-icons/faFileAlt';
import {faFileImport as IconFileImport} from '@fortawesome/free-solid-svg-icons/faFileImport';
import {faFolder as iconFolder} from '@fortawesome/free-solid-svg-icons/faFolder';
import {faFolder as iconFolderOpen} from '@fortawesome/free-regular-svg-icons/faFolder';
import {faCube as iconCube} from '@fortawesome/free-solid-svg-icons/faCube';
import {faPlusSquare as iconPlus} from '@fortawesome/free-solid-svg-icons/faPlusSquare';
import {faArrowUp as iconUp} from '@fortawesome/free-solid-svg-icons/faArrowUp';
import {faArrowDown as iconDown} from '@fortawesome/free-solid-svg-icons/faArrowDown';
import {faLongArrowAltRight as iconRight} from '@fortawesome/free-solid-svg-icons/faLongArrowAltRight';
import {faClone as iconClone} from '@fortawesome/free-solid-svg-icons/faClone';
import {faUpload as iconUpload} from '@fortawesome/free-solid-svg-icons/faUpload';
import {faExchangeAlt as iconExchangeAlt} from '@fortawesome/free-solid-svg-icons/faExchangeAlt';
import {faCheck as iconCheck} from '@fortawesome/free-solid-svg-icons/faCheck';
import {faTimes as iconClose} from '@fortawesome/free-solid-svg-icons/faTimes';
import {faQuestionCircle as iconQuestionCircle} from '@fortawesome/free-regular-svg-icons/faQuestionCircle';
import {faTwitter as iconTwitter} from '@fortawesome/free-brands-svg-icons/faTwitter';
import {faGithub as iconGithub} from '@fortawesome/free-brands-svg-icons/faGithub';
import {faDiscord as iconDiscord} from '@fortawesome/free-brands-svg-icons/faDiscord';
import {faLock as iconLock} from '@fortawesome/free-solid-svg-icons/faLock';
import {faLockOpen as iconLockOpen} from '@fortawesome/free-solid-svg-icons/faLockOpen';
import {faPencilAlt as iconPencil} from '@fortawesome/free-solid-svg-icons/faPencilAlt';
import {faArrowAltCircleDown as iconDownload} from '@fortawesome/free-regular-svg-icons/faArrowAltCircleDown';
import {faThLarge as iconMosaic} from '@fortawesome/free-solid-svg-icons/faThLarge';
import {faLink as iconChain} from '@fortawesome/free-solid-svg-icons/faLink';

class IconImg extends Component {
    render() {
        let { width, height, ...props } = this.props;

        let defaults = {
            height: height || 14,
            width: width || 14,
        };

        return <img {...props} {...defaults} />;
    }
}

export const IconDeployGreen = ({...props}) => <IconImg src={'/static/img/icon-deploy-green.svg'} {...props} />;
export const IconAddFile = ({...props}) => <svg preserveAspectRatio="xMidYMid meet" fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="16" height="16" style={{ verticalAlign: "middle" }}><polygon points="12,3 8,3 8,4 11,4 11,7 14,7 14,14 6,14 6,8 5,8 5,15 15,15 15,6"/><path d="M7 3.018h-2v-2.018h-1.981v2.018h-2.019v1.982h2.019v2h1.981v-2h2v-1.982z" {...props}/></svg>;
export const IconAddFolder = ({...props}) => <svg preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" width="16" height="16" style={{ verticalAlign: "middle" }}><polygon points="9,3 8,5 8,2 6,2 6,0 2,0 2,2 0,2 0,6 2,6 2,8 2,15 16,15 16,3"/><path d="M14 4h-4.382l-1 2h-2.618v2h-3v6h12v-10h-1zm0 2h-3.882l.5-1h3.382v1z" fill="#fff"/><polygon points="7,3.018 5,3.018 5,1 3.019,1 3.019,3.018 1,3.018 1,5 3.019,5 3.019,7 5,7 5,5 7,5" fill="#fff"/><polygon points="14,5 14,6 10.118,6 10.618,5" {...props}/></svg>;
export const IconRun = () => <FaIcon icon={iconRun} />;
export const IconSave = () => <FaIcon icon={iconSave} />;
export const IconCompile = () => <FaIcon icon={iconCompile} />;
export const IconDeploy = ({ ...props }) => (
    <IconImg src={'/static/img/icon-deploy.svg'} {...props} />
);
export const IconConfigure = ({ ...props }) => <FaIcon icon={iconConfigure} />;
export const IconInteract = ({ ...props }) => (
    <IconImg src={'/static/img/icon-interact.svg'} {...props} />
);
export const IconTrash = () => <FaIcon icon={iconTrash} />;
export const IconGem = () => <FaIcon icon={iconGem} />;
export const IconFile = () => <FaIcon icon={iconFile} />;
export const IconFileAlt = () => <FaIcon icon={iconFileAlt} />;
export const IconImportFile = () => <FaIcon icon={IconFileImport} />;
export const IconFolder = () => <FaIcon icon={iconFolder} color="#49616C" />;
export const IconFolderOpen = () => (
    <FaIcon icon={iconFolderOpen} color="#49616C" />
);
export const IconAngleRight = ({ ...props }) => (
    <IconImg src={'/static/img/icon-arrow-right.svg'} {...props} />
);
export const IconAngleDown = ({ ...props }) => (
    <IconImg src={'/static/img/icon-arrow-down.svg'} {...props} />
);
export const IconCube = () => <FaIcon icon={iconCube} />;
export const IconPlus = () => <FaIcon icon={iconPlus} />;
export const IconUp = () => <FaIcon icon={iconUp} />;
export const IconDown = () => <FaIcon icon={iconDown} />;
export const IconRight = () => <FaIcon icon={iconRight} />;
export const IconClone = () => <FaIcon icon={iconClone} />;
export const IconDownload = ({ ...props }) => (
    <FaIcon icon={iconDownload} {...props} />
);
export const IconUpload = () => <FaIcon icon={iconUpload} />;
export const IconDropdown = ({ ...props }) => (
    <span className="dropDown" {...props} />
);
export const IconClose = ({ ...props }) => (
    <FaIcon icon={iconClose} {...props} />
);
export const IconAdd = ({ ...props }) => (
    <IconImg src={'/static/img/icon-add-contract.svg'} {...props} />
);
export const IconLock = ({ ...props }) => <FaIcon icon={iconLock} {...props} />;
export const IconLockOpen = ({ ...props }) => (
    <FaIcon icon={iconLockOpen} {...props} />
);
export const IconEdit = ({ ...props }) => (
    <FaIcon icon={iconPencil} {...props} />
);
export const IconMetamask = ({ ...props }) => (
    <IconImg src={'/static/img/icon-metamask-logo.svg'} {...props} />
);
export const IconMetamaskLocked = ({ ...props }) => (
    <IconImg src={'/static/img/icon-metamask-logo-locked.svg'} {...props} />
);
export const IconPublicAddress = ({ ...props }) => (
    <IconImg src={'/static/img/icon-public-address.svg'} {...props} />
);
export const IconMosaic = ({ ...props }) => (
    <FaIcon icon={iconMosaic} {...props} />
);

// Top Bar
export const IconTransactions = ({ ...props }) => (
    <FaIcon icon={iconExchangeAlt} {...props} />
);
export const IconCollaborate = ({ ...props }) => (
    <IconImg src={'src="/static/img/icon-collaborate.png'} {...props} />
);
export const IconProjectSelector = ({ ...props }) => (
    <IconImg src={'/static/img/icon-project-selector.svg'} {...props} />
);
export const IconHelp = () => <FaIcon icon={iconQuestionCircle} />;
export const IconCheck = () => <FaIcon icon={iconCheck} />;

// File types
export const IconContract = ({...props}) => <IconImg src={'/static/img/icon-solidity.svg'} {...props} />;
export const IconHtml = ({...props}) => <IconImg src={'/static/img/icon-html.svg'} {...props} />;
export const IconJS = ({...props}) => <IconImg src={'/static/img/icon-js.svg'} {...props} />;
export const IconCss = ({...props}) => <IconImg src={'/static/img/icon-css.svg'} {...props} />;
export const IconMd = ({...props}) => <IconImg src={'/static/img/icon-md.svg'} {...props} />;
export const IconShowPreview = ({...props}) => <svg fill="currentColor" preserveAspectRatio="xMidYMid meet" height="16px" width="16px" viewBox="0 0 204.5 204.5" style={{ verticalAlign: "bottom" }}><path d="M27,33 L173,33 C178.522847,33 183,37.4771525 183,43 L183,157 C183,162.522847 178.522847,167 173,167 L27,167 C21.4771525,167 17,162.522847 17,157 L17,43 C17,37.4771525 21.4771525,33 27,33 Z M29,64 L29,156 L171,156 L171,64 L29,64 Z M84.260356,82.6998802 L119.974518,107.161635 C121.797124,108.409995 122.262642,110.899505 121.014282,112.722111 C120.734924,113.129973 120.38238,113.482517 119.974518,113.761875 L84.260356,138.223629 C82.4377502,139.471989 79.9482404,139.006471 78.6998802,137.183866 C78.2439706,136.518238 78,135.730302 78,134.92351 L78,86 C78,83.790861 79.790861,82 82,82 C82.8067925,82 83.594728,82.2439706 84.260356,82.6998802 Z" id="Combined-Shape" fill="inherit" {...props}></path></svg>
export const IconJSON = ({...props}) => <IconImg src={'/static/img/icon-json.svg'} {...props} />;
export const IconBinary = ({...props}) => <IconImg src={'/static/img/icon-binary.svg'} width="17px" height="17px" {...props} />;

// Learn and Resouces
export const IconGuide = ({ ...props }) => (
    <IconImg src={'/static/img/icon-guide.svg'} {...props} />
);
export const IconVideoTutorials = ({ ...props }) => (
    <IconImg src={'/static/img/icon-video-tutorials.svg'} {...props} />
);
export const IconHelpCenter = ({ ...props }) => (
    <IconImg src={'/static/img/icon-help-center.svg'} {...props} />
);
export const IconAskQuestion = ({ ...props }) => (
    <IconImg src={'/static/img/icon-ask-question.svg'} {...props} />
);
export const IconWhatsNew = ({ ...props }) => (
    <IconImg src={'/static/img/icon-whats-new.svg'} {...props} />
);

// External services
export const IconTwitter = ({...props}) => <FaIcon icon={iconTwitter} {...props} />;
export const IconGithub = ({...props}) => <FaIcon icon={iconGithub} {...props} />;
export const IconDiscord = ({...props}) => <FaIcon icon={iconDiscord} {...props}/>;


// Preferences
export const IconChain = ({...props}) => <FaIcon icon={iconChain} {...props} />;

