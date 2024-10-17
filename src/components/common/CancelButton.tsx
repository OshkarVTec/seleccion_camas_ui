import { ReactNode } from "react";

export default function CancelButton({ children, onClick }: CancelButtonProps) {
	return <button onClick={onClick}>{children}</button>;
}

interface CancelButtonProps {
	children: ReactNode;
	onClick: React.MouseEventHandler<HTMLButtonElement>;
}
