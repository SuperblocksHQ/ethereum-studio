import { h, Component } from 'preact';
import classNames from 'classnames';
import style from './style';
import Caret from '../caret';
import {
    IconGuide,
    IconVideoTutorials,
    IconHelpCenter,
    IconAskQuestion,
    IconWhatsNew
} from '../icons';

const LinkItem = ({ icon, title, link } = props) => (
    <a href={link} class={classNames([style.link, style.item])} target="_blank" rel="noopener noreferrer">
        <div class={style.icon}>
            {icon}
        </div>
        <div class={style.title}>
            {title}
        </div>
    </a>
)

export default class LearnAndResources extends Component {
    state = {
        expanded: true
    }

    toogle = () => {
        this.setState({
            expanded: !this.state.expanded
        });
    }

    render () {
        const { ...props } = this.props;
        const { expanded } = this.state;
        return (
            <div {...props} >
                <div onClick={this.toogle} class={classNames([style.header, style.item])}>
                    <Caret
                        expanded={expanded}
                    />
                    Learning And Resources
                </div>
                { expanded ?
                    <div class={style.listContainer}>
                        <ul>
                            <li>
                                <LinkItem
                                    icon={<IconGuide />}
                                    title={"Guide to Superblocks Lab"}
                                    link={"https://www.superblocks.com"}
                                />
                                <LinkItem
                                    icon={<IconVideoTutorials />}
                                    title={"Video tutorials"}
                                    link={"https://www.superblocks.com"}
                                />
                                <LinkItem
                                    icon={<IconHelpCenter />}
                                    title={"Help Center"}
                                    link={"https://www.superblocks.com"}
                                />
                                <LinkItem
                                    icon={<IconAskQuestion />}
                                    title={"Ask a question"}
                                    link={"https://www.superblocks.com"}
                                />
                                <LinkItem
                                    icon={<IconWhatsNew />}
                                    title={"What's new"}
                                    link={"https://www.superblocks.com"}
                                />
                            </li>
                        </ul>
                    </div>
                    : null }
            </div>
        );
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////// Learn and resources //////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// var learningAndResources=this._newItem({ title: "Learning and Resources", type: "app", type2: "composite", render: this._renderLearnSectionTitle, _project: projectItem, toggable: true, icon: null, state: { open: true, children: [
//     this._newItem({ title: "Guide to Superblocks Lab", _project: projectItem, type: "file", type2: 'html', _project: projectItem, onClick: this._openItem, icon: <IconGuide />, state: { _tag:0 }}),
//     this._newItem({ title: "Video tutorials", _project: projectItem, type: "file", type2: 'js', _project: projectItem, onClick: this._openItem, icon: <IconVideoTutorials />, state:{ _tag:3 }}),
//     this._newItem({ title: "Help Center", _project: projectItem, type: "file", type2: 'css', _project: projectItem, onClick: this._openItem, icon: <IconHelpCenter />, state:{ _tag:2 }}),
//     this._newItem({ title: "Ask a question", _project: projectItem, type: "file", type2: 'css', _project: projectItem, onClick: this._openItem, icon: <IconAskQuestion />, state:{ _tag:2 }}),
//     this._newItem({ title: "What's new", _project: projectItem, type: "file", type2: 'css', _project: projectItem, onClick: this._openItem, icon: <IconWhatsNew />, state:{ _tag:2 }}),
// ]}});
// children.push(learningAndResources);
