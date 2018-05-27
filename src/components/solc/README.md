# Solc in iframe

When src/solc-iframe.js is updated re-browserify with with:  
```sh
./node_modules/browserify/bin/cmd.js src/components/solc/src/solc-iframe.js -o src/components/solc/dist/solc-iframe-v0.4.21.js
```
Always use new names to prevent browser caching.

Update the `./dist/index-xx.html` to point to the new version.

Then rename `index-xx.html` to `index-xy.html` to ensure proper reload.

Also update the `index-xy.html` reference in `index.js`.
`<iframe ref={setRef} src="/evm/index-xy.html" frameborder="0"></iframe>`


The `./dist` files are copied to `build/solc` thanks to `preact.config.js`.

# Updating solc version
Update the `solc`  package version in `package.json`.
Copy the file `./node_modules/solc/soljson.js` to `./src/components/solc/dist/soljson-0.4.21.js` and update `dist/index-xx.html` to refer to the new js file. Remove the old `soljson-version.js` file.
