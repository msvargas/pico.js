import {
  Pixels,
  ILoaded,
  IPicoImage,
  IPicoSizeImage,
  IPicoParams,
  PicoDetections
} from "../typings/global";
import { pico, Ipico } from "./pico";
import { lploc } from "./lploc";

export { default as Camvas } from "./camvas";

export interface IPicojs extends Ipico {
  initialized: boolean;
  loaded: ILoaded;
  load: (...args: any[]) => any;
  loadFaceFinder: (...args: any[]) => any;
  loadPupilFinder: (...args: any[]) => any;
  fetchBinary: (uri: string) => Promise<Int8Array>;
  baseUri: string;
}

/**
 * @description convert rgba image to gray scale
 * @param rgba input
 * @param nrows height
 * @param ncols width
 */
export function rgba_to_grayscale(
  rgba: Uint8ClampedArray,
  nrows: number,
  ncols: number
): Pixels {
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

export var update_memory = pico.instantiate_detection_memory(5);
export var facefinder_classify_region = function(
  row: number,
  column: number,
  scale: number,
  pixels: Pixels,
  ldim?: number
) {
  return -1.0;
};

export var do_puploc = function(
  row: number,
  col: number,
  scale: number,
  npertubs: number,
  image: IPicoImage
): PicoDetections {
  return [-1.0, -1.0, NaN, NaN];
};

export const defaultSizeImage: IPicoSizeImage = {
  nrows: 480,
  ncols: 640,
  ldim: 640
};

export const defaultParams: IPicoParams = {
  shiftfactor: 0.1,
  minsize: 100,
  maxsize: 1000,
  scalefactor: 1.1
};

const picojs: IPicojs = {
  ...pico,
  initialized: false,
  loaded: {
    faceFinder: false,
    pupilFinder: false
  },
  baseUri: "https://raw.githubusercontent.com/punisher97/pico.js/master/bin/",
  fetchBinary: (uri): Promise<Int8Array> =>
    fetch(uri)
      .then(res => res.arrayBuffer())
      .then(buffer => new Int8Array(buffer)),
  /**
   *
   * @param uri URI to load binaries finders
   */
  async load(baseUri?: string): Promise<any> {
    if (baseUri) this.baseUri = baseUri;
    return Promise.all([this.loadFaceFinder(), this.loadPupilFinder()]).then(
      () => {
        this.initialized = true;
        return;
      }
    );
  },
  /**
   * Load facefinder
   * @param uri Uri with baseUri to fetch facefinder.bin
   */
  async loadFaceFinder(uri: string = "facefinder.bin"): Promise<any> {
    return this.fetchBinary(this.baseUri + uri).then(bytes => {
      facefinder_classify_region = this.unpack_cascade(bytes);
      picojs.loaded.faceFinder = true;
    });
  },
  /**
   * Load puploc.bin
   * @param uri full uri or default uri with baseUri
   */
  async loadPupilFinder(uri: string = "puploc.bin"): Promise<any> {
    return this.fetchBinary(this.baseUri + uri).then(bytes => {
      do_puploc = lploc.unpack_localizer(bytes);
      this.loaded.pupilFinder = true;
    });
  }
};

export { lploc };
export default picojs;
