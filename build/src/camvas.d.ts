import { CallbackFrame } from "../typings/global";
export default class Camvas {
    callback?: CallbackFrame | undefined;
    constraints: MediaStreamConstraints;
    videoEl: HTMLVideoElement;
    private _raId?;
    /**
     *
     * @param callback callback to update
     */
    constructor(callback?: CallbackFrame | undefined, constraints?: MediaStreamConstraints);
    /**
     * @description check if camera canvas started
     */
    readonly started: boolean;
    /**
     * @description get video element
     */
    readonly video: HTMLVideoElement;
    /**
     *
     * @param constraints Change MediaStreamContraints
     */
    play(): Promise<unknown>;
    /**
     * Stop camvas
     */
    stop(): void;
    /**
     * pause camvas
     */
    pause(): void;
    private _cancelAnimation;
    /**
     * update frame
     */
    update(): void;
}
