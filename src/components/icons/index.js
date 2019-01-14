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
import {faShareAlt as iconShare} from '@fortawesome/free-solid-svg-icons/faShareAlt';
import {faCopy as iconCopy} from '@fortawesome/free-regular-svg-icons/faCopy';

class IconImg extends Component {
    render() {
        const { width, height, ...props } = this.props;

        const defaults = {
            height: height || 14,
            width: width || 14,
        };

        return <img {...props} {...defaults} />;
    }
}

export const IconDeployGreen = ({...props}) => <IconImg src={'/static/img/icon-deploy-green.svg'} {...props} />;
export const IconAddFile = ({...props}) => <svg preserveAspectRatio="xMidYMid meet" fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="16" height="16" style={{ verticalAlign: "middle" }}><polygon points="12,3 8,3 8,4 11,4 11,7 14,7 14,14 6,14 6,8 5,8 5,15 15,15 15,6"/><path d="M7 3.018h-2v-2.018h-1.981v2.018h-2.019v1.982h2.019v2h1.981v-2h2v-1.982z" {...props}/></svg>;
export const IconAddFolder = ({...props}) => <svg preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" width="16" height="16" style={{ verticalAlign: "middle" }}><polygon points="9,3 8,5 8,2 6,2 6,0 2,0 2,2 0,2 0,6 2,6 2,8 2,15 16,15 16,3"/><path d="M14 4h-4.382l-1 2h-2.618v2h-3v6h12v-10h-1zm0 2h-3.882l.5-1h3.382v1z" fill="#fff"/><polygon points="7,3.018 5,3.018 5,1 3.019,1 3.019,3.018 1,3.018 1,5 3.019,5 3.019,7 5,7 5,5 7,5" fill="#fff"/><polygon points="14,5 14,6 10.118,6 10.618,5" {...props}/></svg>;
export const IconInformation = ({...props}) => <IconImg src={'/static/img/icon-information.svg'} {...props} />;
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
export const IconDropdown = ({ ...props }) => (
    <span className="dropDown" {...props} />
);
export const IconClose = ({ ...props }) => <svg preserveAspectRatio="xMidYMid meet" fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="14px" width="14px" viewBox="0 0 512 512" style={{ verticalAlign: "middle" }} {...props}><path d="M405 136.798L375.202 107 256 226.202 136.798 107 107 136.798 226.202 256 107 375.202 136.798 405 256 285.798 375.202 405 405 375.202 285.798 256z"/></svg>
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
export const IconCopy = ({ ...props }) => (
    <FaIcon icon={iconCopy} {...props} />
);
export const IconBack= ({...props}) => <svg fill="currentColor" preserveAspectRatio="xMidYMid meet" height="16px" width="16px" viewBox="0 0 512 512" style={{ verticalAlign: "center" }} {...props}><path d="M427 234.625H167.296l119.702-119.702L256 85 85 256l171 171 29.922-29.924-118.626-119.701H427v-42.75z"/></svg>
export const IconWarning = ({...props}) => <svg fill="currentColor" preserveAspectRatio="xMidYMid meet" height="16px" width="16px" viewBox="0 0 512 512" style={{ verticalAlign: "center" }} {...props}><path d="M32 464h448L256 48 32 464zm248-64h-48v-48h48v48zm0-80h-48v-96h48v96z"/></svg>

