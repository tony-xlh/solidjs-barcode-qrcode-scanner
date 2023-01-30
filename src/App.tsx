import { Component, createSignal } from 'solid-js';

import styles from './App.module.css';
import Scanner from './components/Scanner';

const App: Component = () => {
  const [active,setActive] = createSignal(false);
  const startScan = () => {
    console.log("start scan");
    setActive(true);
  }

  const stopScan = () => {
    console.log("stop scan");
    setActive(false);
  }
  
  return (
    <div class={styles.App}>
      <h1>Solidjs Barcode Scanner Demo</h1>
      <button onClick={startScan}>Start Scanning</button>
      <Scanner active={active()}>
        <button class={styles.CloseButton} onClick={stopScan}>Close</button>
      </Scanner>
    </div>
  );
};

export default App;
