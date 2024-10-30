import { ReactNode } from "react";

export default function CancelButton({ children, onClick }: CancelButtonProps) {
	return (
		<button
			className="p-4 font-bold rounded-xl border-2 border-green-700 flex-1"
			onClick={onClick}
		>
			{children}
		</button>
	);
}

interface CancelButtonProps {
	children: ReactNode;
	onClick: React.MouseEventHandler<HTMLButtonElement>;
}
