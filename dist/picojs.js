(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["picojs"] = factory();
	else
		root["picojs"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/camvas.ts":
/*!***********************!*\
  !*** ./src/camvas.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/*
    This code was taken from https://github.com/cbrandolino/camvas and modified to suit our needs
*/
/*
Copyright (c) 2012 Claudio Brandolino
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
// The function takes a canvas context and a `drawFunc` function.
// `drawFunc` receives two parameters, the video and the time since
// the last time it was called.
var Camvas = /** @class */ (function () {
    /**
     *
     * @param callback callback to update
     */
    function Camvas(callback, constraints) {
        if (constraints === void 0) { constraints = { video: true, audio: false }; }
        this.callback = callback;
        this.constraints = constraints;
        this.callback = callback;
        // We can't `new Video()` yet, so we'll resort to the vintage
        // "hidden div" hack for dynamic loading.
        var streamContainer = document.createElement("div");
        this.videoEl = document.createElement("video");
        // If we don't do this, the stream will not be played.
        // By the way, the play and pause controls work as usual
        // for streamed videos.
        this.videoEl.setAttribute("autoplay", "1");
        this.videoEl.setAttribute("playsinline", "1"); // important for iPhones
        // The video should fill out all of the canvas
        this.videoEl.setAttribute("width", "1");
        this.videoEl.setAttribute("height", "1");
        streamContainer.appendChild(this.videoEl);
        document.body.appendChild(streamContainer);
    }
    Object.defineProperty(Camvas.prototype, "started", {
        /**
         * @description check if camera canvas started
         */
        get: function () {
            return !this.videoEl.paused;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Camvas.prototype, "video", {
        /**
         * @description get video element
         */
        get: function () {
            return this.videoEl;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     * @param constraints Change MediaStreamContraints
     */
    Camvas.prototype.play = function () {
        var _this = this;
        // The callback happens when we are starting to stream the video.
        return new Promise(function (resolve, reject) {
            if (!!_this.videoEl.srcObject) {
                if (_this.videoEl.paused) {
                    return _this.videoEl
                        .play()
                        .then(function () { return _this.update(); })
                        .then(resolve);
                }
                else if (!_this.videoEl.ended && !_this._raId) {
                    _this.update();
                    resolve();
                }
                else {
                    reject(new Error("Fail to play video, it played or ended"));
                }
            }
            else {
                navigator.getUserMedia =
                    navigator.getUserMedia ||
                        navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia;
                return navigator.mediaDevices.getUserMedia(_this.constraints).then(function (stream) {
                    // Yay, now our webcam input is treated as a normal video and
                    // we can start having fun
                    _this.videoEl.srcObject = stream;
                    _this.update();
                }, function (err) {
                    if (err)
                        reject(err);
                });
            }
        });
    };
    /**
     * Stop camvas
     */
    Camvas.prototype.stop = function () {
        if (this.videoEl.srcObject) {
            this._cancelAnimation();
            // stop video to unmount
            this.videoEl.srcObject
                .getTracks()
                .forEach(function (track) { return track.stop(); });
            this.videoEl.srcObject = null;
        }
    };
    /**
     * pause camvas
     */
    Camvas.prototype.pause = function () {
        this.videoEl.pause();
        this._cancelAnimation();
    };
    Camvas.prototype._cancelAnimation = function () {
        this._raId && cancelAnimationFrame(this._raId);
        this._raId = 0;
    };
    /**
     * update frame
     */
    Camvas.prototype.update = function () {
        var _this = this;
        if (!this.callback)
            return;
        var last = Date.now();
        var loop = function () {
            if (_this.videoEl.ended)
                return;
            var dt = Date.now() - last;
            _this.callback && _this.callback(_this.videoEl, dt);
            last = Date.now();
            _this._raId = requestAnimationFrame(loop);
        };
        this._raId = requestAnimationFrame(loop);
    };
    return Camvas;
}());
exports.default = Camvas;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var pico_1 = __webpack_require__(/*! ./pico */ "./src/pico.js");
var lploc_1 = __webpack_require__(/*! ./lploc */ "./src/lploc.js");
exports.lploc = lploc_1.lploc;
var camvas_1 = __webpack_require__(/*! ./camvas */ "./src/camvas.ts");
exports.Camvas = camvas_1.default;
/**
 * @description convert rgba image to gray scale
 * @param rgba input
 * @param nrows height
 * @param ncols width
 */
function rgba_to_grayscale(rgba, nrows, ncols) {
    var gray = new Uint8Array(nrows * ncols);
    for (var r = 0; r < nrows; ++r)
        for (var c = 0; c < ncols; ++c)
            // gray = 0.2*red + 0.7*green + 0.1*blue
            gray[r * ncols + c] =
                (2 * rgba[r * 4 * ncols + 4 * c + 0] +
                    7 * rgba[r * 4 * ncols + 4 * c + 1] +
                    1 * rgba[r * 4 * ncols + 4 * c + 2]) /
                    10;
    return gray;
}
exports.rgba_to_grayscale = rgba_to_grayscale;
exports.update_memory = pico_1.pico.instantiate_detection_memory(5);
exports.facefinder_classify_region = function (row, column, scale, pixels, ldim) {
    return -1.0;
};
exports.do_puploc = function (row, col, scale, npertubs, image) {
    return [-1.0, -1.0, NaN, NaN];
};
exports.defaultSizeImage = {
    nrows: 480,
    ncols: 640,
    ldim: 640
};
exports.defaultParams = {
    shiftfactor: 0.1,
    minsize: 100,
    maxsize: 1000,
    scalefactor: 1.1
};
var picojs = __assign(__assign({}, pico_1.pico), { initialized: false, loaded: {
        faceFinder: false,
        pupilFinder: false
    }, baseUri: "https://raw.githubusercontent.com/punisher97/pico.js/master/bin/", fetchBinary: function (uri) {
        return fetch(uri)
            .then(function (res) { return res.arrayBuffer(); })
            .then(function (buffer) { return new Int8Array(buffer); });
    }, 
    /**
     *
     * @param uri URI to load binaries finders
     */
    load: function (baseUri) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (baseUri)
                    this.baseUri = baseUri;
                return [2 /*return*/, Promise.all([this.loadFaceFinder(), this.loadPupilFinder()]).then(function () {
                        _this.initialized = true;
                        return;
                    })];
            });
        });
    },
    /**
     * Load facefinder
     * @param uri Uri with baseUri to fetch facefinder.bin
     */
    loadFaceFinder: function (uri) {
        if (uri === void 0) { uri = "facefinder.bin"; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetchBinary(this.baseUri + uri).then(function (bytes) {
                        exports.facefinder_classify_region = _this.unpack_cascade(bytes);
                        picojs.loaded.faceFinder = true;
                    })];
            });
        });
    },
    /**
     * Load puploc.bin
     * @param uri full uri or default uri with baseUri
     */
    loadPupilFinder: function (uri) {
        if (uri === void 0) { uri = "puploc.bin"; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetchBinary(this.baseUri + uri).then(function (bytes) {
                        exports.do_puploc = lploc_1.lploc.unpack_localizer(bytes);
                        _this.loaded.pupilFinder = true;
                    })];
            });
        });
    } });
