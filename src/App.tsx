import PageTitle from "./components/common/PageTitle";
import Text from "./components/common/Text";

function App() {
	return (
		<main className="bg-white flex flex-col p-10">
			<div className="my-10">
				<PageTitle>Instrucciones</PageTitle>
				<Text>Texto</Text>
			</div>
			<div className="my-10">
				<PageTitle>Selección de fotos</PageTitle>
			</div>
			<div className="my-10">
				<PageTitle>Selección de camas</PageTitle>
			</div>
		</main>
	);
}

export default App;
