export default function PageSubTitle({ children }: PageSubTitleProps) {
	return <h1 className="text-3xl text-green-900">{children}</h1>;
}

interface PageSubTitleProps {
	children: React.ReactNode;
}