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
import style from './style.less';
import { IProject } from '../../../models';
import Project from './project';
import Header from './header';
// import Backend from '../../projecteditor/control/backend';
// import Modal from '../../modal';
// import { Tooltip } from '../../common';
// import {
//     IconDownload,
//     IconTrash,
//     IconPreferences,
//     IconCheck,
// } from '../../icons';

interface IProps {
    list: IProject[];
    listName: string;
}

export default class ProjectList extends Component<IProps> {

    // openProject = (e, project, cb) => {
    //     this.props.router.control.openProject(project, cb);
    //     this.props.onProjectSelected();
    // };

    // openProjectConfig = (e, project) => {
    //     this.openProject(e, project, status => {
    //         if (status == 0) {
    //             this.props.router.control.openProjectConfig();
    //         }
    //     });
    // };

    // getProjectItems = () => {
    //     if (this.props.router.control) {
    //         const openProject = this.props.router.control.getActiveProject();

    //         const items = this.props.router.control
    //             .getProjects()
    //             .slice(0)
    //             .reverse()
    //             .map(project => {
    //                 const isActive = openProject === project;
    //                 const isTemporaryProject = project.getInode() === 1;
    //                 return (
    //                     !isTemporaryProject &&
    //                     <li
    //                         key={project.getInode()}
    //                         className={style.projSwitcherItem}
    //                         onClick={e => {
    //                             this.openProject(e, project);
    //                         }}
    //                     >
    //                         <div
    //                             className={classNames([
    //                                 style.projSwitcherRow,
    //                                 style.container,
    //                             ])}
    //                         >
    //                             {isActive ? (
    //                                 <div className={style.active}>
    //                                     <IconCheck />
    //                                 </div>
    //                             ) : null}
    //                             <div className={style.container}>
    //                                 <div className={style.overflowText}>
    //                                     {project.getName()} - &nbsp;
    //                                     {project.getTitle()}
    //                                 </div>
    //                             </div>
    //                             <div
    //                                 className={classNames([
    //                                     style.projSwitcherRowActions,
    //                                     style.container,
    //                                 ])}
    //                             >
    //                                 <button
    //                                     className="btnNoBg"
    //                                     onClick={e => {
    //                                         this.openProjectConfig(e, project);
    //                                     }}
    //                                 >
    //                                     <Tooltip title="Configure Project">
    //                                         <IconPreferences />
    //                                     </Tooltip>
    //                                 </button>
    //                                 <button
    //                                     className="btnNoBg"
    //                                     onClick={e => {
    //                                         this.downloadProject(e, project);
    //                                     }}
    //                                 >
    //                                     <Tooltip title="Download">
    //                                         <IconDownload />
    //                                     </Tooltip>
    //                                 </button>
    //                                 <button
    //                                     className="btnNoBg"
    //                                     onClick={e => {
    //                                         this.deleteProject(e, project);
    //                                     }}
    //                                 >
    //                                     <Tooltip title="Delete">
    //                                         <IconTrash />
    //                                     </Tooltip>
    //                                 </button>
    //                             </div>
    //                         </div>
    //                     </li>
    //                 );
    //             });

    //         return items;
    //     }
    // };

    render() {
        const { list, listName }  = this.props;
        return (
            <div className={style.container}>
                <Header
                    title={listName}
                    numOfProjects={list.length}
                />
                <div className={style.content}>
                {
                    list.map((project: IProject) => {
                        return (
                            <Project
                                project={project}
                            />
                        );
                    })
                }
                </div>
            </div>
        );
    }
}
