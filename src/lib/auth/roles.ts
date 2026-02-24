import { createAccessControl } from "better-auth/plugins/access";
import {
  adminAc,
  defaultStatements,
} from "better-auth/plugins/organization/access";
const statement = {
  ...defaultStatements,
  subject: ["create", "update", "delete"],
  academic_term: ["create", "update", "delete"],
  course: ["create", "update", "delete"],
  module: ["create", "update", "delete"],
  lesson: ["create", "update", "delete"],
  classroom: ["create", "update", "delete"],
  class_schedule: ["create", "update", "delete"],
  class_attendance: ["create", "update", "delete"],
} as const;
export const ac = createAccessControl(statement);

const superadmin = ac.newRole({
  ...adminAc.statements,
  subject: ["create", "delete", "update"],
  academic_term: ["create", "delete", "update"],
  course: ["create", "delete", "update"],
  module: ["create", "delete", "update"],
  lesson: ["create", "delete", "update"],
  classroom: ["create", "delete", "update"],
  class_schedule: ["create", "delete", "update"],
  class_attendance: ["create", "delete", "update"],
});

const admin = ac.newRole({
  ...adminAc.statements,
  subject: ["create", "delete", "update"],
  academic_term: ["create", "delete", "update"],
  course: ["create", "delete", "update"],
  module: ["create", "delete", "update"],
  lesson: ["create", "delete", "update"],
  classroom: ["create", "delete", "update"],
  class_schedule: ["create", "delete", "update"],
  class_attendance: ["create", "delete", "update"],
});

const teacher = ac.newRole({
  organization: [],
  member: [],
  invitation: [],
  team: [],
  ac: [],
  subject: ["create", "update"],
  academic_term: ["create", "update"],
  course: ["create", "update"],
  module: ["create", "update"],
  lesson: ["create", "update"],
  classroom: ["create", "update"],
  class_schedule: ["create", "update"],
  class_attendance: ["create", "update"],
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

