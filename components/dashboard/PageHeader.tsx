import { AnimatedHeader } from "./AnimatedHeader";

interface PageHeaderProps {
  title: string;
  description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return <AnimatedHeader title={title} description={description} />;
}