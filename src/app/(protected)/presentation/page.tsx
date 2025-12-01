import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const PresentationPage = ({ children }: Props) => {
  return redirect("/dashboard");
};

export default PresentationPage;
