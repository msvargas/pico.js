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
var pico_1 = require("./pico");
var lploc_1 = require("./lploc");
exports.lploc = lploc_1.lploc;
var camvas_1 = require("./camvas");
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
//# sourceMappingURL=index.js.map