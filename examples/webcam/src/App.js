import React, { useEffect, useRef } from "react";
import "./App.css";
import pico, {
  rgba_to_grayscale,
  update_memory,
  do_puploc,
  facefinder_classify_region,
  defaultParams,
  defaultSizeImage,
  Camvas
} from "@msvargas97/pico.js";

function App() {
  const shapeRef = useRef();
  const withPupilsRef = useRef();
  const camvas = useRef(null);

  useEffect(() => {
    async function init() {
      if (!pico.initialized) {
        await pico.load();
        console.log("pico loaded succesfull!");
      }
    }
    init();
    let i;
    const ctx = document.getElementsByTagName("canvas")[0].getContext("2d");
    const image = defaultSizeImage;
    const processfn = function(video, dt) {
      // render the video frame to the canvas element and extract RGBA pixel data
      ctx.drawImage(video, 0, 0);
      const rgba = ctx.getImageData(0, 0, 640, 480).data;
      // prepare input to `run_cascade`
      image.pixels = rgba_to_grayscale(rgba, 480, 640);
      // run the cascade over the frame and cluster the obtained detections
      // dets is an array that contains (r, c, s, q) quadruplets
      // (representing row, column, scale and detection score)
      let dets = pico.run_cascade(
        image,
        facefinder_classify_region,
        defaultParams
      );
      dets = update_memory(dets);
      dets = pico.cluster_detections(dets, 0.3); // set IoU threshold to 0.2
      // draw detections
      for (i = 0; i < dets.length; ++i)
        // check the detection score
        // if it's above the threshold, draw it
        // (the constant 50.0 is empirical: other cascades might require a different one)
        if (dets[i][3] > 50.0) {
          var r, c, s;
          const middleSize = dets[i][2] * 0.5;
          ctx.beginPath();
          if (shapeRef.current.value === "circle") {
            ctx.arc(dets[i][1], dets[i][0], middleSize, 0, 2 * Math.PI, false);
          } else {
            ctx.rect(
              dets[i][1] - middleSize,
              dets[i][0] - middleSize,
              dets[i][2],
              dets[i][2]
            );
          }
          ctx.lineWidth = 4;
          ctx.strokeStyle = "royalblue";
          ctx.stroke();
          if (!withPupilsRef.current.checked) continue;
          //
          // find the eye pupils for each detected face
          // starting regions for localization are initialized based on the face bounding box
          // (parameters are set empirically)
          // first eye
          r = dets[i][0] - 0.075 * dets[i][2];
          c = dets[i][1] - 0.175 * dets[i][2];
          s = 0.35 * dets[i][2];
          [r, c] = do_puploc(r, c, s, 127, image);
          if (r >= 0 && c >= 0) {
            ctx.beginPath();
            ctx.arc(c, r, 2, 0, 2 * Math.PI, false);
            ctx.lineWidth = 3;
            ctx.strokeStyle = "limegreen";
            ctx.stroke();
          }
          // second eye
          r = dets[i][0] - 0.075 * dets[i][2];
          c = dets[i][1] + 0.175 * dets[i][2];
          s = 0.35 * dets[i][2];
          [r, c] = do_puploc(r, c, s, 127, image);
          if (r >= 0 && c >= 0) {
            ctx.beginPath();
            ctx.arc(c, r, 2, 0, 2 * Math.PI, false);
            ctx.lineWidth = 3;
            ctx.strokeStyle = "limegreen";
            ctx.stroke();
          }
        }
    };
    camvas.current = new Camvas(processfn); //camera canvas
    const listener = e => {
      console.log(
        `${new Date().toLocaleString()} Camera canvas ${e.type} event...`
      );
    };
    camvas.current.video.addEventListener("play", listener);
    camvas.current.video.addEventListener("pause", listener);

    return () => {
      camvas.current.video.removeEventListener("play", listener);
      camvas.current.video.removeEventListener("pause", listener);
      camvas.current = null;
    };
  }, []);

  const onPlay = () => camvas.current.play();
  const onPause = () => camvas.current.pause();
  const onStop = () => camvas.current.stop();

  return (
    <div className="App">
      <hr />
      <section>
        <h3>
          Using pico.js and lploc.js for real-time localization of eye pupils
        </h3>
        <p>Click the button below and allow the page to access your webcam.</p>
        <p>
          <b>
            All the processing is done on the client side, i.e., without sending
            images to a server.
          </b>
        </p>
        <p>
          Original example: More information about the algotihm is available{" "}
          <a href="https://tehnokv.com/posts/puploc-with-trees/demo/">here</a>.
        </p>
      </section>
      <hr />
      <div>
        <center>
          <label>
            <input type="checkbox" ref={withPupilsRef} defaultChecked />
            with pupils
          </label>
          <select name="shape" ref={shapeRef}>
            <option value="shape">Square</option>
            <option value="circle">Circle</option>
          </select>
        </center>
      </div>
      <div>
        <center>
          <input type="button" value={`Start`} onClick={onPlay} />
          <span>{"  "}</span>
          <input type="button" value={`Pause`} onClick={onPause} />
          <span>{"  "}</span>
          <input type="button" value={`Stop`} onClick={onStop} />
        </center>
      </div>
      <div>
        <center>
          <canvas width="640" height="480"></canvas>
        </center>
      </div>
    </div>
  );
}

export default App;
