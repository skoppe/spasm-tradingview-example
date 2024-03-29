// File is autogenerated with `dub run spasm:bootstrap-webpack`
const abort = (what,file,line) => {
    throw `ABORT: $what @ $file:$line`;
}

const utf8Decoder = new TextDecoder('utf-8');
const utf8Encoder = new TextEncoder();

let objects = {1: document, 2: window};
let freelist = [];
let addObject = (value) => {
        if (value === null || value == undefined) return 0;
        let idx = freelist.pop() || ++spasm.lastPtr;
        objects[idx] = value;
        return idx;
    },
    getObject = (ptr) => objects[ptr];
const setupMemory = (memory) => {
    spasm.memory = memory;
    spasm.buffer = memory.buffer;
}
const spasm = {
    lastPtr: 2,
    instance: null,
    init: (modules) => {
        window.spasm = spasm
        if (!spasm.exports) {
            var tmp = {};
            modules.map(m=>m.jsExports).filter(a=>!!a).map(e=>Object.entries(e).forEach(e=>tmp[e[0]] = Object.assign.apply(null,[tmp[e[0]] || {}, e[1]])));
            spasm.exports = tmp;
        }
        if ('undefined' === typeof WebAssembly.instantiateStreaming) {
            fetch('spasm-tradingview')
                .then(request => request.arrayBuffer())
                .then(bytes => WebAssembly.compile(bytes))
                .then(module => {
                    let instance = new WebAssembly.Instance(module, spasm.exports);
                    spasm.instance = instance
                    setupMemory(instance.exports.memory);
                    instance.exports._start(instance.exports.__heap_base);
                });
        } else {
            WebAssembly.instantiateStreaming(fetch('spasm-tradingview'), spasm.exports)
                .then(obj => {
                    let instance = obj.instance;
                    spasm.instance = instance;
                    setupMemory(instance.exports.memory);
                    instance.exports._start(instance.exports.__heap_base);
                });
        }
    },
    objects,
    addObject: addObject,
}

let encoders = {
    string: (ptr, val) => {
        const encodedString = utf8Encoder.encode(val);
        const wasmPtr = spasm.instance.exports.allocString(encodedString.length);
        const asBytes = new Uint8Array(spasm.memory.buffer, wasmPtr, encodedString.length);
        const heapi32u = new Uint32Array(spasm.memory.buffer)
        heapi32u[ptr / 4] = encodedString.length;
        heapi32u[(ptr / 4)+1] = wasmPtr;
        asBytes.set(encodedString);
        return ptr;
    }
}
let decoders = {
    string: (len, offset) => {
        if (offset == null) {
            const heapi32u = new Uint32Array(spasm.memory.buffer)
            offset = heapi32u[(len+4)/4];
            len = heapi32u[(len/4)];
        }
        return utf8Decoder.decode(new DataView(spasm.memory.buffer,offset,len));
    }
}
let jsExports = {
    env: {
        onOutOfMemoryError: () => abort("Out of memory exception"),
        _d_assert: (file,line) => abort("assert",file,line),
        doLog: arg => console.log(arg),
        memory: spasm.memory,
        __assert: () => {},
        _Unwind_Resume: () => {
            console.log(arguments);
        },
        _d_dynamic_cast: () => {
            console.log(arguments)
        },
        spasm_add__bool: (b)=>addObject(!!b),
        spasm_add__int: addObject,
        spasm_add__uint: addObject,
        spasm_add__long: addObject,
        spasm_add__ulong: addObject,
        spasm_add__short: addObject,
        spasm_add__ushort: addObject,
        spasm_add__byte: addObject,
        spasm_add__ubyte: addObject,
        spasm_add__float: addObject,
        spasm_add__double: addObject,
        spasm_add__object: () => addObject({}),
        spasm_add__string: (len, offset) => {
            return addObject(decoders.string(len, offset));
        },
        spasm_get__field: (handle, len, offset) => {
            return addObject(getObject(handle)[decoders.string(len,offset)]);
        },
        spasm_get__int: getObject,
        spasm_get__uint: getObject,
        spasm_get__long: getObject,
        spasm_get__ulong: getObject,
        spasm_get__short: getObject,
        spasm_get__ushort: getObject,
        spasm_get__float: getObject,
        spasm_get__double: getObject,
        spasm_get__byte: getObject,
        spasm_get__ubyte: getObject,
        spasm_get__string: (rawResult, ptr) => {
            encoders.string(rawResult, getObject(ptr));
        },
        spasm_removeObject: (ctx) => {
            freelist.push(ctx)
            delete objects[ctx]
        },
        DataView_Create: (len, offset) => {
            return addObject(new DataView(spasm.memory.buffer, offset, len));
        },
        Float32Array_Create: (len, offset) => {
            return addObject(new Float32Array(spasm.memory.buffer, offset, len));
        },
        Uint8Array_Create: (len, offset) => {
            return addObject(new Uint8Array(spasm.memory.buffer, offset, len));
        }
    }
};

export {spasm, encoders, decoders, jsExports};
