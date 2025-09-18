import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { DigitalIDProvider } from './context/DigitalIDContext';

<DigitalIDProvider>
  <App />
</DigitalIDProvider>

createRoot(document.getElementById("root")!).render(<App />);
