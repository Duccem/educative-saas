import { requireOrganizations } from "@/lib/auth/guards";

export default async function Page() {
  await requireOrganizations();
  return <div></div>;
}

