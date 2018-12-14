import React, { Component } from 'react';
import Proptypes from 'prop-types';
import classNames from 'classnames';
import style from '../style.less';
import { IconClose } from '../../icons';

const TemplateCategory = ({ onCategorySelected, title } = props) => (
    <div onClick={onCategorySelected}>{title}</div>
)

TemplateCategory.propTypes = {
    title: Proptypes.string.isRequired,
    onCategorySelected: Proptypes.func.isRequired,
}

const GridLayout = ({ templates, onTemplateSelected, templateSelectedId, categorySelectedId } = props) => (
    <div className={style.gridLayout}>
        <div id="mainContent" className="container" style={{display: 'grid', gridTemplateColumns: 'repeat(2, 0fr)', gridGap: '10px', gridAutoRows: 'minMax(100px, auto)'}}>
        { templates
            .filter((template) => template.categories.indexOf(categorySelectedId) > -1)
            .map((template) => (
                <TemplateLayout
                    key={template.id}
                    image={template.image}
                    name={template.name}
                    description={template.description}
                    selected={template.id ==  templateSelectedId}
                    onTemplateSelected={() => onTemplateSelected(template)}
                />
        ))}
        </div>
    </div>
);

GridLayout.propTypes = {
    templates: Proptypes.array.isRequired,
    onTemplateSelected: Proptypes.func.isRequired,
    templateSelectedId: Proptypes.number,
    categorySelectedId: Proptypes.number,
}

const TemplateLayout = ({ image, name, description, selected, onTemplateSelected } = props) => (
    <div onClick={onTemplateSelected} className={classNames([style.templateLayout], { [style.selected]: selected }, style.alignContentCenter)}>
        <img src={image} width="300"/>
        <div style={{height: '90px'}}>
        <div className={style.title}>{name}</div>
        <div className={style.description}>{description}</div>
        </div>
    </div>
);

TemplateLayout.propTypes = {
    image: Proptypes.string.isRequired,
    name: Proptypes.string.isRequired,
    description: Proptypes.string.isRequired,
    selected: Proptypes.bool.isRequired,
    onTemplateSelected: Proptypes.func.isRequired
}

export default class SelectTemplate extends Component {

    state = {
        categorySelectedId: 0,
        templateSelected: null
    }

    onCreateProjectHandle = () => {
        this.props.onTemplateSelected(this.state.templateSelected);
    }

    onCancelClickHandle = () => {
        this.props.onCloseClick();
    }

    onCategorySelected(id) {
        this.setState({
            categorySelectedId: id
        })
    }

    onTemplateSelected = (template) => {
        this.setState({
            templateSelected: template
        })
    }

    onCloseClickHandle = () => {
        this.props.onCloseClick();
    };

    render() {
        let { categories, templates } = this.props;
        let { categorySelectedId, templateSelected } = this.state;

        return(
            <div className={classNames([style.newDapp, "modal"])}>
                <div className={style.step2}>
                    <div className={style.header}>
                        <div className={style.title}>Select Template</div>
                        <button className={classNames([style.closeIcon, "btnNoBg"])} onClick={this.onCloseClickHandle}>
                            <IconClose />
                        </button>
                    </div>
                    <div className={classNames([style.area, style.container])}>
                        <div className={style.categoriesArea}>
                            <div className={style.categoriesTitle}>Categories</div>
                                <ul>
                                    {
                                        categories.map(category =>
                                            <li
                                                key={category.id}
                                                className={categorySelectedId == category.id ? style.selected : null}>
                                                <TemplateCategory
                                                    title={category.name}
                                                    onCategorySelected={() => this.onCategorySelected(category.id)}/>
                                            </li>
                                        )
                                    }
                                </ul>
                            </div>
                        <div className={style.templateListContainer}>
                            <div className={style.templateListArea}>
                                <GridLayout
                                    templates={templates}
                                    onTemplateSelected={this.onTemplateSelected}
                                    templateSelectedId={templateSelected ? templateSelected.id : null}
                                    categorySelectedId={categorySelectedId}/>
                            </div>
                        </div>
                    </div>
                    <div className={style.footer}>
                        <button onClick={this.onCancelClickHandle} className="btn2 noBg mr-2">Cancel</button>
                        <button onClick={this.onCreateProjectHandle} disabled={!templateSelected} className="btn2">Select Template</button>
                    </div>
                </div>
            </div>
        );
    }
}

SelectTemplate.proptypes = {
    categories: Proptypes.array.isRequired,
    templates: Proptypes.array.isRequired,
    onTemplateSelected: Proptypes.func.isRequired,
    onCloseClick: Proptypes.func.isRequired
}
