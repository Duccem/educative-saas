import InviteMember from "@/components/sections/organization/invite-member";
import { ListOrganizationMembers } from "@/components/sections/organization/list-organization-members";
import ListPendingInvitations from "@/components/sections/organization/list-pending-invitations";

export default function TeamSettingsPage() {
  return (
    <div className="flex w-full  mx-auto flex-col gap-6 pb-4">
      <div>
        <h1 className="text-2xl font-semibold leading-none">Team Settings</h1>
        <p className=" text-muted-foreground">Manage your team settings.</p>
      </div>
      <InviteMember />
      <ListPendingInvitations />
      <ListOrganizationMembers />
    </div>
  );
}

