export declare type Pixels = Uint8Array;
export declare type GrayPixels = Pixels;
export declare type CallbackFrame = (videoEl: HTMLVideoElement, dt: number) => any;
export declare type PicoDetections = [number, number, number?, number?];
export declare interface ILoaded {
    faceFinder: boolean;
    pupilFinder: boolean;
}
export declare interface IPicoSizeImage {
    nrows: number;
    ncols: number;
    ldim: number;
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
export declare type CallbackClassifyRegion = (row: number, column: number, scale: number, pixels: Pixels, ldim?: number) => number;
