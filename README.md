# Example showcasing use of lightweight-charts library in spasm

This repo contains example D bindings to the lightweight-charts library from tradingview. The library is written in Typescript, but with a little js glue code and some D bindings, we can use it from within D+wasm.

# Demo

[demo](https://skoppe.github.io/spasm-tradingview-example/index.html)

# Bindings

See [tradingview.js](https://github.com/skoppe/spasm-tradingview-example/blob/master/spasm/modules/tradingview.js) for the JS glue code, and [app.d](https://github.com/skoppe/spasm-tradingview-example/blob/master/source/app.d) for the D bindings.

# Future

I have started work on a generator to create D bindings from typescript definition files.
