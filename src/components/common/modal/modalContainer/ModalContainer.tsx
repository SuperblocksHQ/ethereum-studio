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

import React, {Component, lazy, Suspense} from 'react';
import style from './style.less';
import {Loading} from '../../loadable';

const LoginModal = lazy(() => import(/* webpackChunkName: "LoginModal" */'../../../modals/loginModal'));

const ShareModal = lazy(() => import(/* webpackChunkName: "ShareModal" */'../../../modals/shareModal'));

const EditModal = lazy(() => import(/* webpackChunkName: "EditModal" */'../../../modals/editModal'));

const ProjectTemplateModal = lazy(() => import(/* webpackChunkName: "ProjectTemplateModal" */'../../../modals/projectTemplateModal'));

const PreferencesModal = lazy(() => import(/* webpackChunkName: "ShareModal" */'../../../modals/preferencesModal'));

const ImportFileModal = lazy(() => import(/* webpackChunkName: "ImportFileModal" */'../../../modals/importFileModal'));

interface IProps {
    modalType: string;
    modalProps: any;
    hideModal: () => void;
}

const MODAL_COMPONENTS: any = {
    EDIT_MODAL: EditModal,
    SHARE_MODAL: ShareModal,
    PREFERENCES_MODAL: PreferencesModal,
    GITHUB_MODAL: LoginModal,
    IMPORT_FILE_MODAL: ImportFileModal,
    PROJECT_TEMPLATE_MODAL: ProjectTemplateModal,
    /* other modals */
};

export class ModalContainer extends Component<IProps> {

    constructor(props: IProps) {
        super(props);

        window.addEventListener(
            'keydown',
            (e) => {
                // Hide modal with escape button
                if ( e.keyCode === 27 ) {
                    e.preventDefault();
                    props.hideModal();
                }
            },
            false
        );
    }

    render() {
        const { modalType, modalProps, hideModal } = this.props;

        if (!modalType) {
            return null;
        }

        const SpecificModal: any = MODAL_COMPONENTS[modalType];

        return (
            <div className={style.modalContainer}>
                <Suspense fallback={< Loading/>}>
                    <SpecificModal hideModal={hideModal} {...modalProps} />
                </Suspense>
            </div>
        );
    }
}

