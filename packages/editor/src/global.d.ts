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

declare module '*.less' {
    const content: any;
    export default content;
}

declare module "*.json" {
    const value: any;
    export default value;
}

declare module 'react-monaco-editor' {
    const content: any;
    export default content;
}

declare module 'eth-lightwallet/dist/lightwallet.min.js' {
    const content: any;
    export default content;
}

declare module 'ethereumjs-tx' {
    const content: any;
    export default content;
}

declare module 'jszip';

declare module 'file-saver';

declare module 'showdown-highlight';

type Nullable<T> = T | null;

declare interface Window { web3: any; Web3: any; ENV: any }
