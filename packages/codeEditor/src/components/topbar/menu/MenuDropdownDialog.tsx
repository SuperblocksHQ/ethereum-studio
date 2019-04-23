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
import { SubMenu, MenuItem, Divider } from '../../common/menu';
import { Panels } from '../../../models/state';
import style from './style.less';
import { ProjectItemTypes } from '../../../models';

interface IProps {
  showTransactionsHistory: boolean;
  showFileSystem: boolean;
  showPreview: boolean;
  showConsole: boolean;
  activePaneId: string;
  rootFolderId: string;
  togglePanel: (panel: any) => void;
  closeAllPanels: () => void;
  closeAllPanes: () => void;
  closePane: (fileId: string) => void;
  onCreateItem: (parentId: string, type: ProjectItemTypes, name: string) => void;
}

export default class MenuDropdownDialog extends React.Component<IProps> {

    toggleFullScreen = () => {
      const document: any = window.document;
      const Element: any = document.Element;

      if ((document.fullScreenElement && document.fullScreenElement !== null) ||
       (!document.mozFullScreen && !document.webkitIsFullScreen)) {
        if (document.documentElement.requestFullScreen) {
          document.documentElement.requestFullScreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullScreen) {
          document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }
      } else {
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        }
      }
    }

    onCreateItem = (parentId: string, type: ProjectItemTypes) => {
        const name = prompt('Enter a name.');
        if (name) {
            this.props.onCreateItem(parentId, type, name);
        }
    }

    render() {
        const { showTransactionsHistory, showFileSystem, showPreview, showConsole,
                togglePanel, closeAllPanels, closeAllPanes, closePane, activePaneId, rootFolderId } = this.props;

        return (
            <div className={style.menuDialog}>

                <SubMenu title='File'>
                    <MenuItem title='New File' onClick={() => this.onCreateItem(rootFolderId, ProjectItemTypes.File)} />
                    <MenuItem title='New Folder' onClick={() => this.onCreateItem(rootFolderId, ProjectItemTypes.Folder)}  />
                    <Divider />
                    <MenuItem title='Save' onClick={() => console.log('TODO')} />
                    <MenuItem title='Save All' onClick={() => console.log('TODO')} />
                    <Divider />
                    <MenuItem onClick={() => closePane(activePaneId)} disabled={!activePaneId} title='Close File' />
                    <MenuItem onClick={() => closeAllPanes()} disabled={!activePaneId} title='Close All Files' />
                    <Divider />
                    <MenuItem title='Configure Project' onClick={() => console.log('TODO')} />
                    <MenuItem title='Export Project' onClick={() => console.log('TODO')} />
                    <MenuItem title='Download Project' onClick={() => console.log('TODO')} />
                </SubMenu>
                <SubMenu title='View'>
                    <MenuItem onClick={() => togglePanel(Panels.Explorer)} isActive={showFileSystem} title='Explorer' />
                    <MenuItem onClick={() => togglePanel(Panels.Transactions)} isActive={showTransactionsHistory} title='Transactions' />
                    <MenuItem onClick={() => togglePanel(Panels.Preview)} isActive={showPreview} title='Preview' />
                    <MenuItem onClick={() => togglePanel(Panels.CompilerOutput)} isActive={showConsole} title='Console output' />
                    <MenuItem onClick={() => closeAllPanels()} title='Close All Panels' />
                    <Divider />
                    <MenuItem onClick={() => this.toggleFullScreen()} title='Toggle Full Screen' />
                </SubMenu>
            </div>
        );
    }
}
