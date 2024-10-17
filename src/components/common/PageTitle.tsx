export default function PageTitle({ children }: PageTitleProps) {
	return <h1>{children}</h1>;
}

interface PageTitleProps {
	children: React.ReactNode;
}
