import { ReactNode } from "react";

export default function ActionButton({ children, onClick }: ActionButtonProps) {
	return (
		<button
			onClick={onClick}
			className="p-4 bg-green-700 text-white font-bold rounded-xl"
		>
			{children}
		</button>
	);
}

interface ActionButtonProps {
	children: ReactNode;
	onClick: React.MouseEventHandler<HTMLButtonElement>;
}
