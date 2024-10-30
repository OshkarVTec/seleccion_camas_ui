import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const createWindow = () => {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: join(__dirname, "preload.js"),
			contextIsolation: false,
			nodeIntegration: true,
		},
	});

	// and load the index.html of the app.
	mainWindow.loadFile(join(__dirname, "dist", "index.html"));

	// Open the DevTools.
	// mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
	createWindow();

	app.on("activate", () => {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});

// Handle saving JSON output
ipcMain.on("save-json", (event, jsonData) => {
	const filePath = join(app.getPath("documents"), "output.json");

	fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
		if (err) {
			console.error("Failed to save JSON file:", err);
			event.reply("save-json-response", "Failed to save JSON file");
		} else {
			console.log("JSON file saved successfully");
			event.reply("save-json-response", "JSON file saved successfully");
		}
	});
});
