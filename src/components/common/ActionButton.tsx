import { ReactNode } from "react";

export default function ActionButton({ children, onClick }: ActionButtonProps) {
	return <button onClick={onClick}>{children}</button>;
}

interface ActionButtonProps {
	children: ReactNode;
	onClick: React.MouseEventHandler<HTMLButtonElement>;
}
