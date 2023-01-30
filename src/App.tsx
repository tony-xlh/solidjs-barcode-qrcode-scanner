import { TextResult } from 'dynamsoft-javascript-barcode/dist/types/interface/textresult';
import { Component, createSignal, For, Show } from 'solid-js';

import styles from './App.module.css';
import Scanner from './components/Scanner';

const App: Component = () => {
  const [active,setActive] = createSignal(false);
  const [initialized,setInitialized] = createSignal(false);
  const [barcodeResults,setBarcodeResults] = createSignal([] as TextResult[]);
  const startScan = () => {
    console.log("start scan");
    setActive(true);
  }

  const stopScan = () => {
    console.log("stop scan");
    setActive(false);
  }

  const onScanned = (results:TextResult[]) => {
    console.log(results);
    setActive(false);
    setBarcodeResults(results);
  }

  return (
    <div class={styles.App}>
      <h1>Solidjs Barcode Scanner Demo</h1>
      <Show when={initialized()} fallback={<div>Initializing...</div>}>
        <button onClick={startScan}>Start Scanning</button>
      </Show>
      <Scanner 
        active={active()}  
        onScanned={(results)=> {onScanned(results)}}
        initialized={()=> {setInitialized(true)}} 
      >
        <button class={styles.CloseButton} onClick={stopScan}>Close</button>
      </Scanner>
      <For each={barcodeResults()}>
        {(result) => <div>{result.barcodeFormatString+": "+result.barcodeText}</div>}
      </For>
    </div>
  );
};

export default App;
