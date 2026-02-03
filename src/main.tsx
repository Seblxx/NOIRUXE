
  import { createRoot } from "react-dom/client";
  import AppRouter from "./AppRouter";
  import "./index.css";
  import "./global.css";

  createRoot(document.getElementById("root")!).render(<AppRouter />);
  