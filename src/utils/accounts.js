/**
* Extract the account information from a given accountItem based
* on the selected environment in the project.
*
* @param {ProjectItem} project - The project from which we want to extract the address from.
* @param {AccountItem} account - The account to extract the wallet address.
* @param {Wallet} wallet - Helper class managing everything with wallets
* @return {accountType, isLocked, network, address}:
*     where:
*      accounType=wallet|pseudo|metamask
*      isLocked is true if the wallet or metamask is locked
*      network is the current network
*      address is the account public address (for the current network)
*/
export const getAccountInfo = (project, account, wallet) => {
    if (!project || !account) return {};
    const chosenEnv = project.getEnvironment();
    const network = chosenEnv;
    var isLocked = false;
    var walletType = null;
    var address = '';
    var accountType;

    const walletName = account.getWallet(chosenEnv);
    const accountIndex = account.getAccountIndex(chosenEnv);

    var walletItem;
    if (walletName) {
        const walletsItem = project.getHiddenItem('wallets');
        walletItem = walletsItem.getByName(walletName);
    }

    if (walletItem) {
        walletType = walletItem.getWalletType();
        if (walletType == 'external') {
            accountType = 'metamask';
            if (!window.web3) {
                isLocked = true;
            } else {
                const extAccounts = window.web3.eth.accounts || [];
                isLocked = extAccounts.length < 1;
                address = extAccounts[0];
            }
        } else {
            accountType = 'wallet';
            if (wallet.isOpen(walletName)) {
                try {
                    address = wallet.getAddress(
                        walletName,
                        accountIndex
                    );
                } catch (ex) {
                    address = '0x0';
                }
            } else {
                isLocked = true;
            }
        }
    } else {
        address = account.getAddress(chosenEnv);
        accountType = 'pseudo';
    }

    return { accountType, isLocked, network, address };
};

/**
 * Shorten the the display of an address extracting only the first and last 5 characters
 * of the address value (ex. 0xea6...e7dad)
 *
 * @param {string} address The address to be formatted
 */
export const shortenAddres = (address) => {
    return address ?
            address.substring(0, 5) + '...' + address.substring(address.length - 5, address.length)
        :
            '...';
}
