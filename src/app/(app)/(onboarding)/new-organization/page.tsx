import { CreateOrganizationForm } from "@/components/sections/organization/create-organization-form";
import { requireAuth, requireNoOrganizations } from "@/lib/auth/guards";

export default async function Page() {
  await requireAuth();
  return (
    <div className="flex flex-col gap-4 items-center justify-center w-1/3">
      <div className="w-full  space-y-8">
        <div className="   text-center mb-8">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-3 bg-primary">
            <div className="w-4 h-4 bg-background rounded-sm"></div>
          </div>
          <h1 className="text-xl font-semibold text-foreground">AcadAI</h1>
        </div>
      </div>
      <CreateOrganizationForm />
    </div>
  );
}

