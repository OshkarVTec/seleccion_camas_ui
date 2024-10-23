import { useState } from "react";
import PageTitle from "./components/common/PageTitle";
import Text from "./components/common/Text";
import Header from "./components/landing/Header";
import ActionButton from "./components/common/ActionButton";
import ImageGrid from "./components/common/ImageGrid";
import { useAreas } from "./components/common/AreaContext";

export default function App() {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [numberOfBeds, setNumberOfBeds] = useState<number>(1);
	const [bedWidth, setBedWidth] = useState<number>(500);
	const [saved, setSaved] = useState<boolean>(false);
	const { selectedAreas } = useAreas();

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
	const handleBedWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		let bedWidth = parseInt(event.target.value);
		if (bedWidth < 30) {
			bedWidth = 30;
		}
		if (bedWidth > 700) {
			bedWidth = 700;
		}
		setBedWidth(parseInt(event.target.value));
	};
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			setSelectedFile(event.target.files[0]);
		}
	};
	const handleSave = () => {
		setSaved(true);
		console.log(selectedAreas);
	};

	return (
		<>
			{" "}
			<Header />
			<main className="bg-white flex flex-col p-10">
				<div className="flex flex-col gap-2 my-10">
					<PageTitle>Instrucciones</PageTitle>
					<Text>Texto</Text>
				</div>
				<div className="flex flex-col gap-2 my-10">
					<PageTitle>Selección de fotos</PageTitle>
					<input type="file" onChange={handleFileChange} />
				</div>
				<div className="flex flex-col gap-2 my-10">
					{saved ? (
						<div className="flex flex-col gap-2 my-10">
							<PageTitle>¡Listo!</PageTitle>
							<Text>
								Se ha guardado tu selección, el modelo está listo. Ya puedes
								cerrar esta aplicación.{" "}
							</Text>
						</div>
					) : (
						selectedFile && (
							<>
								<PageTitle>Selección de camas</PageTitle>
								<div className="flex gap-4 justify-around items-center">
									<div className="w-3/4 h-screen">
										<ImageGrid
											src={URL.createObjectURL(selectedFile)}
											ngrids={numberOfBeds}
											gridWidth={bedWidth}
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
											Ancho de las camas
											<input
												type="range"
												min="30"
												max="700"
												value={bedWidth}
												onChange={handleBedWidthChange}
											/>
										</label>
										<ActionButton onClick={handleSave}>Guardar</ActionButton>
									</div>
								</div>
							</>
						)
					)}
				</div>
			</main>
		</>
	);
}