// Top Bar
export const IconTransactions = ({ ...props }) => <svg fill="currentColor" preserveAspectRatio="xMidYMid meet" height="16px" width="16px" viewBox="0 0 512 512" style={{ verticalAlign: "middle" }} {...props}><path d="M388.9 266.3c-5.1-5-5.2-13.3-.1-18.4L436 200H211c-7.2 0-13-5.8-13-13s5.8-13 13-13h224.9l-47.2-47.9c-5-5.1-5-13.3.1-18.4 5.1-5 13.3-5 18.4.1l69 70c1.1 1.2 2.1 2.5 2.7 4.1.7 1.6 1 3.3 1 5 0 3.4-1.3 6.6-3.7 9.1l-69 70c-5 5.2-13.2 5.3-18.3.3zM123.1 404.3c5.1-5 5.2-13.3.1-18.4L76.1 338H301c7.2 0 13-5.8 13-13s-5.8-13-13-13H76.1l47.2-47.9c5-5.1 5-13.3-.1-18.4-5.1-5-13.3-5-18.4.1l-69 70c-1.1 1.2-2.1 2.5-2.7 4.1-.7 1.6-1 3.3-1 5 0 3.4 1.3 6.6 3.7 9.1l69 70c5 5.2 13.2 5.3 18.3.3z"/></svg>
export const IconCollaborate = ({ ...props }) => (
    <IconImg src={'src="/static/img/icon-collaborate.png'} {...props} />
);
export const IconProjectSelector = ({ ...props }) => (
    <IconImg src={'/static/img/icon-project-selector.svg'} {...props} />
);
export const IconHelp = () => <FaIcon icon={iconQuestionCircle} />;
export const IconCheck = () => <FaIcon icon={iconCheck} />;
export const IconShare = () => <FaIcon icon={iconShare} />;
export const IconUpload = ({...props}) => <svg fill="currentColor" preserveAspectRatio="xMidYMid meet" height="16px" width="16px" viewBox="0 0 512 512" style={{ verticalAlign: "center" }} {...props}><path d="M403.002 217.001C388.998 148.002 328.998 96 256 96c-57.998 0-107.998 32.998-132.998 81.001C63.002 183.002 16 233.998 16 296c0 65.996 53.999 120 120 120h260c55 0 100-45 100-100 0-52.998-40.996-96.001-92.998-98.999zM288 276v76h-64v-76h-68l100-100 100 100h-68z"/></svg>;
export const IconFork = ({...props}) => <svg fill="currentColor" preserveAspectRatio="xMidYMid meet" height="16px" width="16px" viewBox="0 0 512 512" style={{ verticalAlign: "center" }} {...props}><path d="M352 96c-38.6 0-70 31.4-70 70 0 33.4 23.7 61.9 55.9 68.5-1.2 19.1-10.3 29.3-27 42.2-20.4 15.7-46.7 20-65.3 23.4-40.7 7.4-62.9 27-72.5 40V170.8c15-2.8 28.7-10.5 39-21.9 11.6-12.9 18-29.5 18-46.9 0-38.6-31.4-70-70-70s-70 31.4-70 70c0 17 6.2 33.3 17.3 46.1 9.9 11.3 23.1 19.1 37.7 22.3v171.3c-14.5 3.2-27.8 11-37.7 22.3C96.2 376.7 90 393 90 410c0 38.6 31.4 70 70 70s70-31.4 70-70c0-23.4-11.6-44.9-30.7-57.9 8.6-9.7 24.5-19.6 51.1-24.4 21.6-3.9 52.6-9.6 77.4-28.8 23.6-18.2 36.7-36.5 38-64.3 32.3-6.5 56.1-35.1 56.1-68.6.1-38.6-31.3-70-69.9-70zm-234 6c0-23.2 18.8-42 42-42s42 18.8 42 42-18.8 42-42 42-42-18.8-42-42zm84 308c0 23.2-18.8 42-42 42s-42-18.8-42-42 18.8-42 42-42 42 18.8 42 42zm150-202c-23.2 0-42-18.8-42-42s18.8-42 42-42 42 18.8 42 42-18.8 42-42 42z"/></svg>

