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
//# sourceMappingURL=camvas.js.map