#!/usr/bin/env sh
#
# Copyright 2018 Superblocks AB
#
# This file is part of Superblocks Lab.
#
# Superblocks Lab is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation version 3 of the License.
#
# Superblocks Lab is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with Superblocks Lab. If not, see <http://www.gnu.org/licenses/>.
#
# Bump Superblocks Lab version
#

set -o errexit
set -o nounset


#
# Check arguments
if [ "$#" -lt 1 ]; then
    printf "Missing version name. Example: $0 \"5.1 beta9.9\"\n" >&2
    exit 1
fi

#
# Check requirements
if ! command -v sed >/dev/null; then
    printf "Missing sed program. Exiting...\n" >&2
    exit 1
fi

#
# Data
_version_name="$1"
_version_date=$(date "+%Y-%m-%d")

#
# Files to change
_src_components_app_file="./src/reducers/app.js"
_src_manifest_file="./src/manifest.json"
_changelog_file="./CHANGELOG"

# Update files
sed -i.bak "s/\"version\"\:.*/\"version\": \"${_version_name}\"/" "$_src_manifest_file"
sed -i.bak "s/.*version\: \'.*/    version\: \'${_version_name}\'\,/" "$_src_components_app_file"
sed -i.bak "s/\[current\]/\[${_version_name}\]/" "$_changelog_file"

#
# Cleanup temporary files
if [ -f "$_src_manifest_file" ]; then
    rm "${_src_manifest_file}.bak"
fi

if [ -f "$_src_components_app_file" ]; then
    rm "${_src_components_app_file}.bak"
fi

if [ -f "$_changelog_file" ]; then
    rm "${_changelog_file}.bak"
fi
