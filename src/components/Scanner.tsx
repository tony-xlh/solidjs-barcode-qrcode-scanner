import { CameraEnhancer } from 'dynamsoft-camera-enhancer';
import { BarcodeReader } from 'dynamsoft-javascript-barcode';
import { TextResult } from 'dynamsoft-javascript-barcode/dist/types/interface/textresult';
import { children, Component, createEffect, createSignal, JSX, onMount } from 'solid-js';
import './styles.css';

BarcodeReader.engineResourcePath = "https://cdn.jsdelivr.net/npm/dynamsoft-javascript-barcode@9.6.2/dist/";

export interface ScannerProps {
  initialized?: () => void;
  onScanned?: (results:TextResult[]) => void;
  active:boolean;
  children?: JSX.Element;
}

const Scanner: Component<ScannerProps> = (props:ScannerProps) => {
  let camera:CameraEnhancer;
  let reader:BarcodeReader;
  let cameraContainer:HTMLDivElement|undefined;
  let interval:any;
  let decoding = false;
  onMount(async () => {
    if (!camera) {
      BarcodeReader.license = "DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTE2NDk4Mjk3OTI2MzUiLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSIsInNlc3Npb25QYXNzd29yZCI6IndTcGR6Vm05WDJrcEQ5YUoifQ=="; // trial license
      camera = await CameraEnhancer.createInstance();
      if (cameraContainer) {
        console.log(cameraContainer);
        await camera.setUIElement(cameraContainer);
      }
      reader = await BarcodeReader.createInstance();
    }
    if (props.initialized) {
      props.initialized();
    }
  });

  
  createEffect(() => {
    const {active} = props; //deconstruct, see: https://github.com/solidjs/solid/discussions/749
    if (camera) {
      if (active === true) {
        camera.open(true);
        startDecoding();
      }else{
        stopDecoding();
        camera.close(true);
      }
    }
  });

  const startDecoding = () => {
    if (interval) {
      clearInterval(interval);
    }
    decoding = false;
    interval = setInterval(captureAndDecode,100); //set an interval to read barcodes from camera video frames.
  }

  const stopDecoding = () => {
    if (interval) {
      clearInterval(interval);
    }
    decoding = false;
  }
   
  const captureAndDecode = async () => {
    if (!camera || !reader) {
      return
    }
    if (camera.isOpen() === false) {
      return;
    }
    if (decoding == true) {
      return;
    }
    let frame = camera.getFrame();
    if (frame) {
      decoding = true; // set decoding to true so that the next frame will be skipped if the decoding has not completed.
      let results = await reader.decode(frame);
      if (results.length>0) {
        stopDecoding();
        if (props.onScanned) {
          props.onScanned(results);
        }
      }
      decoding = false;
    }
  };

  return (
    <div ref={cameraContainer} class="container" style="display:none;">
      <svg class="dce-bg-loading" viewBox="0 0 1792 1792"><path d="M1760 896q0 176-68.5 336t-184 275.5-275.5 184-336 68.5-336-68.5-275.5-184-184-275.5-68.5-336q0-213 97-398.5t265-305.5 374-151v228q-221 45-366.5 221t-145.5 406q0 130 51 248.5t136.5 204 204 136.5 248.5 51 248.5-51 204-136.5 136.5-204 51-248.5q0-230-145.5-406t-366.5-221v-228q206 31 374 151t265 305.5 97 398.5z"/></svg>
      <svg class="dce-bg-camera" viewBox="0 0 2048 1792"><path d="M1024 672q119 0 203.5 84.5t84.5 203.5-84.5 203.5-203.5 84.5-203.5-84.5-84.5-203.5 84.5-203.5 203.5-84.5zm704-416q106 0 181 75t75 181v896q0 106-75 181t-181 75h-1408q-106 0-181-75t-75-181v-896q0-106 75-181t181-75h224l51-136q19-49 69.5-84.5t103.5-35.5h512q53 0 103.5 35.5t69.5 84.5l51 136h224zm-704 1152q185 0 316.5-131.5t131.5-316.5-131.5-316.5-316.5-131.5-316.5 131.5-131.5 316.5 131.5 316.5 316.5 131.5z"/></svg>
      <div class="dce-video-container"></div>
      <div class="dce-scanarea">
        <div class="dce-scanlight"></div>
      </div>
      <div class="sel-container">
        <select class="dce-sel-camera"></select>
        <select class="dce-sel-resolution"></select>
      </div>
      {props.children}
    </div>
  );
};

export default Scanner;
