export default function Text({ children }: TextProps) {
	return <p className="text-lg">{children}</p>;
}

interface TextProps {
	children: React.ReactNode;
}