// File types
export const IconContract = ({...props}) => <IconImg src={'/static/img/icon-solidity.svg'} {...props} />;
export const IconHtml = ({...props}) => <IconImg src={'/static/img/icon-html.svg'} {...props} />;
export const IconJS = ({...props}) => <IconImg src={'/static/img/icon-js.svg'} {...props} />;
export const IconCss = ({...props}) => <IconImg src={'/static/img/icon-css.svg'} {...props} />;
export const IconMd = ({...props}) => <IconImg src={'/static/img/icon-md.svg'} {...props} />;
export const IconShowPreview = ({...props}) => <svg fill="currentColor" preserveAspectRatio="xMidYMid meet" height="16px" width="16px" viewBox="0 0 204.5 204.5" style={{ verticalAlign: "middle" }} {...props}><path d="M27,33 L173,33 C178.522847,33 183,37.4771525 183,43 L183,157 C183,162.522847 178.522847,167 173,167 L27,167 C21.4771525,167 17,162.522847 17,157 L17,43 C17,37.4771525 21.4771525,33 27,33 Z M29,64 L29,156 L171,156 L171,64 L29,64 Z M84.260356,82.6998802 L119.974518,107.161635 C121.797124,108.409995 122.262642,110.899505 121.014282,112.722111 C120.734924,113.129973 120.38238,113.482517 119.974518,113.761875 L84.260356,138.223629 C82.4377502,139.471989 79.9482404,139.006471 78.6998802,137.183866 C78.2439706,136.518238 78,135.730302 78,134.92351 L78,86 C78,83.790861 79.790861,82 82,82 C82.8067925,82 83.594728,82.2439706 84.260356,82.6998802 Z" id="Combined-Shape" fill="inherit"></path></svg>
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
export const IconChain = ({...props}) => <svg preserveAspectRatio="xMidYMid meet" fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="16px" width="16px" viewBox="0 0 512 512" style={{ verticalAlign: "middle" }} {...props}><path d="M74.6 256c0-38.3 31.1-69.4 69.4-69.4h88V144h-88c-61.8 0-112 50.2-112 112s50.2 112 112 112h88v-42.6h-88c-38.3 0-69.4-31.1-69.4-69.4zm85.4 22h192v-44H160v44zm208-134h-88v42.6h88c38.3 0 69.4 31.1 69.4 69.4s-31.1 69.4-69.4 69.4h-88V368h88c61.8 0 112-50.2 112-112s-50.2-112-112-112z"/></svg>;
export const IconAdvanced = ({...props}) => <svg preserveAspectRatio="xMidYMid meet" fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="16px" width="16px" viewBox="0 0 512 512" style={{ verticalAlign: "middle" }} {...props}><path d="M456.9 242.2l-26.1-4.2c-3.5-.6-6.1-3.3-6.6-6.8-.5-3.2-1-6.4-1.7-9.5-.7-3.4.9-6.9 3.9-8.6l23.1-12.8c3.6-1.8 5.3-6.1 3.9-9.9l-4-11c-1.4-3.8-5.4-6-9.4-5l-25.9 5c-3.4.7-6.9-1-8.6-4.1-1.5-2.8-3.1-5.6-4.8-8.4-1.8-3-1.6-6.8.7-9.5l17.3-19.9c2.8-3 2.9-7.5.3-10.6l-7.5-9c-2.6-3.1-7.1-3.8-10.5-1.5L378.3 130c-3 1.8-6.8 1.4-9.4-.9-2.4-2.1-4.9-4.2-7.4-6.2-2.7-2.2-3.8-5.9-2.5-9.1l9.4-24.7c1.6-3.7.2-8.1-3.3-10.1l-10.2-5.9c-3.5-2-8-1.1-10.4 2.2l-16.6 20.8c-2 2.5-4.9 3.8-8.5 2.5 0 0-5.6-2.3-9.8-3.7-3.3-1.1-5.6-4.2-5.5-7.7l.4-26.4c.2-4.1-2.6-7.7-6.6-8.4l-11.6-2c-4-.7-7.9 1.7-9.1 5.6l-8.6 25c-1.1 3.3-4.3 5.5-7.8 5.4-1.6 0-3.3-.1-4.9-.1s-3.3 0-4.9.1c-3.5.1-6.6-2.1-7.8-5.4l-8.6-25c-1.2-3.9-5.1-6.3-9.1-5.6l-11.6 2c-4 .7-6.8 4.3-6.6 8.4l.4 26.4c.1 3.5-2.1 6.4-5.5 7.7-2.3.9-7.3 2.8-9.7 3.7-2.8 1-6.1.2-8.8-2.9l-16.5-20.3c-2.4-3.3-6.9-4.2-10.4-2.2l-10.2 5.9c-3.5 2-5 6.4-3.3 10.1l9.4 24.7c1.2 3.3.2 7-2.5 9.1-2.5 2-5 4.1-7.4 6.2-2.6 2.3-6.4 2.7-9.4.9L111 116.3c-3.4-2.2-7.9-1.6-10.5 1.5l-7.5 9c-2.6 3.1-2.5 7.7.3 10.6l17.3 19.9c2.3 2.6 2.6 6.5.7 9.5-1.7 2.7-3.3 5.5-4.8 8.4-1.7 3.1-5.1 4.7-8.6 4.1l-25.9-5c-4-.9-8 1.2-9.4 5l-4 11c-1.4 3.8.3 8.1 3.9 9.9L85.6 213c3.1 1.7 4.6 5.2 3.9 8.6-.6 3.2-1.2 6.3-1.7 9.5-.5 3.5-3.2 6.2-6.6 6.8l-26.1 4.2c-4 .5-7.1 3.9-7.1 7.9v11.7c0 4.1 3 7.5 7.1 7.9l26.1 4.2c3.5.6 6.1 3.3 6.6 6.8.5 3.2 1 6.4 1.7 9.5.7 3.4-.9 6.9-3.9 8.6l-23.1 12.8c-3.6 1.8-5.3 6.1-3.9 9.9l4 11c1.4 3.8 5.4 6 9.4 5l25.9-5c3.4-.7 6.9 1 8.6 4.1 1.5 2.8 3.1 5.6 4.8 8.4 1.8 3 1.6 6.8-.7 9.5l-17.3 19.9c-2.8 3-2.9 7.5-.3 10.6l7.5 9c2.6 3.1 7.1 3.8 10.5 1.5l22.7-13.6c3-1.8 6.8-1.4 9.4.9 2.4 2.1 4.9 4.2 7.4 6.2 2.7 2.2 3.8 5.9 2.5 9.1l-9.4 24.7c-1.6 3.7-.2 8.1 3.3 10.1l10.2 5.9c3.5 2 8 1.1 10.4-2.2l16.8-20.6c2.1-2.6 5.5-3.7 8.2-2.6 3.4 1.4 5.7 2.2 9.9 3.6 3.3 1.1 5.6 4.2 5.5 7.7l-.4 26.4c-.2 4.1 2.6 7.7 6.6 8.4l11.6 2c4 .7 7.9-1.7 9.1-5.6l8.6-25c1.1-3.3 4.3-5.5 7.8-5.4 1.6 0 3.3.1 4.9.1s3.3 0 4.9-.1c3.5-.1 6.6 2.1 7.8 5.4l8.6 25c1.2 3.9 5.1 6.3 9.1 5.6l11.6-2c4-.7 6.8-4.3 6.6-8.4l-.4-26.4c-.1-3.5 2.2-6.6 5.5-7.7 4.2-1.4 7-2.5 9.6-3.5 2.6-.9 5.8-1 8.3 2.1l17 20.9c2.4 3.3 6.9 4.2 10.4 2.2l10.2-5.9c3.5-2 5-6.4 3.3-10.1l-9.4-24.7c-1.2-3.3-.2-7 2.5-9.1 2.5-2 5-4.1 7.4-6.2 2.6-2.3 6.4-2.7 9.4-.9l22.7 13.6c3.4 2.2 7.9 1.6 10.5-1.5l7.5-9c2.6-3.1 2.5-7.7-.3-10.6l-17.3-19.9c-2.3-2.6-2.6-6.5-.7-9.5 1.7-2.7 3.3-5.5 4.8-8.4 1.7-3.1 5.1-4.7 8.6-4.1l25.9 5c4 .9 8-1.2 9.4-5l4-11c1.4-3.8-.3-8.1-3.9-9.9l-23.1-12.8c-3.1-1.7-4.6-5.2-3.9-8.6.6-3.2 1.2-6.3 1.7-9.5.5-3.5 3.2-6.2 6.6-6.8l26.1-4.2c4-.5 7.1-3.9 7.1-7.9v-11.7c-.2-3.8-3.2-7.3-7.3-7.7zM181.8 356.9c-5.2 9-17.4 10.7-25 3.6C129.2 334.2 112 297.1 112 256c0-40.9 17.1-77.9 44.5-104.1 7.5-7.2 19.8-5.5 25 3.5l56 96.6c1.4 2.5 1.4 5.5 0 8l-55.7 96.9zM396 289.7C380.9 353 323.9 400 256 400c-14.1 0-27.8-2-40.6-5.8-9.9-2.9-14.5-14.4-9.3-23.3l55.7-96.9c1.4-2.5 4.1-4 6.9-4h111.7c10.4 0 18 9.6 15.6 19.7zM380.5 242H268.7c-2.9 0-5.5-1.5-6.9-4l-56.1-96.7c-5.2-8.9-.7-20.4 9.2-23.4 13-3.9 26.8-5.9 41.1-5.9 67.9 0 124.9 47 140 110.3 2.4 10.1-5.2 19.7-15.5 19.7z"/></svg>


