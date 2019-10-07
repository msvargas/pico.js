import { Pixels, ILoaded, IPicoImage, IPicoSizeImage, IPicoParams } from "../typings/global";
import { Ipico } from "./pico";
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
export declare function rgba_to_grayscale(rgba: Uint8ClampedArray, nrows: number, ncols: number): Pixels;
export declare var update_memory: (dets: [number, number, (number | undefined)?, (number | undefined)?]) => [number, number, (number | undefined)?, (number | undefined)?];
export declare var facefinder_classify_region: (row: number, column: number, scale: number, pixels: Uint8Array, ldim?: number | undefined) => number;
export declare var do_puploc: (row: number, col: number, scale: number, npertubs: number, image: IPicoImage) => [number, number, (number | undefined)?, (number | undefined)?];
export declare const defaultSizeImage: IPicoSizeImage;
export declare const defaultParams: IPicoParams;
declare const picojs: IPicojs;
export { lploc };
export default picojs;
