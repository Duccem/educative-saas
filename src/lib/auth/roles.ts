import { createAccessControl } from "better-auth/plugins/access";
import {
  adminAc,
  defaultStatements,
} from "better-auth/plugins/organization/access";
const statement = {
  ...defaultStatements,
  subject: ["create", "update", "delete"],
} as const;
export const ac = createAccessControl(statement);

const superadmin = ac.newRole({
  ...adminAc.statements,
  subject: ["create", "delete", "update"],
});

const admin = ac.newRole({
  ...adminAc.statements,
  subject: ["create", "delete", "update"],
});

const teacher = ac.newRole({
  organization: [],
  member: [],
  invitation: [],
  team: [],
  ac: [],
  subject: ["create", "update"],
});

const parent = ac.newRole({
  organization: [],
  member: [],
  invitation: [],
  team: [],
  ac: [],
});

const student = ac.newRole({
  organization: [],
  member: [],
  invitation: [],
  team: [],
  ac: [],
});

export const roles = {
  superadmin,
  admin,
  teacher,
  parent,
  student,
};