// App Preview
export const IconDownloadDApp = ({...props}) => <svg preserveAspectRatio="xMidYMid meet" fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="28px" viewBox="0 0 512 512" style={{ verticalAlign: "middle" }} {...props}><path d="M332 142.7c-1.2-1.1-2.7-1.7-4.1-1.7s-3 .6-4.1 1.7L310 155.9c-1.2 1.1-1.9 2.7-1.9 4.3 0 1.6.7 3.2 1.9 4.3l95.8 91.5-95.8 91.5c-1.2 1.1-1.9 2.7-1.9 4.3 0 1.6.7 3.2 1.9 4.3l13.8 13.2c1.2 1.1 2.6 1.7 4.1 1.7 1.5 0 3-.6 4.1-1.7l114.2-109c1.2-1.1 1.9-2.7 1.9-4.3 0-1.6-.7-3.2-1.9-4.3L332 142.7zM106.3 256l95.8-91.5c1.2-1.1 1.9-2.7 1.9-4.3 0-1.6-.7-3.2-1.9-4.3l-13.8-13.2c-1.2-1.1-2.7-1.7-4.1-1.7s-3 .6-4.1 1.7l-114.2 109c-1.2 1.1-1.9 2.7-1.9 4.3 0 1.6.7 3.2 1.9 4.3l114.2 109c1.2 1.1 2.7 1.7 4.1 1.7 1.5 0 3-.6 4.1-1.7l13.8-13.2c1.2-1.1 1.9-2.7 1.9-4.3 0-1.6-.7-3.2-1.9-4.3L106.3 256z"/><path d="M332.8 267.2c.1-3.9-1.4-7.6-4.2-10.4l-.1-.1c-2.7-2.7-6.2-4.2-10-4.2-3.5 0-6.8 1.3-9.4 3.6l-38.9 34.6V184.6c0-7.8-6.4-14.2-14.2-14.2-7.8 0-14.2 6.4-14.2 14.2v106.2l-38.9-34.6c-2.6-2.3-6-3.6-9.4-3.6-3.8 0-7.4 1.5-10.1 4.2l-.1.1c-2.8 2.8-4.2 6.4-4.2 10.4.1 3.9 1.7 7.5 4.6 10.2l62.8 57.7c2.6 2.4 6 3.7 9.5 3.7s6.9-1.3 9.5-3.7l62.8-57.7c2.8-2.8 4.5-6.4 4.5-10.3z"/></svg>;