exports.default = picojs;


/***/ }),

/***/ "./src/lploc.js":
/*!**********************!*\
  !*** ./src/lploc.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* This library is released under the MIT license, contact @tehnokv for more details */
const lploc = {};

lploc.unpack_localizer = function(bytes) {
  //
  const dview = new DataView(new ArrayBuffer(4));
  let p = 0;
  /*
		read the number of stages, scale multiplier (applied after each stage),
		number of trees per stage and depth of each tree
	*/
  dview.setUint8(0, bytes[p + 0]),
    dview.setUint8(1, bytes[p + 1]),
    dview.setUint8(2, bytes[p + 2]),
    dview.setUint8(3, bytes[p + 3]);
  const nstages = dview.getInt32(0, true);
  p = p + 4;
  dview.setUint8(0, bytes[p + 0]),
    dview.setUint8(1, bytes[p + 1]),
    dview.setUint8(2, bytes[p + 2]),
    dview.setUint8(3, bytes[p + 3]);
  const scalemul = dview.getFloat32(0, true);
  p = p + 4;
  dview.setUint8(0, bytes[p + 0]),
    dview.setUint8(1, bytes[p + 1]),
    dview.setUint8(2, bytes[p + 2]),
    dview.setUint8(3, bytes[p + 3]);
  const ntreesperstage = dview.getInt32(0, true);
  p = p + 4;
  dview.setUint8(0, bytes[p + 0]),
    dview.setUint8(1, bytes[p + 1]),
    dview.setUint8(2, bytes[p + 2]),
    dview.setUint8(3, bytes[p + 3]);
  const tdepth = dview.getInt32(0, true);
  p = p + 4;
  /*
		unpack the trees
	*/
  const tcodes_ls = [];
  const tpreds_ls = [];
  for (let i = 0; i < nstages; ++i) {
    // read the trees for this stage
    for (let j = 0; j < ntreesperstage; ++j) {
      // binary tests (we can read all of them at once)
      Array.prototype.push.apply(
        tcodes_ls,
        bytes.slice(p, p + 4 * Math.pow(2, tdepth) - 4)
      );
      p = p + 4 * Math.pow(2, tdepth) - 4;
      // read the prediction in the leaf nodes of the tree
      for (let k = 0; k < Math.pow(2, tdepth); ++k)
        for (let l = 0; l < 2; ++l) {
          dview.setUint8(0, bytes[p + 0]),
            dview.setUint8(1, bytes[p + 1]),
            dview.setUint8(2, bytes[p + 2]),
            dview.setUint8(3, bytes[p + 3]);
          tpreds_ls.push(dview.getFloat32(0, true));
          p = p + 4;
        }
    }
  }
  const tcodes = new Int8Array(tcodes_ls);
  const tpreds = new Float32Array(tpreds_ls);
  /*
		construct the location estimaton function
	*/
  function loc_fun(r, c, s, pixels, nrows, ncols, ldim) {
    let root = 0;
    const pow2tdepth = Math.pow(2, tdepth) >> 0; // '>>0' transforms this number to int

    for (let i = 0; i < nstages; ++i) {
      let dr = 0.0,
        dc = 0.0;

      for (let j = 0; j < ntreesperstage; ++j) {
        let idx = 0;
        for (var k = 0; k < tdepth; ++k) {
          const r1 = Math.min(
            nrows - 1,
            Math.max(0, (256 * r + tcodes[root + 4 * idx + 0] * s) >> 8)
          );
          const c1 = Math.min(
            ncols - 1,
            Math.max(0, (256 * c + tcodes[root + 4 * idx + 1] * s) >> 8)
          );
          const r2 = Math.min(
            nrows - 1,
            Math.max(0, (256 * r + tcodes[root + 4 * idx + 2] * s) >> 8)
          );
          const c2 = Math.min(
            ncols - 1,
            Math.max(0, (256 * c + tcodes[root + 4 * idx + 3] * s) >> 8)
          );

          idx = 2 * idx + 1 + (pixels[r1 * ldim + c1] > pixels[r2 * ldim + c2]);
        }

        const lutidx =
          2 *
          (ntreesperstage * pow2tdepth * i +
            pow2tdepth * j +
            idx -
            (pow2tdepth - 1));
        dr += tpreds[lutidx + 0];
        dc += tpreds[lutidx + 1];

        root += 4 * pow2tdepth - 4;
      }

      r = r + dr * s;
      c = c + dc * s;

      s = s * scalemul;
    }

    return [r, c];
  }
  /*
		this function applies random perturbations to the default rectangle (r, c, s)
	*/
  function loc_fun_with_perturbs(r, c, s, nperturbs, image) {
    const rows = [],
      cols = [];

    for (let i = 0; i < nperturbs; ++i) {
      const _s = s * (0.925 + 0.15 * Math.random());
      let _r = r + s * 0.15 * (0.5 - Math.random());
      let _c = c + s * 0.15 * (0.5 - Math.random());

      [_r, _c] = loc_fun(
        _r,
        _c,
        _s,
        image.pixels,
        image.nrows,
        image.ncols,
        image.ldim
      );

      rows.push(_r);
      cols.push(_c);
    }

    // return the median along each axis
    rows.sort();
    cols.sort();

    return [rows[Math.round(nperturbs / 2)], cols[Math.round(nperturbs / 2)]];
  }
  /*
		we're done
	*/
  return loc_fun_with_perturbs;
};

