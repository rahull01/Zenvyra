import { notFound } from "next/navigation";

import StartupPage from "../../../../components/solutions/StartupPage";
import AgencyPage from "../../../../components/solutions/AgencyPage";
import EnterprisePage from "../../../../components/solutions/EnterprisePage";

export default function SolutionDetailPage({ params }: { params: { slug: string } }) {

  if (params.slug === "startups") return <StartupPage />;
  if (params.slug === "agencies") return <AgencyPage />;
  if (params.slug === "enterprise") return <EnterprisePage />;

  return notFound();
}