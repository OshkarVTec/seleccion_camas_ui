import { useRef, useEffect } from "react";
import { Stage, Layer, Image, Rect, Text, Group } from "react-konva";
import useImage from "use-image";
import { useAreas } from "./AreaContext";
import { SCALE_FACTOR } from "../../common/constants";

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

export default function ImageGrid({
	src,
	ngrids = 4,
	gridHeightFactor = 0.8,
	isActive = true,
}: Props) {
	const [image] = useImage(src || "");

	const stageRef = useRef<any>(null);

	const { selectedAreas, setSelectedAreas } = useAreas();

	// Generar las áreas
	useEffect(() => {
		if (!image) return;
		setSelectedAreas(() => {
			const newAreas = [...selectedAreas];

			const imageWidth = image?.width * SCALE_FACTOR || 0;
			const imageHeight = image?.height * SCALE_FACTOR || 0;
			const gridHeight = imageHeight * gridHeightFactor;
			const gridWidth = gridHeight / 2;
			// Si hay más cuadros que áreas actuales, agregar las nuevas áreas
			if (ngrids > selectedAreas.length) {
				for (let i = selectedAreas.length; i < ngrids; i++) {
					newAreas.push({
						x: 0,
						y: 0,
						width: gridWidth,
						height: gridHeight,
					});
				}
			}
			// Si hay menos cuadros que áreas actuales, eliminar las áreas sobrantes
			if (ngrids < selectedAreas.length) {
				newAreas.splice(ngrids, selectedAreas.length - ngrids);
			}

			// Actualizar el tamaño y la posición de las áreas existentes
			return newAreas.map((area) => {
				let newX = area.x;
				let newY = area.y;

				// Ajustar la posición y
				const areaBottom = area.y + gridHeight;
				if (areaBottom >= imageHeight) {
					const excessY = areaBottom - imageHeight;
					newY -= excessY;
				}
				// Ajustar la posición x
				const areaRight = area.x + gridWidth;
				if (areaRight >= imageWidth) {
					const excessX = areaRight - imageWidth;
					newX -= excessX;
				}

				return {
					...area,
					width: gridWidth,
					height: gridHeight,
					x: newX,
					y: newY,
				};
			});
		});
	}, [ngrids, gridHeightFactor, setSelectedAreas, image]);

	const handleDragEnd = (index: number) => {
		if (stageRef.current) {
			const rect = stageRef.current.getStage().findOne(`#rect-${index}`);
			const { x, y } = rect.position();

			setSelectedAreas(() => {
				const newAreas = [...selectedAreas];
				newAreas[index] = {
					...newAreas[index],
					x: x,
					y: y,
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
					width={image.width * SCALE_FACTOR}
					height={image.height * SCALE_FACTOR}
					ref={stageRef}
				>
					<Layer>
						<Image
							image={image}
							width={image.width * SCALE_FACTOR}
							height={image.height * SCALE_FACTOR}
						/>
						{selectedAreas.map((area: Area, index: number) => (
							<Group
								key={index}
								id={`rect-${index}`}
								x={area.x}
								y={area.y}
								draggable={isActive}
								onDragMove={handleDragMove}
								onDragEnd={() => handleDragEnd(index)}
							>
								<Rect
									width={area.width}
									height={area.height}
									fill={colors[index % colors.length]}
									stroke="white"
									strokeWidth={2}
								/>
								<Text
									x={5}
									y={5}
									text={String.fromCharCode(65 + index)}
									fontSize={50}
									fill="black"
									fontStyle="bold"
								/>
							</Group>
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
	isActive?: boolean;
	src?: string;
	ngrids?: number;
	gridHeightFactor?: number;
}
