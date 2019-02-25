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

/**
 * Shorten the the display of an balance extracting only the first 8 characters and
 * append 'eth' at the end of string
 *
 * @param {string} balance The account balance to be formated
 */
export const shortenBalance = (balance) => {
    return balance ?
            balance.substring(0, balance.toString().indexOf(".") + 8) + ' eth'
        :
            balance;
}
