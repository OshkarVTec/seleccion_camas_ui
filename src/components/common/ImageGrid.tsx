import { useRef, useEffect } from "react";
import { Stage, Layer, Image, Rect } from "react-konva";
import useImage from "use-image";
import { useAreas } from "./AreaContext";

const colors = [
	"rgba(255, 255, 255, 0.4)", // Blanco semi-transparente
	"rgba(0, 255, 0, 0.3)", // Verde semi-transparente
	"rgba(0, 0, 255, 0.3)", // Azul semi-transparente
	"rgba(255, 0, 0, 0.5)", // Rojo semi-transparente
	"rgba(255, 165, 0, 0.4)", // Naranja semi-transparente
	"rgba(128, 0, 128, 0.3)", // Púrpura semi-transparente
	"rgba(75, 0, 130, 0.3)", // Índigo semi-transparente
	"rgba(255, 255, 0, 0.3)", // Amarillo semi-transparente
	"rgba(0, 255, 255, 0.3)", // Cian semi-transparente
	"rgba(255, 20, 147, 0.4)", // Rosa fuerte semi-transparente
];

// Definir el tipo de área
interface Area {
	x: number;
	y: number;
	width: number;
	height: number;
}

// Función para generar las áreas iniciales
const generateInitialAreas = (ngrids: number, gridWidth: number): Area[] => {
	const areas: Area[] = [];
	for (let i = 0; i < ngrids; i++) {
		areas.push({
			x: 10,
			y: 10,
			width: gridWidth,
			height: gridWidth * 2,
		});
	}
	return areas;
};

export default function ImageGrid({ src, ngrids = 4, gridWidth = 300 }: Props) {
	const [image] = useImage(src || "");

	const stageRef = useRef<any>(null);
	const scaleFactor = 0.8;

	const { selectedAreas, setSelectedAreas } = useAreas();

	// Generar las áreas iniciales
	useEffect(() => {
		if (selectedAreas.length === 0) {
			setSelectedAreas(generateInitialAreas(ngrids, gridWidth));
		}
	}, [ngrids, gridWidth, selectedAreas, setSelectedAreas]);

	const handleDragEnd = (index: number) => {
		if (stageRef.current) {
			const rect = stageRef.current.getStage().findOne(`#rect-${index}`);
			const { x, y } = rect.position();

			setSelectedAreas((prev: Area[]) => {
				const newAreas = [...prev];
				newAreas[index] = {
					...newAreas[index],
					x: x / scaleFactor,
					y: y / scaleFactor,
				};
				return newAreas;
			});
		}
	};

	// Mover los rectángulos pero restringiendo su movimiento dentro de la imagen
	const handleDragMove = (e: any) => {
		const rect = e.target;
		const stage = stageRef.current.getStage();

		const newX = rect.x();
		const newY = rect.y();

		// Calcular límites basados en las dimensiones de la imagen
		const imageWidth = stage.width();
		const imageHeight = stage.height();

		const minX = 0;
		const maxX = imageWidth - rect.width();
		const minY = 0;
		const maxY = imageHeight - rect.height();

		// Restringir el movimiento dentro de los límites de la imagen
		if (newX < minX) rect.x(minX);
		if (newX > maxX) rect.x(maxX);
		if (newY < minY) rect.y(minY);
		if (newY > maxY) rect.y(maxY);
	};

	return (
		<div>
			{image ? (
				<Stage
					width={image.width * scaleFactor}
					height={image.height * scaleFactor}
					ref={stageRef}
					scaleX={scaleFactor}
					scaleY={scaleFactor}
				>
					<Layer>
						<Image
							image={image}
							width={image.width * scaleFactor}
							height={image.height * scaleFactor}
						/>
						{selectedAreas.map((area: Area, index: number) => (
							<Rect
								key={index}
								id={`rect-${index}`}
								x={area.x * scaleFactor}
								y={area.y * scaleFactor}
								width={area.width * scaleFactor}
								height={area.height * scaleFactor}
								fill={colors[index % colors.length]}
								stroke="white"
								strokeWidth={2}
								draggable
								onDragMove={handleDragMove}
								onDragEnd={() => handleDragEnd(index)}
							/>
						))}
					</Layer>
				</Stage>
			) : (
				<div>Loading image...</div>
			)}
		</div>
	);
}

interface Props {
	src?: string;
	ngrids?: number;
	gridWidth?: number;
}
