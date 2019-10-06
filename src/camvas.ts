import { CallbackFrame } from "global";

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
export default class Camvas {
  public videoEl: HTMLVideoElement;
  private _raId: number = 0;
  /**
   *
   * @param callback callback to update
   */
  constructor(public callback?: CallbackFrame) {
    navigator.getUserMedia =
      navigator.getUserMedia ||
      (navigator as any).webkitGetUserMedia ||
      (navigator as any).mozGetUserMedia;
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
  /**
   * @description check if camera canvas started
   */
  get started(): boolean {
    return !this.videoEl.paused;
  }
  /**
   * @description get video element
   */
  get video(): HTMLVideoElement {
    return this.videoEl;
  }
  /**
   *
   * @param constraints Change MediaStreamContraints
   */
  play(constraints: MediaStreamConstraints = { video: true, audio: false }) {
    // The callback happens when we are starting to stream the video.
    return new Promise((resolve, reject) => {
      if (!!this.videoEl.srcObject) {
        this.videoEl.paused
          ? this.videoEl
              .play()
              .then(() => this.update())
              .then(resolve)
          : resolve();
      } else {
        navigator.mediaDevices.getUserMedia(constraints).then(stream => {
          // Yay, now our webcam input is treated as a normal video and
          // we can start having fun
          this.videoEl.srcObject = stream;
          /* const oncanplay = () => {
              this.videoEl.removeEventListener("canplay", oncanplay);
              this.update();
              resolve(stream);
            };
            this.videoEl.oncanplay = oncanplay; */
          this.update();
          resolve(stream);
        }, reject);
      }
    });
  }
  /**
   * Stop camvas
   */
  stop() {
    if (this.videoEl && this.videoEl.srcObject) {
      this.pause();
      // stop video to unmount
      (<MediaStream>this.videoEl.srcObject)
        .getTracks()
        .forEach(track => track.stop());
      this.videoEl.srcObject = null;
    }
  }
  /**
   * pause camvas
   */
  pause() {
    this.videoEl.pause();
  }

  /**
   * update frame
   */
  private update() {
    if (!this.callback) return;
    var last = Date.now();
    var loop = () => {
      if (this.videoEl.paused || this.videoEl.ended || !this.callback) {
        this._raId && cancelAnimationFrame(this._raId);
        this._raId = 0;
        return;
      }
      // For some effects, you might want to know how much time is passed
      // since the last frame; that's why we pass along a Delta time `dt`
      // variable (expressed in milliseconds)
      var dt = Date.now() - last;
      this.callback(this.videoEl, dt);
      last = Date.now();
      this._raId = requestAnimationFrame(loop);
    };
    this._raId = requestAnimationFrame(loop);
  }
}
