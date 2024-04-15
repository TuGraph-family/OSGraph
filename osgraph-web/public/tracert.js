(function loader() {
  if (
    Object.prototype.toString.call(window.TracertCmdCache) === "[object Array]"
  ) {
    window.TracertCmdCache = [];
  }
  var Tracert = {
    _isInit: true,
    _readyToRun: [],
    // 生成uuid
    _guid: function _guid() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0;
          var v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    },
    get: function get(key) {
      if (key === "pageId") {
        window._tracert_loader_cfg = window._tracert_loader_cfg || {};
        if (window._tracert_loader_cfg.pageId) {
          return window._tracert_loader_cfg.pageId;
        }
        var metaa = document.querySelectorAll("meta[name=data-aspm]");
        var spma = metaa && metaa[0] && metaa[0].getAttribute("content");
        var spmb = document.body && document.body.getAttribute("data-aspm");
        var pageId =
          spma && spmb
            ? ""
                .concat(spma, ".")
                .concat(spmb, "_")
                .concat(Tracert._guid(), "_")
                .concat(Date.now())
            : "-_".concat(Tracert._guid(), "_").concat(Date.now());
        window._tracert_loader_cfg.pageId = pageId;
        return pageId;
      }
      return this[key];
    },
    call: function call() {
      var args = arguments;
      var argsList;
      try {
        argsList = [].slice.call(args, 0);
      } catch (ex) {
        var argsLen = args.length;
        argsList = [];
        for (var i = 0; i < argsLen; i++) {
          argsList.push(args[i]);
        }
      }
      Tracert.addToRun(function () {
        Tracert.call.apply(Tracert, argsList);
      });
    },
    addToRun: function addToRun(_fn) {
      var fn = _fn;
      if (typeof fn === "function") {
        fn._logTimer = new Date() - 0;
        Tracert._readyToRun.push(fn);
      }
    },
    createTracert: undefined,
    spmAPos: undefined,
    autoLogPv: undefined,
    autoExpo: undefined,
    bizType: undefined,
    ifRouterNeedPv: undefined,
    enableMicroAppInstance: undefined,
    v: undefined
  };
  var fnlist = [
    "config",
    "logPv",
    "info",
    "error",
    "click",
    "expo",
    "pageName",
    "pageState",
    "time",
    "timeEnd",
    "parse",
    "expoCheck",
    "stringify",
    "report",
    "set",
    "before"
  ];
  for (var i = 0; i < fnlist.length; i++) {
    var fn = fnlist[i];
    (function (fn) {
      Tracert[fn] = function () {
        var args = arguments;
        var argsList;
        try {
          argsList = [].slice.call(args, 0);
        } catch (ex) {
          var argsLen = args.length;
          argsList = [];
          for (var _i2 = 0; _i2 < argsLen; _i2++) {
            argsList.push(args[_i2]);
          }
        }
        argsList.unshift(fn);
        Tracert.addToRun(function () {
          Tracert.call.apply(Tracert, argsList);
        });
      };
    })(fn);
  }
  if (window.Proxy) {
    var handler = {
      get: function get(target, property) {
        var _targetVMhasOwnPropert;
        if (
          target !== null &&
          target !== void 0 &&
          (_targetVMhasOwnPropert = target.hasOwnProperty) !== null &&
          _targetVMhasOwnPropert !== void 0 &&
          _targetVMhasOwnPropert.call(target, property)
        ) {
          return target[property];
        }
        return target.call.bind(this, property);
      }
    };
    var proxyTracert = new window.Proxy(Tracert, handler);
    window.Tracert = proxyTracert;
  } else {
    window.Tracert = Tracert;
  }
})();
