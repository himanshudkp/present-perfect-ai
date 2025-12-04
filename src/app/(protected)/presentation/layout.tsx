import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const PresentationLayout = ({ children }: Props) => {
  return <div className="h-full w-full overflow-x-hidden">{children}</div>;
};

export default PresentationLayout;
