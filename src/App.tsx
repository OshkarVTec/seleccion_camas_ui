import { useState } from "react";
import PageTitle from "./components/common/PageTitle";
import Text from "./components/common/Text";
import Header from "./components/landing/Header";

export default function App() {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [numberOfBeds, setNumberOfBeds] = useState<number>(0);
	const [bedWidth, setBedWidth] = useState<number>(0);

	const handleNumberOfBedsChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		let numberOfBeds = parseInt(event.target.value);
		if (numberOfBeds < 0) {
			numberOfBeds = 0;
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

	return (
		<>
			{" "}
			<Header />
			<main className="bg-white flex flex-col p-10">
				<div className="my-10">
					<PageTitle>Instrucciones</PageTitle>
					<Text>Texto</Text>
				</div>
				<div className="my-10">
					<PageTitle>Selección de fotos</PageTitle>
					<input type="file" onChange={handleFileChange} />
				</div>
				<div className="my-10">
					<PageTitle>Selección de camas</PageTitle>
					{selectedFile && (
						<div className="flex gap-4">
							<img
								src={URL.createObjectURL(selectedFile)}
								alt="Selected"
								className="max-w-full h-auto"
							/>
							<div className="flex flex-col justify-center gap-10">
								<label className="flex flex-col justify-center gap-2">
									Número de camas
									<input
										value={numberOfBeds}
										id="beds"
										type="number"
										placeholder="Número de camas"
										onChange={handleNumberOfBedsChange}
									/>
								</label>
								<label className="flex flex-col justify-center gap-2">
									Ancho de las camas
									<input
										type="range"
										min="30"
										max="700"
										value={bedWidth}
										onChange={handleBedWidthChange}
									/>
								</label>
							</div>
						</div>
					)}
				</div>
			</main>
		</>
	);
}