exports.lploc = lploc;


/***/ }),

/***/ "./src/pico.js":
/*!*********************!*\
  !*** ./src/pico.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* This library is released under the MIT license, see https://github.com/tehnokv/picojs */
var pico = {}

pico.unpack_cascade = function(bytes)
{
	//
	const dview = new DataView(new ArrayBuffer(4));
	/*
		we skip the first 8 bytes of the cascade file
		(cascade version number and some data used during the learning process)
	*/
	let p = 8;
	/*
		read the depth (size) of each tree first: a 32-bit signed integer
	*/
	dview.setUint8(0, bytes[p+0]), dview.setUint8(1, bytes[p+1]), dview.setUint8(2, bytes[p+2]), dview.setUint8(3, bytes[p+3]);
	const tdepth = dview.getInt32(0, true);
	p = p + 4
	/*
		next, read the number of trees in the cascade: another 32-bit signed integer
	*/
	dview.setUint8(0, bytes[p+0]), dview.setUint8(1, bytes[p+1]), dview.setUint8(2, bytes[p+2]), dview.setUint8(3, bytes[p+3]);
	const ntrees = dview.getInt32(0, true);
	p = p + 4
	/*
		read the actual trees and cascade thresholds
	*/
	const tcodes_ls = [];
	const tpreds_ls = [];
	const thresh_ls = [];
	for(let t=0; t<ntrees; ++t)
	{
		// read the binary tests placed in internal tree nodes
		Array.prototype.push.apply(tcodes_ls, [0, 0, 0, 0]);
		Array.prototype.push.apply(tcodes_ls, bytes.slice(p, p+4*Math.pow(2, tdepth)-4));
		p = p + 4*Math.pow(2, tdepth)-4;
		// read the prediction in the leaf nodes of the tree
		for(let i=0; i<Math.pow(2, tdepth); ++i)
		{
			dview.setUint8(0, bytes[p+0]), dview.setUint8(1, bytes[p+1]), dview.setUint8(2, bytes[p+2]), dview.setUint8(3, bytes[p+3]);
			tpreds_ls.push(dview.getFloat32(0, true));
			p = p + 4;
		}
		// read the threshold
		dview.setUint8(0, bytes[p+0]), dview.setUint8(1, bytes[p+1]), dview.setUint8(2, bytes[p+2]), dview.setUint8(3, bytes[p+3]);
		thresh_ls.push(dview.getFloat32(0, true));
		p = p + 4;
	}
	const tcodes = new Int8Array(tcodes_ls);
	const tpreds = new Float32Array(tpreds_ls);
	const thresh = new Float32Array(thresh_ls);
	/*
		construct the classification function from the read data
	*/
	function classify_region(r, c, s, pixels, ldim)
	{
		 r = 256*r;
		 c = 256*c;
		 let root = 0;
		 let o = 0.0;
		 const pow2tdepth = Math.pow(2, tdepth) >> 0; // '>>0' transforms this number to int

		 for(let i=0; i<ntrees; ++i)
		 {
			idx = 1;
			for(let j=0; j<tdepth; ++j)
				// we use '>> 8' here to perform an integer division: this seems important for performance
				idx = 2*idx + (pixels[((r+tcodes[root + 4*idx + 0]*s) >> 8)*ldim+((c+tcodes[root + 4*idx + 1]*s) >> 8)]<=pixels[((r+tcodes[root + 4*idx + 2]*s) >> 8)*ldim+((c+tcodes[root + 4*idx + 3]*s) >> 8)]);

			 o = o + tpreds[pow2tdepth*i + idx-pow2tdepth];

			 if(o<=thresh[i])
				 return -1;

			 root += 4*pow2tdepth;
		}
		return o - thresh[ntrees-1];
	}
	/*
		we're done
	*/
	return classify_region;
}

