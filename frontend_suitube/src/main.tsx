import { createRoot } from "react-dom/client";
import "@mysten/dapp-kit/dist/index.css";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
