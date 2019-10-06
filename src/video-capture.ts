import Camvas from "./camvas";
import { defaultSizeImage } from "./default-options";
import { CallbackFrame, Width, Height } from "global";

export declare interface IResolution {
  width: Width;
  height: Height;
}

export default class VideoCapture extends Camvas implements IResolution {
  width: Width = defaultSizeImage.ncols;
  height: Height = defaultSizeImage.nrows;
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null;
  callback: CallbackFrame = (videoEl: HTMLVideoElement, dt: number) => {};
  constructor(
    public canvas: HTMLCanvasElement | OffscreenCanvas,
    public src?: string | MediaStreamConstraints
  ) {
    super();
    this.ctx = canvas.getContext("2d");
    if (!this.ctx) throw new Error("Fail to get canvas context");
    if (src && typeof src !== "string") {
      if (src.video) {
        try {
          this.width = (src.video as any).width;
          this.height = (src.video as any).height;
        } catch {}
      }
      this.play(src);
    }
  }
}