// Refresh
export const IconRefresh = ({...props}) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" preserveAspectRatio="xMidYMid meet" fill="currentColor" height="18px" width="18px" style={{ verticalAlign: "middle" }} {...props}><path d="M256 388c-72.597 0-132-59.405-132-132 0-72.601 59.403-132 132-132 36.3 0 69.299 15.4 92.406 39.601L278 234h154V80l-51.698 51.702C348.406 99.798 304.406 80 256 80c-96.797 0-176 79.203-176 176s78.094 176 176 176c81.045 0 148.287-54.134 169.401-128H378.85c-18.745 49.561-67.138 84-122.85 84z"/></svg>;

// Open new window
export const IconOpenWindow = ({...props}) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" preserveAspectRatio="xMidYMid meet" fill="currentColor" height="18px" width="18px" style={{ verticalAlign: "middle" }} {...props}><path d="M405.34 405.332H106.66V106.668H240V64H106.66C83.191 64 64 83.197 64 106.668v298.664C64 428.803 83.191 448 106.66 448h298.68c23.469 0 42.66-19.197 42.66-42.668V272h-42.66v133.332zM288 64v42.668h87.474L159.999 322.133l29.866 29.866 215.476-215.47V224H448V64H288z"/></svg>;

export const IconMore = ({...props}) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" height="18px" width="18px" style={{ verticalAlign: "middle" }} {...props}><path d="M296 136c0-22.002-17.998-40-40-40s-40 17.998-40 40 17.998 40 40 40 40-17.998 40-40zm0 240c0-22.002-17.998-40-40-40s-40 17.998-40 40 17.998 40 40 40 40-17.998 40-40zm0-120c0-22.002-17.998-40-40-40s-40 17.998-40 40 17.998 40 40 40 40-17.998 40-40z"/></svg>;
