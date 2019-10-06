import {
  Pixels,
  ILoaded,
  PupilPosition,
  IPicoImage,
  Height,
  Width,
  IPicoParams,
  IFaceDetection,
  IPupilDetection,
  IDetectionResult
} from "global";
import { defaultParams, defaultSizeImage } from "./default-options";
import { pico } from "./pico";
import { lploc } from "./lploc";

export var loaded: ILoaded = {
  faceFinder: false,
  pupilFinder: false
};
/**
 *
 * @param uri URI to load binaries finders
 */
export var fetchBinary: (uri: string) => Promise<Int8Array> = uri =>
  fetch(uri)
    .then(res => res.arrayBuffer())
    .then(buffer => new Int8Array(buffer));

export var _baseUri: string =
  "https://raw.githubusercontent.com/punisher97/pico.js/master/bin/";

/**
 * @description convert rgba image to gray scale
 * @param rgba input
 * @param nrows height
 * @param ncols width
 */
export function rgba_to_grayscale(
  rgba: Uint8ClampedArray,
  nrows: Height,
  ncols: Width
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
  row: Height,
  column: Width,
  scale: number,
  pixels: Pixels,
  ldim?: number
) {
  return -1.0;
};

export var do_puploc = function(
  row: Height,
  col: Width,
  scale: number,
  npertubs: number,
  image: IPicoImage
): PupilPosition {
  return [-1.0, -1.0, NaN, NaN];
};
/**
 * Load facefinder
 * @param uri Uri with baseUri to fetch facefinder.bin
 */
export function loadFaceFinder(uri: string = "facefinder.bin"): Promise<any> {
  return fetchBinary(_baseUri + uri).then(bytes => {
    facefinder_classify_region = pico.unpack_cascade(bytes);
    loaded.faceFinder = true;
  });
}
/**
 * Load puploc.bin
 * @param uri full uri or default uri with baseUri
 */
export function loadPupilFinder(uri: string = "puploc.bin"): Promise<any> {
  return fetchBinary(_baseUri + uri).then(bytes => {
    do_puploc = lploc.unpack_localizer(bytes);
    loaded.pupilFinder = true;
  });
}

export function load(baseUri?: string): Promise<any> {
  if (baseUri) _baseUri = baseUri;
  return Promise.all([loadFaceFinder(), loadPupilFinder()]);
}

export class PicoImage implements IPicoImage {
  constructor(
    public pixels: Pixels,
    public nrows: Height,
    public ncols: Width,
    public ldim: number
  ) {}
}

export enum ShapeValues {
  Circle,
  Square
}

export interface IFacePupilOptions {
  params: IPicoParams;
  withPupils: boolean;
  threshold: number;
  iouthreshold: number;
  shape: ShapeValues;
  ctx?: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  shapeColor: string;
  pupilColor: string;
}

export class FacePupilOptions implements IFacePupilOptions {
  constructor(
    public params: IPicoParams = defaultParams,
    public withPupils: boolean = true,
    public threshold: number = 50.0,
    public iouthreshold: number = 0.2,
    public shape: ShapeValues = ShapeValues.Circle,
    public ctx?: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
    public shapeColor: string = "darkblue",
    public pupilColor: string = "red"
  ) {}
}

export const defaultOptions = new FacePupilOptions();
/**
 * @description detect face
 */
export function detect(
  image: Pixels | PicoImage | IPicoImage,
  options?: FacePupilOptions | IFacePupilOptions
) {
  if (image instanceof Uint8Array) {
    image = Object.assign(<IPicoImage>{ pixels: image }, defaultSizeImage);
  }
  options = Object.assign({} as IFacePupilOptions, defaultOptions, options);
  const ctx = options.ctx;
  // run the cascade over the frame and cluster the obtained detections
  // dets is an array that contains (r, c, s, q) quadruplets
  // (representing row, column, scale and detection score)
  let dets = pico.run_cascade(
    image,
    facefinder_classify_region,
    options.params
  );
  dets = update_memory(dets);
  dets = pico.cluster_detections(dets, options.iouthreshold); // set IoU threshold to 0.2

  const result: IDetectionResult = {
    faces: new Array(dets.length)
  };
  if (options.withPupils) result.pupils = new Array(dets.length);
  for (let i = 0; i < dets.length; ++i)
    // check the detection score
    // if it's above the threshold, draw it
    // (the constant 50.0 is empirical: other cascades might require a different one)
    if (dets[i][3] > options.threshold) {
      if (result.faces)
        result.faces[i] = {
          x: dets[i][1],
          y: dets[i][0],
          scale: dets[i][2],
          score: dets[i][3]
        };
      var r, c, s;
      if (ctx) {
        ctx.beginPath();
        if (options.shape == ShapeValues.Square) {
          ctx.rect(dets[i][1], dets[i][0], dets[i][2], dets[i][2]);
        } else {
          ctx.arc(
            dets[i][1],
            dets[i][0],
            dets[i][2] / 2,
            0,
            2 * Math.PI,
            false
          );
        }
        ctx.lineWidth = 3;
        ctx.strokeStyle = options.shapeColor;
        ctx.stroke();
      }
      if (options.withPupils) {
        const pupils: IPupilDetection[] = new Array(2);
        //
        // find the eye pupils for each detected face
        // starting regions for localization are initialized based on the face bounding box
        // (parameters are set empirically)
        // first eye
        r = dets[i][0] - 0.075 * dets[i][2];
        c = dets[i][1] - 0.175 * dets[i][2];
        s = 0.35 * dets[i][2];
        [r, c] = do_puploc(r, c, s, 63, image);
        if (r >= 0 && c >= 0) {
          if (ctx) {
            ctx.beginPath();
            ctx.arc(c, r, 1, 0, 2 * Math.PI, false);
            ctx.lineWidth = 2;
            ctx.strokeStyle = options.pupilColor;
            ctx.stroke();
          }
          pupils[0] = { x: c, y: r };
        }
        // second eye
        r = dets[i][0] - 0.075 * dets[i][2];
        c = dets[i][1] + 0.175 * dets[i][2];
        s = 0.35 * dets[i][2];
        [r, c] = do_puploc(r, c, s, 63, image);
        if (r >= 0 && c >= 0) {
          if (ctx) {
            ctx.beginPath();
            ctx.arc(c, r, 1, 0, 2 * Math.PI, false);
            ctx.lineWidth = 2;
            ctx.strokeStyle = options.pupilColor;
            ctx.stroke();
          }
          pupils[1] = { x: c, y: r };
        }
        if (result.pupils) result.pupils[i] = pupils;
      }
    }
  return result;
}

export { pico };
export { lploc };
