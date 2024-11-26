const { FusesPlugin } = require("@electron-forge/plugin-fuses");
const { FuseV1Options, FuseVersion } = require("@electron/fuses");
const path = require("path");

module.exports = {
	packagerConfig: {
		asar: true,
		icon: path.join(__dirname, "assets", "icons", "icon"), // Specify the base name of the icon files without extension
		executableName: "seleccion_camas", // Specify the name of the executable
	},
	rebuildConfig: {},
	makers: [
		{
			name: "@electron-forge/maker-squirrel",
			config: {
				name: "aplicacion_seleccion_camas_windows",
				setupIcon: path.join(__dirname, "assets", "icons", "icon.ico"), // Path to the icon for the installer
			},
		},
		{
			name: "@electron-forge/maker-zip",
			platforms: ["darwin"],
			config: {
				name: "AplicacionSeleccionCamas", // Name for macOS executable
			},
		},
		{
			name: "@electron-forge/maker-deb",
			config: {
				options: {
					name: "aplicacion_seleccion_camas_linux",
					icon: path.join(__dirname, "assets", "icons", "icon.png"), // Path to the icon for the installer
				},
			},
		},
	],
	plugins: [
		{
			name: "@electron-forge/plugin-auto-unpack-natives",
			config: {},
		},
		// Fuses are used to enable/disable various Electron functionality
		// at package time, before code signing the application
		new FusesPlugin({
			version: FuseVersion.V1,
			[FuseV1Options.RunAsNode]: false,
			[FuseV1Options.EnableCookieEncryption]: true,
			[FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
			[FuseV1Options.EnableNodeCliInspectArguments]: false,
			[FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
			[FuseV1Options.OnlyLoadAppFromAsar]: true,
		}),
	],
};
