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
import { h, Component } from 'preact';

import FaIcon  from '@fortawesome/react-fontawesome';
import iconRun from '@fortawesome/fontawesome-free-solid/faBolt';
import iconSave from '@fortawesome/fontawesome-free-regular/faSave';
import iconCompile from '@fortawesome/fontawesome-free-solid/faPuzzlePiece';
import iconConfigure from '@fortawesome/fontawesome-free-solid/faCog';
import iconTrash from '@fortawesome/fontawesome-free-regular/faTrashAlt';
import iconGem from '@fortawesome/fontawesome-free-regular/faGem';
import iconFile from '@fortawesome/fontawesome-free-solid/faFile';
import iconFileAlt from '@fortawesome/fontawesome-free-regular/faFileAlt';
import iconFolder from '@fortawesome/fontawesome-free-solid/faFolder';
import iconFolderOpen from '@fortawesome/fontawesome-free-regular/faFolder';
import iconCube from '@fortawesome/fontawesome-free-solid/faCube';
import iconPlus from '@fortawesome/fontawesome-free-solid/faPlusSquare';
import iconUp from '@fortawesome/fontawesome-free-solid/faArrowUp';
import iconDown from '@fortawesome/fontawesome-free-solid/faArrowDown';
import iconRight from '@fortawesome/fontawesome-free-solid/faLongArrowAltRight';
import iconClone from '@fortawesome/fontawesome-free-solid/faClone';
import iconUpload from '@fortawesome/fontawesome-free-solid/faUpload';
import iconExchangeAlt from '@fortawesome/fontawesome-free-solid/faExchangeAlt';
import iconCheck from '@fortawesome/fontawesome-free-solid/faCheck';
import iconClose from '@fortawesome/fontawesome-free-solid/faTimes';
import iconQuestionCircle from '@fortawesome/fontawesome-free-regular/faQuestionCircle';
import iconTwitter from '@fortawesome/fontawesome-free-brands/faTwitter';
import iconGithub from '@fortawesome/fontawesome-free-brands/faGithub';
import iconDiscord from '@fortawesome/fontawesome-free-brands/faDiscord';
import iconLock from '@fortawesome/fontawesome-free-solid/faLock';
import iconLockOpen from '@fortawesome/fontawesome-free-solid/faLockOpen';
import iconPencil from '@fortawesome/fontawesome-free-solid/faPencilAlt';
import iconDownload from '@fortawesome/fontawesome-free-regular/faArrowAltCircleDown';
import iconMosaic from '@fortawesome/fontawesome-free-solid/faThLarge';

class IconImg extends Component {
    render () {
        let { width, height, ...props } = this.props;

        let defaults = {
            height: height || 14,
            width: width || 14,
          };

        return (
            <img {...props} {...defaults} />
        );
    }
}

export const IconDeployGreen = ({...props}) => <IconImg src={'/static/img/icon-deploy-green.svg'} {...props} />;
export const IconAddContract = ({...props}) => <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="16" height="16"><polygon points="12,3 8,3 8,4 11,4 11,7 14,7 14,14 6,14 6,8 5,8 5,15 15,15 15,6"/><path d="M7 3.018h-2v-2.018h-1.981v2.018h-2.019v1.982h2.019v2h1.981v-2h2v-1.982z" {...props}/></svg>;
export const IconRun = () => <FaIcon icon={iconRun} />;
export const IconSave = () => <FaIcon icon={iconSave} />;
export const IconCompile = () => <FaIcon icon={iconCompile} />;
export const IconDeploy = ({...props}) => <IconImg src={'/static/img/icon-deploy.svg'} {...props} />;
export const IconConfigure = ({...props}) => <FaIcon icon={iconConfigure} />;
export const IconInteract = ({...props}) => <IconImg src={'/static/img/icon-interact.svg'} {...props} />;
export const IconTrash = () => <FaIcon icon={iconTrash} />;
export const IconGem = () => <FaIcon icon={iconGem} />;
export const IconFile = () => <FaIcon icon={iconFile} />;
export const IconFileAlt = () => <FaIcon icon={iconFileAlt} />;
export const IconFolder = () => <FaIcon icon={iconFolder} color="#49616C"/>;
export const IconFolderOpen = () => <FaIcon icon={iconFolderOpen} color="#49616C"/>;
export const IconAngleRight = ({...props}) => <IconImg src={'/static/img/icon-arrow-right.svg'} {...props} />;
export const IconAngleDown = ({...props}) => <IconImg src={'/static/img/icon-arrow-down.svg'} {...props} />;
export const IconCube = () => <FaIcon icon={iconCube} />;
export const IconPlus = () => <FaIcon icon={iconPlus} />;
export const IconUp = () => <FaIcon icon={iconUp} />;
export const IconDown = () => <FaIcon icon={iconDown} />;
export const IconRight = () => <FaIcon icon={iconRight} />;
export const IconClone = () => <FaIcon icon={iconClone} />;
export const IconDownload = ({...props})=> <FaIcon icon={iconDownload} {...props} />;
export const IconUpload = () => <FaIcon icon={iconUpload} />;
export const IconDropdown = ({...props}) => <span class="dropDown" {...props}></span>;
export const IconClose = ({...props}) => <FaIcon icon={iconClose} {...props}/>;
export const IconAdd = ({...props}) => <IconImg src={'/static/img/icon-add-contract.svg'} {...props} />;
export const IconLock = ({...props}) => <FaIcon icon={iconLock} {...props} />;
export const IconLockOpen = ({...props}) => <FaIcon icon={iconLockOpen} {...props} />;
export const IconEdit = ({...props}) => <FaIcon icon={iconPencil} {...props} />;
export const IconMetamask = ({...props}) => <IconImg src={'/static/img/icon-metamask-logo.svg'} {...props} />;
export const IconMetamaskLocked = ({...props}) => <IconImg src={'/static/img/icon-metamask-logo-locked.svg'} {...props} />;
export const IconPublicAddress = ({...props}) => <IconImg src={'/static/img/icon-public-address.svg'} {...props} />;
export const IconMosaic = ({...props}) => <FaIcon icon={iconMosaic} {...props} />;


