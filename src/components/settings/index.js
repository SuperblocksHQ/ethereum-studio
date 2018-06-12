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

import Backend from '../projecteditor/backend';

export default class Settings {
    constructor(props) {
        this.props=props;
        this.settings=null;
        this.backend=new Backend();
    }

    get=()=>{
        return this.settings;
    };
    
    load=(cb)=>{
        this.backend.loadSettings((settings)=>{
            this.settings=settings;
            cb(settings);
        });
    };
    save=(cb)=>{
        this.backend.saveSettings(this.settings, cb);
    };
}
