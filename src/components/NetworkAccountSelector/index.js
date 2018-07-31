import { h, Component } from 'preact';
import { IconDeployGreen } from '../icons';

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
            <div>
                <IconDeployGreen />
                <NetworkSelector />
                <AccountSelector />
            </div>
        );
    }
}
