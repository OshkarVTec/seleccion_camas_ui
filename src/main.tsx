import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AreaProvider } from "./components/common/AreaContext.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<AreaProvider>
			<App />
		</AreaProvider>
	</StrictMode>
);
