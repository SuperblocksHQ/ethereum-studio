import { INetwork } from './models';

// Map network to endpoint.
export const Networks: INetwork[] = [
    {
        host: 'http://superblocks-browser',
        port: 8545,
        id: '*'
    },
    {
        host: 'https://ropsten.infura.io/',
        port: 8545,
        id: '*'
    }
];
