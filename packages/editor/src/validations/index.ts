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

export const validateGasLimit = (gasLimit: number) =>
    ((gasLimit <= 0 || gasLimit > 7900000) ? 'GAS_LIMIT' : null);

export const validateGasPrice = (gasPrice: number) =>
    ((gasPrice <= 0 || gasPrice > 100000000000) ? 'GAS_PRICE' : null);

export const validateMainnetWarning = (projectName: string, value: string) =>
    (projectName !== value ? 'MAINNNET_WARNING' : null);

export const validateProjectName = (projectName: string) =>
    (!/^[a-zA-ZA-Z0-9 -]+$/.test(projectName) || /^\s*$/.test(projectName) || projectName === '' ? 'PROJECT_NAME' : null);

export const validateAccountName = (accountName: string) =>
    (!/^[a-zA-ZA-Z0-9 -]+$/.test(accountName) || /^\s*$/.test(accountName) || accountName === '' ? 'ACCOUNT_NAME' : null);
