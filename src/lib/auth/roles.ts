import { createAccessControl } from "better-auth/plugins/access";
import {
  adminAc,
  defaultStatements,
} from "better-auth/plugins/organization/access";
const statement = {
  ...defaultStatements,
} as const;
export const ac = createAccessControl(statement);

const superadmin = ac.newRole({
  ...statement,
});

const admin = ac.newRole({
  ...adminAc.statements,
});

const teacher = ac.newRole({
  organization: [],
  member: [],
  invitation: [],
  team: [],
  ac: [],
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

