// Copyright 2018 Superblocks AB
//
// This file is part of Superblocks Studio.
//
// Superblocks Studio is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.
//
// Superblocks Studio is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Superblocks Studio.  If not, see <http://www.gnu.org/licenses/>.
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
import iconFolderOpen from '@fortawesome/fontawesome-free-solid/faFolderOpen';
import iconCube from '@fortawesome/fontawesome-free-solid/faCube';
import iconPlus from '@fortawesome/fontawesome-free-solid/faPlusSquare';
import iconUp from '@fortawesome/fontawesome-free-solid/faArrowUp';
import iconDown from '@fortawesome/fontawesome-free-solid/faArrowDown';
import iconClone from '@fortawesome/fontawesome-free-solid/faClone';
import iconUpload from '@fortawesome/fontawesome-free-solid/faUpload';
import iconExchangeAlt from '@fortawesome/fontawesome-free-solid/faExchangeAlt';
import iconQuestionCircle from '@fortawesome/fontawesome-free-regular/faQuestionCircle';
import iconTwitter from '@fortawesome/fontawesome-free-brands/faTwitter';
import iconGithub from '@fortawesome/fontawesome-free-brands/faGithub';
import iconTelegram from '@fortawesome/fontawesome-free-brands/faTelegram';


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
export const IconAddContract = ({...props}) => <IconImg src={'/static/img/icon-add-contract.svg'} {...props} />;
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
export const IconFolder = () => <FaIcon icon={iconFolder} />;
export const IconFolderOpen = () => <FaIcon icon={iconFolderOpen} />;
export const IconAngleRight = ({...props}) => <IconImg src={'/static/img/icon-arrow-right.svg'} {...props} />;
export const IconAngleDown = ({...props}) => <IconImg src={'/static/img/icon-arrow-down.svg'} {...props} />;
export const IconCube = () => <FaIcon icon={iconCube} />;
export const IconPlus = () => <FaIcon icon={iconPlus} />;
export const IconUp = () => <FaIcon icon={iconUp} />;
export const IconDown = () => <FaIcon icon={iconDown} />;
export const IconClone = () => <FaIcon icon={iconClone} />;
export const IconDownload = ({...props})=> <IconImg src={'/static/img/icon-download.svg'} {...props} />;
export const IconUpload = () => <FaIcon icon={iconUpload} />;
export const IconDropdown = ({...props}) => <IconImg src={'/static/img/icon-dropdown.svg'} {...props}/>;

// Top Bar
export const IconTransactions = ({...props}) => <FaIcon icon={iconExchangeAlt} {...props}/>;
export const IconCollaborate = ({...props}) => <IconImg src={'src="/static/img/icon-collaborate.png'} {...props}/>;
export const IconProjectSelector = ({...props}) => <IconImg src={'/static/img/icon-project-selector.svg'} {...props} />;
export const IconHelp = () => <FaIcon icon={iconQuestionCircle} />;

// File types
export const IconContract = ({...props}) => <IconImg src={'/static/img/icon-solidity.svg'} {...props} />;
export const IconHtml = ({...props}) => <IconImg src={'/static/img/icon-html.svg'} {...props} />;
export const IconJS = ({...props}) => <IconImg src={'/static/img/icon-js.svg'} {...props} />;
export const IconCss = ({...props}) => <IconImg src={'/static/img/icon-css.svg'} {...props} />;
export const IconShowPreview = ({...props}) => <IconImg src={'/static/img/icon-show-preview.svg'} {...props} />;

// Learn and Resouces
export const IconGuide = ({...props}) => <IconImg src={'/static/img/icon-guide.svg'} {...props} />;
export const IconVideoTutorials = ({...props}) => <IconImg src={'/static/img/icon-video-tutorials.svg'} {...props} />;
export const IconHelpCenter = ({...props}) => <IconImg src={'/static/img/icon-help-center.svg'} {...props} />;
export const IconAskQuestion = ({...props}) => <IconImg src={'/static/img/icon-ask-question.svg'} {...props} />;
export const IconWhatsNew = ({...props}) => <IconImg src={'/static/img/icon-whats-new.svg'} {...props} />;

// External services
export const IconTwitter = ({...props}) => <FaIcon icon={iconTwitter} {...props} />;
export const IconGithub = ({...props}) => <FaIcon icon={iconGithub} {...props} />;
export const IconTelegram = ({...props}) => <FaIcon icon={iconTelegram} {...props}/>;

