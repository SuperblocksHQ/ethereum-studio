const INFURA_API_KEY = process.env.REACT_APP_INFURA_API_KEY;

interface INetwork {
    endpoint: string;
    interval: number;
    name: string;
    chainId?: number;
}

interface INetworkRecord {
    [key: string]: INetwork;
 }

// Map network to endpoint.
const Networks: INetworkRecord = {
    browser: {
        endpoint: 'http://superblocks-browser',
        chainId: undefined,
        interval: 1000,
        name: 'browser'
    },
    custom: {
        endpoint: 'http://localhost:8545/',
        chainId: undefined,
        interval: 2000,
        name: 'custom'
    },
    kovan: {
        endpoint: `https://kovan.infura.io/v3/${INFURA_API_KEY}`,
        chainId: 42,
        interval: 5000,
        name: 'kovan'
    },
    mainnet: {
        endpoint: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
        chainId: 1,
        interval: 10000,
        name: 'mainnet'
    },
    ropsten: {
        endpoint: `https://ropsten.infura.io/v3/${INFURA_API_KEY}`,
        chainId: 3,
        interval: 2500,
        name: 'ropsten'
    },
    rinkeby: {
        endpoint: `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`,
        chainId: 4,
        interval: 2500,
        name: 'rinkeby'
    }
};

export default Networks;
