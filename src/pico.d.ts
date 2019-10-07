import {
  IPicoImage,
  IPicoParams,
  PicoDetections,
  CallbackClassifyRegion
} from "global";

//https://stackoverflow.com/questions/53074172/typescript-declaration-files-for-local-js-files

export declare interface Ipico {
  unpack_cascade(bytes: Int8Array): CallbackClassifyRegion;
  run_cascade(
    image: IPicoImage,
    classify_region: CallbackClassifyRegion,
    params: IPicoParams
  ): PicoDetections;
  cluster_detections(
    dets: PicoDetections,
    iouthreshold: number
  ): PicoDetections;
  instantiate_detection_memory(
    size: number
  ): (dets: PicoDetections) => PicoDetections;
}

export declare var pico: Ipico;
