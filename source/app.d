import spasm.spa;
import spasm.bindings.html : HTMLElement;
import ldc.attributes;

struct LineData {
  uint time;
  float value;
}

struct Chart {
  JsHandle handle;
  alias handle this;
  this(Handle h) {
    handle = JsHandle(h);
  }
  static Chart create(scope ref HTMLElement container) {
    return Chart(createChart(*container.handle.ptr));
  }
  LineSeries addLineSeries() {
    return LineSeries(Chart_addLineSeries(*handle.ptr));
  }
}

struct LineSeries {
  JsHandle handle;
  alias handle this;
  this(Handle h) {
    handle = JsHandle(h);
  }
  void setData(const LineData[] data) {
    lineSeries_setData(*handle.ptr, data);
  }
}

extern (C) {
  // should work in ldc 1.16.0
  // @llvmAttr("wasm-import-module", "npm:lightweight-charts")
  // {
    Handle createChart(Handle);
    Handle Chart_addLineSeries(Handle);
    void lineSeries_setData(Handle, const LineData[]);
  // }
}

pragma(mangle, "_start")
void _start() {
  auto node = HTMLElement(getRoot());
  static immutable data = [
               LineData(1562694650, 45),
               LineData(1562694660, 46),
               LineData(1562694670, 48),
               LineData(1562694680, 52),
               LineData(1562694690, 49.1),
               LineData(1562694700, 33),
               LineData(1562694710, 22.7),
               LineData(1562694720, 24)
               ];

  Chart.create(node).addLineSeries().setData(data[]);
}
