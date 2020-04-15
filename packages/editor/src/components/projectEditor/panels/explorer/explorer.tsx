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
import style from './style.less';
import { FileItem, ContractItem } from './items';
import FolderItem from './items/folderItem';
import { IProjectItem, ProjectItemTypes } from '../../../../models';

interface IProps {
    tree: IProjectItem;
    onToggleTreeItem(id: string): void;
    onOpenFile(id: string): void;
    onRenameItem(id: string, name: string): void;
    onCreateItem(parentId: string, type: ProjectItemTypes, name: string): void;
    onDeleteItem(id: string): void;
    onMoveItem(sourceId: string, targetId: string): void;

    showModal(action: any, modalProps: any): void;
    closeModal(): void;
}

export class Explorer extends React.Component<IProps> {

    onRenameItem = (id: string, currName: string) => {
        const name = prompt('Enter new name.', currName);
        if (name) {
            this.props.onRenameItem(id, name);
        }
    }

    onCreateItem = (parentId: string, type: ProjectItemTypes) => {
        const name = prompt('Enter a name.');
        if (name) {
            this.props.onCreateItem(parentId, type, name);
        }
    }

    onDeleteItem = (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete ${name}?`)) {
            this.props.onDeleteItem(id);
        }
    }

    onMoveItem = (sourceId: string, targetId: string) => {
        this.props.onMoveItem(sourceId, targetId);
    }

    onModalClose = () => {
        this.props.closeModal();
    }

    showModal = (modalType: string, parentId: string) => {
        const { showModal } = this.props;

        switch (modalType) {
            default:
                showModal('IMPORT_FILE_MODAL', { parentId });
                break;
        }
    }

    renderTree(itemData: IProjectItem, actions: any, depth: number) {
        if (itemData.deleted) {
            return null;
        }

        depth++;
        const childHtml = itemData.children.map(i => this.renderTree(i, actions, depth));

        if (itemData.type === ProjectItemTypes.File) {
            if (itemData.name.toLowerCase().endsWith('.sol')) {
                return (
                    <ContractItem key={itemData.id}
                        data={itemData}
                        depth={depth}

                        onToggle={actions.onToggleTreeItem}
                        onClick={actions.onOpenFile}
                        onRenameClick={(id: string) => this.onRenameItem(id, itemData.name)}
                        onDeleteClick={(id: string) => this.onDeleteItem(id, itemData.name)}
                        onMoveItem={this.onMoveItem} />
                );
            } else {
                return (
                    <FileItem key={itemData.id}
                        data={itemData}
                        depth={depth}

                        onClick={actions.onOpenFile}
                        onRenameClick={(id: string) => this.onRenameItem(id, itemData.name)}
                        onDeleteClick={(id: string) => this.onDeleteItem(id, itemData.name)}
                        onMoveItem={this.onMoveItem} />
                );
            }
        } else if (itemData.type === ProjectItemTypes.Folder) {
            return (
                <FolderItem key={itemData.id}
                    data={itemData}
                    depth={depth}

                    onClick={(i: IProjectItem) => actions.onToggleTreeItem(i.id)}
                    onToggle={actions.onToggleTreeItem}

                    onCreateItemClick={this.onCreateItem}
                    onImportFileClick={(parentId: string) => this.showModal('import', parentId)}
                    onRenameClick={(id: string) => this.onRenameItem(id, itemData.name)}
                    onDeleteClick={(id: string) => this.onDeleteItem(id, itemData.name)}
                    onMoveItem={this.onMoveItem}>
                    {childHtml}
                </FolderItem>
            );
        } else {
            throw new Error('Unsupported item type');
        }
    }

    render() {
        const treeHtml = this.props.tree ? this.renderTree(this.props.tree, this.props, -1) : null;
        return (
            <div className={style.treeContainer}>
                {treeHtml}
            </div>
        );
    }
}
