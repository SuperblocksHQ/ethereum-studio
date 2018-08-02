import { h, Component } from 'preact';
import { IconDeployGreen, IconDropdown } from '../icons';
import style from "./style"

class NetworkSelector extends Component {
    render() {
        return (
            <div class={ style.selector }>
                Browser
                <div class={ style.dropdownIcon }>
                    <IconDropdown height="10" width="12"/>
                </div>
            </div>
        )
    }
}

class AccountSelector extends Component {
    render() {
        return (
            <div class={ style.selector }>
                Default
                <div class={ style.dropdownIcon }>
                    <IconDropdown height="10" width="12"/>
                </div>
            </div>
        )
    }
}

export default class NetworkAcccountSelector extends Component {
    render () {
        return (
        <div class={ style.container }>
                <IconDeployGreen />
                <NetworkSelector />
                <div class={ style.separator } />
                <AccountSelector />
            </div>
        );
    }
}
