export default function PageTitle({ children }: PageTitleProps) {
	return <h1 className="text-5xl text-green-900">{children}</h1>;
}

interface PageTitleProps {
	children: React.ReactNode;
}
