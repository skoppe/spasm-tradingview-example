import { createChart } from 'lightweight-charts';
import {spasm as spa, decoders as decoder, encoders as encoder} from './spasm.js';

let spasm = spa;
let memory = {};
const setupMemory = () => {
    let buffer = spasm.memory.buffer;
    if (memory.heapi32s && !memory.heapi32s.length === 0)
        return;
    memory.heapi32s = new Int32Array(buffer)
    memory.heapi32u = new Uint32Array(buffer)
    memory.heapi16s = new Int16Array(buffer)
    memory.heapi16u = new Uint16Array(buffer)
    memory.heapi8s = new Int8Array(buffer)
    memory.heapi8u = new Uint8Array(buffer)
    memory.heapf32 = new Float32Array(buffer)
    memory.heapf64 = new Float64Array(buffer)
}
const setBool = (ptr, val) => (memory.heapi32u[ptr/4] = +val),
      setInt = (ptr, val) => (memory.heapi32s[ptr/4] = val),
      setUInt = (ptr, val) => (memory.heapi32u[ptr/4] = val),
      setShort = (ptr, val) => (memory.heapi16s[ptr/2] = val),
      setUShort = (ptr, val) => (memory.heapi16u[ptr/2] = val),
      setByte = (ptr, val) => (memory.heapi8s[ptr] = val),
      setUByte = (ptr, val) => (memory.heapi8u[ptr] = val),
      setFloat = (ptr, val) => (memory.heapf32[ptr/4] = val),
      setDouble = (ptr, val) => (memory.heapf64[ptr/8] = val),
      getBool = (ptr) => memory.heapi32u[ptr/4],
      getInt = (ptr) => memory.heapi32s[ptr/4],
      getUInt = (ptr) => memory.heapi32u[ptr/4],
      getShort = (ptr) => memory.heapi16s[ptr/2],
      getUShort = (ptr) => memory.heapi16u[ptr/2],
      getByte = (ptr) => memory.heapi8s[ptr],
      getUByte = (ptr) => memory.heapi8u[ptr],
      getFloat = (ptr) => memory.heapf32[ptr/4],
      getDouble = (ptr) => memory.heapf64[ptr/8],
      isDefined = (val) => (val != undefined && val != null),
      encode_handle = (ptr, val) => { setUInt(ptr, spasm.addObject(val)); },
      decode_handle = (ptr) => { return spasm.objects[getUInt(ptr)]; };

class LineData {
    constructor(ptr) {
        this.ptr = ptr;
    }
    get time() {
        return getUInt(this.ptr);
    }
    get value() {
        return getFloat(this.ptr + 4);
    }
}

let jsExports = {
    env: {
        createChart: (container, options) => {
            return spasm.addObject(createChart(spasm.objects[container], { width: 400, height: 300 }));
        },
        Chart_addLineSeries: (ctx, lineOptions) => {
            return spasm.addObject(spasm.objects[ctx].addLineSeries(lineOptions));
        },
        lineSeries_setData: (ctx, len, ptr) => {
            setupMemory();
            // probably should proxy array as well
            let data = [];
            for(var i = 0; i < len; i++) {
                data.push(new LineData(ptr + (i*8)));
            }
            spasm.objects[ctx].setData(data);
        }
    }
}

export {jsExports}
