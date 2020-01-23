import { INetwork } from './models';

interface INetworkRecord {
    [key: string]: INetwork;
 }

// Map network to endpoint.
const Networks: INetworkRecord = {
    browser: {
        endpoint: 'http://ethereum-studio-browser',
        chainId: undefined,
        interval: 1000,
        name: 'browser'
    }
};

export default Networks;
