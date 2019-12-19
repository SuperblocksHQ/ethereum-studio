# Updating the EVM version

After changing _src/evm.js_, follow the instructions below to recompile it.

# EVM in iframe

When either `src/evm-iframe.js` is updated or the `evm.js` is replaced, then re-browserify with with:  
```sh
./node_modules/browserify/bin/cmd.js ./packages/editor/src/services/evm/src/evm-iframe.js -o ./packages/editor/src/services/evm/dist/evm-iframe-version.js
```

Always use new names to prevent browser caching.

Update the `./dist/index-vxx.html` to point to the new version.
Then rename `index-vxx.html` to `index-vxy.html` to ensure proper reload.

Also update the `index-vxx.html` reference in `index.js`.
`<iframe ref={setRef} src="/evm/index-xy.html" frameborder="0"></iframe>`

Remove the old `evm-iframe-vxx.js` to avoid confusion.

The `./dist` files are copied to `build/evm` thanks to the build configuration.

