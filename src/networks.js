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
        endpoint: "https://kovan.infura.io/",
        chainId: 42,
        interval: 5000,
    },
    mainnet: {
        endpoint: "https://mainnet.infura.io/",
        chainId: 1,
        interval: 10000,
    },
    ropsten: {
        endpoint: "https://ropsten.infura.io/",
        chainId: 3,
        interval: 2500,
    },
    rinkeby: {
        endpoint: "https://rinkeby.infura.io/",
        chainId: 4,
        interval: 2500,
    },
};

export default Networks;
