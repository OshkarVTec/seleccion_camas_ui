import React from "react";
import { useRef, useEffect } from "react";
import { Stage, Layer, Image, Rect, Text } from "react-konva";
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

export default function ImageGrid({
	src,
	ngrids = 4,
	gridWidth = 300,
	isActive = true,
}: Props) {
	const [image] = useImage(src || "");

	const stageRef = useRef<any>(null);
	const scaleFactor = 0.8;

	const { selectedAreas, setSelectedAreas } = useAreas();

	// Generar las áreas
	useEffect(() => {
		setSelectedAreas((prev: Area[]) => {
			const newAreas = [...prev];

			// Obtener el ancho y alto de la imagen (con escalado)
			const stage = stageRef.current?.getStage();
			const imageWidth = stage?.width() || 0;
			const imageHeight = stage?.height() || 0;

			// Si hay más cuadros que áreas actuales, agregar las nuevas áreas
			if (ngrids > prev.length) {
				for (let i = prev.length; i < ngrids; i++) {
					newAreas.push({
						x: 0,
						y: 0,
						width: gridWidth,
						height: gridWidth * 2,
					});
				}
			}

			// Actualizar el tamaño y la posición de las áreas existentes
			return newAreas.map((area) => {
				let newX = area.x;
				let newY = area.y;

				// Ajustar la posición y
				const areaBottom = area.y + gridWidth * 2 * scaleFactor;
				if (areaBottom > imageHeight) {
					const excessY = areaBottom - imageHeight;
					newY -= excessY;
				} else if (area.y < 0) {
					const excessY = Math.abs(area.y);
					newY += excessY;
				}

				// Ajustar la posición x
				const areaRight = area.x + gridWidth * scaleFactor;
				if (areaRight > imageWidth) {
					const excessX = areaRight - imageWidth;
					newX -= excessX;
				} else if (area.x < 0) {
					const excessX = Math.abs(area.x);
					newX += excessX;
				}

				return {
					...area,
					width: gridWidth,
					height: gridWidth * 2,
					x: newX,
					y: newY,
				};
			});
		});
	}, [ngrids, gridWidth, setSelectedAreas]);

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
				>
					<Layer>
						<Image
							image={image}
							width={image.width * scaleFactor}
							height={image.height * scaleFactor}
						/>
						{selectedAreas.map((area: Area, index: number) => (
							<React.Fragment key={index}>
								<Rect
									id={`rect-${index}`}
									x={area.x * scaleFactor}
									y={area.y * scaleFactor}
									width={area.width * scaleFactor}
									height={area.height * scaleFactor}
									fill={colors[index % colors.length]}
									stroke="white"
									strokeWidth={2}
									draggable={isActive}
									onDragMove={handleDragMove}
									onDragEnd={() => handleDragEnd(index)}
								/>
								<Text
									x={area.x * scaleFactor + 5}
									y={area.y * scaleFactor + 5}
									text={String.fromCharCode(65 + index)}
									fontSize={50}
									fill="black"
									fontStyle="bold"
								/>
							</React.Fragment>
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
	gridWidth?: number;
}
