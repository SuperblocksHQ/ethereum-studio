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

import React, { Component } from 'react';
import { SubMenu, MenuItem, Divider } from '../../common/menu';
import style from './style.less';

export default class MenuDropdownDialog extends Component {

    toggleFullScreen = () => {
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

    handleMenuItemClick = (action) => {
        switch(action) {
            case "new-project":
                break;
            case "new-file":
                break;
            case "toggle-explorer":
                this.props.toggleFileSystemPanel();
                break;
            case "toggle-transactions":
                this.props.toggleTransactionsHistoryPanel();
                break;
            case "toggle-preview":
                this.props.togglePreviewPanel();
                break;
            case "close-all-panels":
                this.props.closeAllPanels();
                break;
            case "toggle-full-screen":
                this.toggleFullScreen();
                break;
            default:
                return;
        }
    }

    render() {
        const { showTransactionsHistory, showFileSystem, showPreview, closeAllPanels } = this.props;
        return (
            <div className={style.menuDialog}>

                <SubMenu title="File">
                    <MenuItem action="new-project" onClick={this.handleMenuItemClick} title="New Project" />
                    <MenuItem action="new-file" onClick={this.handleMenuItemClick} title="New File" />
                    <MenuItem title="New Folder" onClick={this.handleMenuItemClick} />
                    <Divider />
                    <MenuItem title="Save" />
                    <MenuItem title="Save All" />
                    <Divider />
                    <MenuItem title="Close File" />
                    <MenuItem title="Close All Files" />
                    <Divider />
                    <MenuItem title="Configure Project" />
                    <MenuItem title="Export Project" />
                    <MenuItem title="Download Project" />
                </SubMenu>
                <SubMenu title="View">
                    <MenuItem action="toggle-explorer" onClick={this.handleMenuItemClick} isActive={showFileSystem} title="Explorer" />
                    <MenuItem action="toggle-transactions" onClick={this.handleMenuItemClick} isActive={showTransactionsHistory} title="Transactions" />
                    <MenuItem action="toggle-preview" onClick={this.handleMenuItemClick} isActive={showPreview} title="Preview" />
                    <MenuItem action="close-all-panels" onClick={this.handleMenuItemClick} title="Close All Panels" />
                    <Divider />
                    <MenuItem action="toggle-full-screen" onClick={this.handleMenuItemClick} title="Toggle Full Screen" />
                </SubMenu>
            </div>
        )
    }
}
