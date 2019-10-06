export type Pixels = Uint8Array;
export type GrayPixels = Pixels;
export type Width = number;
export type Height = number;
export type Column = number;
export type Row = number;
export type Score = number;
export type Scale = number;
export type PicoResult = [Row, Column, Scale, Score];
export type PupilPosition = PicoResult;

export type PicoDetections = Array<PicoResult>;
export type CallbackFrame = (videoEl: HTMLVideoElement, dt: number) => any;

export declare interface ILoaded {
  faceFinder: boolean;
  pupilFinder: boolean;
}

export declare interface IPicoSizeImage {
  nrows: Height; // @example: 480
  ncols: Width; // @example : 640
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

export declare interface IFaceDetection {
  x: Column;
  y: Row;
  scale?: Scale;
  score?: Score;
}

export declare interface IPupilDetection {
  x: Column;
  y: Row;
}

export declare interface IDetectionResult {
  faces?: Array<IFaceDetection>;
  pupils?: Array<IPupilDetection[]>;
}
