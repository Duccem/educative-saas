import { DeleteOrganization } from "@/components/sections/organization/delete-organization";
import { OrganizationDetails } from "@/components/sections/organization/organization-details";

export default function Page() {
  return (
    <div className="flex w-full  mx-auto flex-col gap-6 pb-10">
      <div>
        <h1 className="text-2xl font-semibold leading-none">School Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your school settings and preferences.
        </p>
      </div>
      <OrganizationDetails />
      <DeleteOrganization />
    </div>
  );
}

