import { useState } from "react";
import PageTitle from "./components/common/PageTitle";
import Text from "./components/common/Text";
import Header from "./components/landing/Header";

export default function App() {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
						<div>
							<img
								src={URL.createObjectURL(selectedFile)}
								alt="Selected"
								className="max-w-full h-auto"
							/>
						</div>
					)}
				</div>
			</main>
		</>
	);
}
