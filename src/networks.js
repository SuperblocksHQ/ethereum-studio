const INFURA_API_KEY = process.env.REACT_APP_INFURA_API_KEY;
// Map network to endpoint.
const Networks = {
    browser: {
        endpoint: "http://superblocks-browser",
        chainId: undefined,
        interval: 1000,
        name: 'browser'
    },
    custom: {
        endpoint: "http://localhost:8545/",
        chainId: undefined,
        interval: 2000,
        name: 'custom'
    },
    kovan: {
        endpoint: `https://kovan.infura.io/v3/${INFURA_API_KEY}`,
        chainId: 42,
        interval: 5000,
    },
    mainnet: {
        endpoint: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
        chainId: 1,
        interval: 10000,
    },
    ropsten: {
        endpoint: `https://ropsten.infura.io/v3/${INFURA_API_KEY}`,
        chainId: 3,
        interval: 2500,
    },
    rinkeby: {
        endpoint: `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`,
        chainId: 4,
        interval: 2500,
    }
};

export default Networks;
