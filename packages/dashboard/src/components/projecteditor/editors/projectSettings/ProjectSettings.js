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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import style from '../style-editor-contract.less';

export default class ProjecSettings extends Component {

    state = {
        form: null,
        isDirty: false
    }

    constructor(props) {
        super(props);
        this.id = props.id + '_editor';
        this.props.parent.childComponent = this;
    }

    componentWillMount() {
        this.setState({
            form: {
                title: this.props.item.getProject().getTitle(),
                name: this.props.item.getProject().getName(),
            }
        });
    }

    redraw = () => {
        this.forceUpdate();
    };

    canClose = (cb, silent) => {
        if (this.state.isDirty && !silent) {
            const flag = confirm(
                'There is unsaved data. Do you want to close tab and loose the changes?'
            );
            cb(flag ? 0 : 1);
            return;
        }
        cb(0);
    };

    save = e => {
        e.preventDefault();
        if (this.state.form.title.length == 0) {
            alert('Please give the project a snappy title.');
            return false;
        }
        if (this.state.form.title.length > 20) {
            alert('Illegal title. Max 20 characters.');
            return false;
        }
        if (!this.state.form.name.match(/^([a-zA-Z0-9-]+)$/) || this.state.form.name.length > 20) {
            alert(
                'Illegal projectname. Only A-Za-z0-9 and dash (-) allowed. Max 20 characters.'
            );
            return false;
        }

        this.props.updateProjectSettings({
            name: this.state.form.name,
            title: this.state.form.title
        });
        this.setState({ isDirty: false });
    };

    onChange = (e, key) => {
        var value = e.target.value;
        const form = this.state.form;
        form[key] = value;
        this.setState({ isDirty: true, form: form });
    };

    render() {
        const { form } = this.state;
        return (
            <div id={this.id} className={style.main}>
                <div className="scrollable-y" id={this.id + '_scrollable'}>
                    <div className={style.inner}>
                        <h1 className={style.title}>Project Settings</h1>
                        <div className={style.form}>
                            <form action="">
                                <div className={classNames(['superInputDark', style.field])}>
                                    <label htmlFor="name">Name</label>
                                    <input
                                        id="name"
                                        maxLength="20"
                                        type="text"
                                        value={form.name}
                                        onKeyUp={e => {
                                            this.onChange(e, 'name');
                                        }}
                                        onChange={e => {
                                            this.onChange(e, 'name');
                                        }}
                                    />
                                </div>
                                <div className={classNames(['superInputDark', style.field])}>
                                    <label htmlFor="title">Title</label>
                                    <input
                                        id="title"
                                        maxLength="20"
                                        type="text"
                                        value={form.title}
                                        onKeyUp={e => {
                                            this.onChange(e, 'title');
                                        }}
                                        onChange={e => {
                                            this.onChange(e, 'title');
                                        }}
                                    />
                                </div>
                                <button
                                    href="#"
                                    className="btn2"
                                    disabled={!this.state.isDirty}
                                    onClick={this.save}
                                >
                                    Save
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ProjecSettings.propTypes = {
    updateProjectSettings: PropTypes.func.isRequired
}
