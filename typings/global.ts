export type Pixels = Uint8Array;
export type GrayPixels = Pixels;

export type CallbackFrame = (videoEl: HTMLVideoElement, dt: number) => any;

export type PicoDetections = [number, number, number?, number?];
export declare interface ILoaded {
  faceFinder: boolean;
  pupilFinder: boolean;
}

export declare interface IPicoSizeImage {
  nrows: number; // @example: 480
  ncols: number; // @example : 640
  ldim: number; // @example: 640
}

export declare interface IPicoImage extends IPicoSizeImage {
  pixels: GrayPixels;
}

/**
 * @param shiftfactor move the detection window by 10% of its size
 * @param minsize minimum size of a face
 * @param maxsize maximum size of a face
 * @param scalefactor for multiscale processing: resize the detection window by 10% when moving to the higher scale
 */
export declare interface IPicoParams {
  shiftfactor: number;
  minsize: number;
  maxsize: number;
  scalefactor: number;
}


export declare type CallbackClassifyRegion = (
  row: number,
  column: number,
  scale: number,
  pixels: Pixels,
  ldim?: number
) => number;

