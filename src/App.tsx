import { useEffect, useState } from "react";
import PageTitle from "./components/common/PageTitle";
import PageSubTitle from "./components/common/PageSubTitle";
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
			x: area.x / SCALE_FACTOR,
			y: area.y / SCALE_FACTOR,
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
						<PageSubTitle>¡Listo!</PageSubTitle>
						<Text>
							Tu selección se ha guardado, y el modelo está listo. Ya puedes
							cerrar esta aplicación. Te recomendamos tomar una captura de
							pantalla para recordar el orden de las camas.{" "}
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
						<div className="flex flex-col gap-2 my-0">
							<PageTitle>Instrucciones</PageTitle>
							{/* <Text>
								Elige una foto de referencia para definir el número y tamaño de las camas.
								Las instrucciones específicas se explicarán en cada sección correspondiente.
							</Text> */}
						</div>
						<div className="flex flex-col gap-2 my-10">
							<PageSubTitle>Selección de foto</PageSubTitle>
							<Text>
								Selecciona una foto en formato jpg, jpeg o png de las camas que
								deseas analizar, asegurándote de que esté en la misma posición
								que usarás para el análisis en tiempo real. A continuación se
								muestra una imagen de referencia.{" "}
							</Text>
							<img
								src="./public/cows.jpeg"
								alt="Imagen de referencia"
								className="w-1/2 mx-auto my-4"
							/>
							<div className="flex gap-4">
								<label>Selecciona la foto: </label>
								<input
									type="file"
									accept="image/*"
									onChange={handleFileChange}
								/>
							</div>
						</div>
						<div className="flex flex-col gap-2 my-10">
							{selectedFile && (
								<>
									<PageSubTitle>Selección de camas</PageSubTitle>
									<Text>
										1. En el cuadro de "Número de camas" que se encuentra en la
										parte inferior derecha, usa las flechas para ajustar el
										número de camas o escribe el número directamente en el
										campo. Asegúrate de que el valor corresponda al total de
										camas que deseas incluir en el análisis. <br />
										2. En el cuadro "Altura de las camas", ajusta la altura de
										los rectángulos de colores utilizando el control deslizante,
										para que sean del mismo tamaño que las camas.
										<br />
										3. Mueve los rectángulos para ajustarlos a las camas. <br />
										<b>
											&nbsp;&nbsp;&nbsp;&nbsp; Las camas deben verse completas.
											El modelo no funciona con camas cortadas.
										</b>
										<br />
										4. Puedes ir probando los cambios e ir ajustando los
										parámetros. <br />
										5. Cuando hayas configurado el número y la altura de las
										camas, haz clic en el botón verde "Guardar" para almacenar
										los ajustes. <br />
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
