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
    infuranet: {
        endpoint: "https://infuranet.infura.io/",
        chainId: 5810,
        interval: 5000,
    },
    kovan: {
        endpoint: "https://kovan.infura.io/v3/148bee2b5da148a7b77a83f7504d00e7/",
        chainId: 42,
        interval: 5000,
    },
    mainnet: {
        endpoint: "https://mainnet.infura.io/v3/148bee2b5da148a7b77a83f7504d00e7/",
        chainId: 1,
        interval: 10000,
    },
    ropsten: {
        endpoint: "https://ropsten.infura.io/v3/148bee2b5da148a7b77a83f7504d00e7/",
        chainId: 3,
        interval: 2500,
    },
    rinkeby: {
        endpoint: "https://rinkeby.infura.io/v3/148bee2b5da148a7b77a83f7504d00e7/",
        chainId: 4,
        interval: 2500,
    },
    goerli: {
        endpoint: "https://goerli.infura.io/v3/148bee2b5da148a7b77a83f7504d00e7/",
        chainId: 5,
        interval: 30000,
    },
};

export default Networks;
