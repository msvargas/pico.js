import { IPicoSizeImage, IPicoParams } from "../typings/global";

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
