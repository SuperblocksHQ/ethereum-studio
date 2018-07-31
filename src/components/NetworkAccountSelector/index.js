import { h, Component } from 'preact';
import { IconDeployGreen } from '../icons';
import style from "./style"

class NetworkSelector extends Component {
    render() {
        return (
            <div>Browser</div>
        )
    }
}

class AccountSelector extends Component {
    render() {
        return (
            <div>Default</div>
        )
    }
}

export default class NetworkAcccountSelector extends Component {
    render () {
        return (
        <div class={ style.container }>
                <IconDeployGreen />
                <NetworkSelector />
                <AccountSelector />
            </div>
        );
    }
}
