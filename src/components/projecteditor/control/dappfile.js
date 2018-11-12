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

export class Obj {
    constructor(o) {
        this.obj = o;
    }

    get = (key, env, allowDefault) => {
        var dataDefault = this.obj;
        var dataEnv;
        if (env) {
            const envs = this.obj._environments || [];
            for (var index = 0; index < envs.length; index++) {
                const elm = envs[index];
                if (elm.name == env) {
                    dataEnv = elm.data || {};
                    break;
                }
            }
            if (allowDefault === false) {
                if (dataEnv) return Obj.cloneObj(dataEnv[key]);
                return undefined;
            }
        }
        if (dataEnv) {
            const v = Obj.cloneObj(dataEnv[key]);
            return v === undefined ? dataDefault[key] : v;
        }
        return Obj.cloneObj(dataDefault[key]);
    };

    // Set value to undefined to delete the key.
    set = (key, value, env) => {
        var objData;
        if (env) {
            var objEnv;
            if (!this.obj._environments) this.obj._environments = [];
            const envs = this.obj._environments;
            for (var index = 0; index < envs.length; index++) {
                const elm = envs[index];
                if (elm.name == env) {
                    objEnv = elm;
                    break;
                }
            }
            if (!objEnv) {
                objEnv = {
                    name: env,
                    data: {},
                };
                this.obj._environments.push(objEnv);
            }
            if (!objEnv.data) objEnv.data = {};
            objData = objEnv.data;
        } else {
            objData = this.obj;
        }
        if (value === undefined) delete objData[key];
        else objData[key] = value;
    };

    static cloneObj(obj) {
        if (obj === undefined) return undefined;
        // Cheap way (in number of lines) to deep clone an object.
        return JSON.parse(JSON.stringify(obj));
    }
}

/**
 * Returns references straight to the underlaying data model, so be careful.
 *
 */
export default class Dappfile {
    constructor(dappfileObj) {
        this.root = dappfileObj || {};
        this.root.project = this.root.project || {};
        this.root.project.info = this.root.project.info || {};
    }

    dump = () => {
        return JSON.stringify(this.root, null, 4);
    };

    getTitle = () => {
        return this.root.project.info.title || '';
    };

    getName = () => {
        return this.root.project.info.name || '';
    };

    setName = name => {
        this.root.project.info.name = name;
    };

    setTitle = title => {
        this.root.project.info.title = title;
    };

    contracts = () => {
        if (this.root.contracts == null) this.root.contracts = [];
        return this.root.contracts;
    };

    wallets = () => {
        if (this.root.wallets == null) this.root.wallets = [];
        return this.root.wallets;
    };

    accounts = () => {
        if (this.root.accounts == null) this.root.accounts = [];
        return this.root.accounts;
    };

    environments = () => {
        if (this.root.environments == null) this.root.environments = [];
        return this.root.environments;
    };

    //setItem = (root, filters, obj) => {
    //obj=obj.obj;
    //const vessel=this._findItems(root, filters)[0];
    //if(vessel) {
    //var keys=Object.keys(vessel);
    //for(var index=0;index<keys.length;index++) {
    //const key=keys[index];
    //delete vessel[key];
    //}
    //keys=Object.keys(obj);
    //for(var index=0;index<keys.length;index++) {
    //const key=keys[index];
    //vessel[key]=obj[key];
    //}
    //return true;
    //}
    //else {
    //return false;
    //}
    //};

    // Return a deep copy of first found item in an array below a root object by it's filters.
    getItem = (root, filters) => {
        const ret = this._findItems(root, filters || []);
        const obj = ret[0];
        if (!obj) return;
        return new Obj(obj);
        //return new Obj(Obj.cloneObj(obj));
    };

    _findItems = (root, filters) => {
        return (this.root[root] || []).filter((elm, index) => {
            return Dappfile._cmpElement(elm, filters);
        });
    };

    static _cmpElement(elm, filters) {
        for (var index = 0; index < filters.length; index++) {
            const filter = filters[index];
            // TODO? if value is an array we should recurse?
            const keys = Object.keys(filter);
            for (var index2 = 0; index2 < keys.length; index2++) {
                const key = keys[index2];
                if (filter[key] !== elm[key]) return false;
            }
        }
        return true;
    }

    /**
     * Validate object as a valid dappfile.
     */
    static validateDappfile = dappfileObj => {
        return true;
    };
}
