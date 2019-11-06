import { INetwork } from './models';

const INFURA_API_KEY = process.env.REACT_APP_INFURA_API_KEY;

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
