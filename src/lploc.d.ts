import { IPicoImage, PicoDetections } from "../typings/global";

export declare interface Ilploc {
  unpack_localizer(
    bytes: Int8Array
  ): (
    row: number,
    col: number,
    scale: number,
    npertubs: number,
    image: IPicoImage
  ) => PicoDetections;
}

export declare var lploc: Ilploc;
 