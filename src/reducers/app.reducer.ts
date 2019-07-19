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

import { AnyAction } from 'redux';
import { appActions } from '../actions';

export const initialState = {
    version: '1.8.0',
    isEmbeddedMode: false,
    showBanner: getShowBanner()
};

function getShowBanner() {
    const count = getCloseBannerCount();
    return count > 2 ? false : true;
}

function getCloseBannerCount() {
    const closeBannerCount = localStorage.getItem('closeBannerCount');
    if (closeBannerCount !== null) {
        return parseInt(closeBannerCount, 10);
    } else {
        return 0;
    }
}

function increaseBannerCount() {
    const closeBannerCount = localStorage.getItem('closeBannerCount');

    let count = 0;
    if (closeBannerCount !== null) {
        count = parseInt(closeBannerCount, 10);
    }

    count++;
    localStorage.setItem('closeBannerCount', String(count));
}

export default function appReducer(state = initialState, action: AnyAction) {
    switch (action.type) {
        case appActions.APP_START:
            return {
                ...state,
                isEmbeddedMode: action.data.isEmbeddedMode
            };
        case appActions.CLOSE_BANNER:

            increaseBannerCount();

            return {
                ...state,
                showBanner: false
            };
        default:
            return state;
    }
}