// Top Bar
export const IconTransactions = ({...props}) => <FaIcon icon={iconExchangeAlt} {...props}/>;
export const IconCollaborate = ({...props}) => <IconImg src={'src="/static/img/icon-collaborate.png'} {...props}/>;
export const IconProjectSelector = ({...props}) => <IconImg src={'/static/img/icon-project-selector.svg'} {...props} />;
export const IconHelp = () => <FaIcon icon={iconQuestionCircle} />;
export const IconCheck = () => <FaIcon icon={iconCheck} />;

// File types
export const IconContract = ({...props}) => <IconImg src={'/static/img/icon-solidity.svg'} {...props} />;
export const IconHtml = ({...props}) => <IconImg src={'/static/img/icon-html.svg'} {...props} />;
export const IconJS = ({...props}) => <IconImg src={'/static/img/icon-js.svg'} {...props} />;
export const IconCss = ({...props}) => <IconImg src={'/static/img/icon-css.svg'} {...props} />;
export const IconMd = ({...props}) => <IconImg src={'/static/img/icon-md.svg'} {...props} />;
export const IconShowPreview = ({...props}) => <svg fill="currentColor" preserveAspectRatio="xMidYMid meet" height="16px" width="16px" viewBox="0 0 200 200" style="vertical-align: middle;"><path d="M27,33 L173,33 C178.522847,33 183,37.4771525 183,43 L183,157 C183,162.522847 178.522847,167 173,167 L27,167 C21.4771525,167 17,162.522847 17,157 L17,43 C17,37.4771525 21.4771525,33 27,33 Z M29,64 L29,156 L171,156 L171,64 L29,64 Z M84.260356,82.6998802 L119.974518,107.161635 C121.797124,108.409995 122.262642,110.899505 121.014282,112.722111 C120.734924,113.129973 120.38238,113.482517 119.974518,113.761875 L84.260356,138.223629 C82.4377502,139.471989 79.9482404,139.006471 78.6998802,137.183866 C78.2439706,136.518238 78,135.730302 78,134.92351 L78,86 C78,83.790861 79.790861,82 82,82 C82.8067925,82 83.594728,82.2439706 84.260356,82.6998802 Z" id="Combined-Shape" fill="inherit" {...props}></path></svg>


// Learn and Resouces
export const IconGuide = ({...props}) => <IconImg src={'/static/img/icon-guide.svg'} {...props} />;
export const IconVideoTutorials = ({...props}) => <IconImg src={'/static/img/icon-video-tutorials.svg'} {...props} />;
export const IconHelpCenter = ({...props}) => <IconImg src={'/static/img/icon-help-center.svg'} {...props} />;
export const IconAskQuestion = ({...props}) => <IconImg src={'/static/img/icon-ask-question.svg'} {...props} />;
export const IconWhatsNew = ({...props}) => <IconImg src={'/static/img/icon-whats-new.svg'} {...props} />;

// External services
export const IconTwitter = ({...props}) => <FaIcon icon={iconTwitter} {...props} />;
export const IconGithub = ({...props}) => <FaIcon icon={iconGithub} {...props} />;
export const IconDiscord = ({...props}) => <FaIcon icon={iconDiscord} {...props}/>;

