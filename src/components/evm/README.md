# Updating the EVM version
```sh
cp ~/studio-vm/src/vm.js src/components/evm/src/evm.js
```

Follow the below instructions to recompile it.

# EVM in iframe

When `src/evm-iframe.js` is updated or the `evm.js` is replaced then re-browserify with with:  
```sh
./node_modules/browserify/bin/cmd.js src/components/evm/src/evm-iframe.js -o src/components/evm/dist/evm-iframe-version.js
```

Always use new names to prevent browser caching.

Update the `./dist/index-xx.html` to point to the new version.
Then rename `index-xx.html` to `index-xy.html` to ensure proper reload.

Also update the `index-xx.html` reference in `index.js`.
`<iframe ref={setRef} src="/evm/index-xy.html" frameborder="0"></iframe>`

Remove the old `evm-iframe-xx.js` to avoid confusion.

The `./dist` files are copied to `build/evm` thanks to `preact.config.js`.