pico.run_cascade = function(image, classify_region, params)
{
	const pixels = image.pixels;
	const nrows = image.nrows;
	const ncols = image.ncols;
	const ldim = image.ldim;

	const shiftfactor = params.shiftfactor;
	const minsize = params.minsize;
	const maxsize = params.maxsize;
	const scalefactor = params.scalefactor;

	let scale = minsize;
	const detections = [];

	while(scale<=maxsize)
	{
		const step = Math.max(shiftfactor*scale, 1) >> 0; // '>>0' transforms this number to int
		const offset = (scale/2 + 1) >> 0;

		for(let r=offset; r<=nrows-offset; r+=step)
			for(let c=offset; c<=ncols-offset; c+=step)
			{
				const q = classify_region(r, c, scale, pixels, ldim);
				if (q > 0.0)
					detections.push([r, c, scale, q]);
			}
		
		scale = scale*scalefactor;
	}

    return detections;
}

pico.cluster_detections = function(dets, iouthreshold)
{
	/*
		sort detections by their score
	*/
	dets = dets.sort(function(a, b) {
		return b[3] - a[3];
	});
	/*
		this helper function calculates the intersection over union for two detections
	*/
	function calculate_iou(det1, det2)
	{
		// unpack the position and size of each detection
		const r1=det1[0], c1=det1[1], s1=det1[2];
		const r2=det2[0], c2=det2[1], s2=det2[2];
		// calculate detection overlap in each dimension
		const overr = Math.max(0, Math.min(r1+s1/2, r2+s2/2) - Math.max(r1-s1/2, r2-s2/2));
		const overc = Math.max(0, Math.min(c1+s1/2, c2+s2/2) - Math.max(c1-s1/2, c2-s2/2));
		// calculate and return IoU
		return overr*overc/(s1*s1+s2*s2-overr*overc);
	}
	/*
		do clustering through non-maximum suppression
	*/
	const assignments = new Array(dets.length).fill(0);
	const clusters = [];
	for(let i=0; i<dets.length; ++i)
	{
		// is this detection assigned to a cluster?
		if(assignments[i]==0)
		{
			// it is not:
			// now we make a cluster out of it and see whether some other detections belong to it
			let r=0.0, c=0.0, s=0.0, q=0.0, n=0;
			for(let j=i; j<dets.length; ++j)
				if(calculate_iou(dets[i], dets[j])>iouthreshold)
				{
					assignments[j] = 1;
					r = r + dets[j][0];
					c = c + dets[j][1];
					s = s + dets[j][2];
					q = q + dets[j][3];
					n = n + 1;
				}
			// make a cluster representative
			clusters.push([r/n, c/n, s/n, q]);
		}
	}

	return clusters;
}

pico.instantiate_detection_memory = function(size)
{
	/*
		initialize a circular buffer of `size` elements
	*/
	let n = 0;
	const memory = [];
	for(let i=0; i<size; ++i)
		memory.push([]);
	/*
		build a function that:
		(1) inserts the current frame's detections into the buffer;
		(2) merges all detections from the last `size` frames and returns them
	*/
	function update_memory(dets)
	{
		memory[n] = dets;
		n = (n+1)%memory.length;
		dets = [];
		for(i=0; i<memory.length; ++i)
			dets = dets.concat(memory[i]);
		//
		return dets;
	}
	/*
		we're done
	*/
	return update_memory;
}

exports.pico = pico

/***/ })

/******/ });
});