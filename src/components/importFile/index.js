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

import { connect } from 'react-redux';
import ImportFileModal from './ImportFileModal';
import { savePreferences } from '../../actions/settings';

const mapDispatchToProps = (dispatch) => {
    return {
        savePreferences: (newPreferences) => {
            dispatch(savePreferences(newPreferences))
        }
    }
}

export default connect(null, mapDispatchToProps)(ImportFileModal);
