import { useEffect, useState } from "react";
import PageTitle from "./components/common/PageTitle";
import Text from "./components/common/Text";
import Header from "./components/landing/Header";
import ActionButton from "./components/common/ActionButton";
import ImageGrid from "./components/common/ImageGrid";
import { useAreas } from "./components/common/AreaContext";
import CancelButton from "./components/common/CancelButton";
import { SCALE_FACTOR } from "./common/constants";
const ipcRenderer = window.require
	? window.require("electron").ipcRenderer
	: null;
const GRID_MIN_HEIGHT_FACTOR = 0.2;

export default function App() {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [numberOfBeds, setNumberOfBeds] = useState<number>(1);
	const [bedHeightFactor, setbedHeightFactor] = useState<number>(
		GRID_MIN_HEIGHT_FACTOR
	);
	const [saved, setSaved] = useState<boolean>(false);
	const { selectedAreas } = useAreas();
	const [objectURL, setObjectURL] = useState<string>("");

	useEffect(() => {
		if (selectedFile) {
			const url = URL.createObjectURL(selectedFile);
			setObjectURL(url);

			// Clean up the object URL when the component unmounts or selectedFile changes
			return () => {
				URL.revokeObjectURL(url);
			};
		}
	}, [selectedFile]);

	const saveDataAsJSON = (data: SelectedAreas[]) => {
		ipcRenderer.send("save-json", data);
		ipcRenderer.once(
			"save-json-response",
			(_: any, responseMessage: string) => {
				console.log(responseMessage);
			}
		);
	};

	const handleNumberOfBedsChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		let numberOfBeds = parseInt(event.target.value);
		if (numberOfBeds < 1) {
			numberOfBeds = 1;
		}
		if (numberOfBeds > 10) {
			numberOfBeds = 10;
		}
		setNumberOfBeds(numberOfBeds);
	};
	const handlebedHeightFactorChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setbedHeightFactor(parseFloat(event.target.value));
	};
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			setSelectedFile(event.target.files[0]);
		}
	};
	const handleSave = () => {
		const scaledAreas = selectedAreas.map((area: SelectedAreas) => ({
			x: area.x,
			y: area.y,
			width: area.width / SCALE_FACTOR,
			height: area.height / SCALE_FACTOR,
		}));
		setSaved(true);
		saveDataAsJSON(scaledAreas);
		console.log(scaledAreas);
	};

	return (
		<>
			{" "}
			<Header />
			<main className="bg-white flex flex-col p-10">
				{saved ? (
					<div className="flex flex-col gap-2 my-10">
						<PageTitle>¡Listo!</PageTitle>
						<Text>
							Se ha guardado tu selección, el modelo está listo. Ya puedes
							cerrar esta aplicación. Se recomienda tomar una captura de
							pantalla del orden de las camas.{" "}
						</Text>
						<ImageGrid
							src={objectURL}
							ngrids={numberOfBeds}
							gridHeightFactor={bedHeightFactor}
							isActive={false}
						/>
						<div className="flex gap-4 w-72">
							<CancelButton onClick={() => window.location.reload()}>
								Volver a seleccionar
							</CancelButton>
							<ActionButton onClick={() => ipcRenderer.send("close-app")}>
								Cerrar
							</ActionButton>
						</div>
					</div>
				) : (
					<>
						<div className="flex flex-col gap-2 my-10">
							<PageTitle>Instrucciones generales</PageTitle>
							<Text>
								En esta aplicación se seleccionará una foto de base para definir
								el número de camas y el tamaño de cada una de ellas. Para de
								esta manera, poder compartir información al modelo. Se detallará
								de mejor manera cada instrucción en el apartado correspondiente.
							</Text>
						</div>
						<div className="flex flex-col gap-2 my-10">
							<PageTitle>Selección de fotos</PageTitle>
							<Text>
								Selecciona una foto con las camas que deseas analizar, esta foto
								debe de estar en la misma posición que en la que se buscará
								hacer el análisis de tiempo real. Debe ser una imágen de formato
								jpg, jpeg o png.
							</Text>
							<input type="file" accept="image/*" onChange={handleFileChange} />
						</div>
						<div className="flex flex-col gap-2 my-10">
							{selectedFile && (
								<>
									<PageTitle>Selección de camas</PageTitle>
									<Text>
										1. Agrega o quita camas con el campo de número de camas.{" "}
										<br />
										2. Ajusta el ancho de las camas con el control deslizante.{" "}
										<br />
										3. Mueve las cuadriculas para ajustarlas a las camas. <br />
										4. Puedes ir probando los cambios e ir ajustando los
										parámetros. <br />
										5. Cuando estés listo, da clic en guardar. <br />
									</Text>
									<div className="flex gap-4 justify-around items-center">
										<div className={`w-3/4 overflow-hidden`}>
											<ImageGrid
												src={objectURL}
												ngrids={numberOfBeds}
												gridHeightFactor={bedHeightFactor}
											/>
										</div>
										<div className="flex flex-col justify-center gap-10">
											<label className="flex flex-col justify-center gap-2 p-2 border-2 border-solid border-green-800 rounded-xl">
												Número de camas
												<input
													value={numberOfBeds}
													id="beds"
													type="number"
													placeholder="Número de camas"
													onChange={handleNumberOfBedsChange}
												/>
											</label>
											<label className="flex flex-col justify-center gap-2  p-2 border-2 border-solid border-green-800 rounded-xl">
												Altura de las camas
												<input
													type="range"
													min={GRID_MIN_HEIGHT_FACTOR}
													max={1}
													step={0.01}
													value={bedHeightFactor}
													onChange={handlebedHeightFactorChange}
												/>
											</label>
											<ActionButton onClick={handleSave}>Guardar</ActionButton>
										</div>
									</div>
								</>
							)}
						</div>
					</>
				)}
			</main>
		</>
	);
}

interface SelectedAreas {
	x: number;
	y: number;
	width: number;
	height: number;
}
