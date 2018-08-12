import { h, Component } from 'preact';
import style from './style';
import {
    IconGithub,
    IconTwitter,
    IconTelegram
} from '../icons';

export default class ContactContainer extends Component {
    render() {
        let { appVersion } = this.props;
        return (
            <div class={style.container}>
                <div style="display: inline-block">
                    <a href="https://twitter.com/getsuperblocks" target="_blank" rel="noopener noreferrer" class={style.contactIcon}>
                        <IconTwitter />
                    </a>
                    <a href="https://github.com/SuperblocksHQ/studio" target="_blank" rel="noopener noreferrer" class={style.contactIcon}>
                        <IconGithub />
                    </a>
                    <a href="https://t.me/GetSuperblocks" target="_blank" rel="noopener noreferrer" class={style.contactIcon}>
                        <IconTelegram />
                    </a>
                </div>
                <div class={style.version}>
                    {appVersion}
                </div>
            </div>
        );
    }
}
