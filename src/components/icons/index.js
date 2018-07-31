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

import FaIcon  from '@fortawesome/react-fontawesome';
import iconRun from '@fortawesome/fontawesome-free-solid/faBolt';
import iconSave from '@fortawesome/fontawesome-free-regular/faSave';
import iconCompile from '@fortawesome/fontawesome-free-solid/faPuzzlePiece';
import iconDeploy from '@fortawesome/fontawesome-free-regular/faPlayCircle';
import iconConfigure from '@fortawesome/fontawesome-free-solid/faCog';
import iconInteract from '@fortawesome/fontawesome-free-solid/faChess';

export const IconContract = () => <img src={'/static/img/icon-solidity.svg'} />;
export const IconAddContract = () => <img src={'/static/img/icon-add-contract.svg'} />;
export const IconRun = () => <FaIcon icon={iconRun} />;
export const IconSave = () => <FaIcon icon={iconSave} />;
export const IconCompile = () => <FaIcon icon={iconCompile} />;
export const IconDeploy = () => <FaIcon icon={iconDeploy} />;
export const IconConfigure = () => <FaIcon icon={iconConfigure} />;
export const IconInteract = () => <FaIcon icon={iconInteract} />;





