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
  grade: ["create", "update", "delete"],
  section: ["create", "update", "delete"],
  class_schedule: ["create", "update", "delete"],
  class_attendance: ["create", "update", "delete"],
  enrollment: ["create", "update", "delete"],
  parent_student: ["create", "update", "delete"],
  quiz: ["create", "update", "delete"],
  question: ["create", "update", "delete"],
  quiz_attempt: ["create", "update", "delete"],
  quiz_response: ["create", "update", "delete"],
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
  grade: ["create", "delete", "update"],
  section: ["create", "delete", "update"],
  class_schedule: ["create", "delete", "update"],
  class_attendance: ["create", "delete", "update"],
  enrollment: ["create", "delete", "update"],
  parent_student: ["create", "delete", "update"],
  quiz: ["create", "delete", "update"],
  question: ["create", "delete", "update"],
  quiz_attempt: ["create", "delete", "update"],
  quiz_response: ["create", "delete", "update"],
});

const admin = ac.newRole({
  ...adminAc.statements,
  subject: ["create", "delete", "update"],
  academic_term: ["create", "delete", "update"],
  course: ["create", "delete", "update"],
  module: ["create", "delete", "update"],
  lesson: ["create", "delete", "update"],
  classroom: ["create", "delete", "update"],
  grade: ["create", "delete", "update"],
  section: ["create", "delete", "update"],
  class_schedule: ["create", "delete", "update"],
  class_attendance: ["create", "delete", "update"],
  enrollment: ["create", "delete", "update"],
  parent_student: ["create", "delete", "update"],
  quiz: ["create", "delete", "update"],
  question: ["create", "delete", "update"],
  quiz_attempt: ["create", "delete", "update"],
  quiz_response: ["create", "delete", "update"],
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
  grade: ["create", "update"],
  section: ["create", "update"],
  class_schedule: ["create", "update"],
  class_attendance: ["create", "update"],
  enrollment: ["create", "update"],
  parent_student: ["create", "update"],
  quiz: ["create", "update"],
  question: ["create", "update"],
  quiz_attempt: ["create", "update"],
  quiz_response: ["create", "update"],
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
  quiz_attempt: ["create"],
  quiz_response: ["create"],
});

export const roles = {
  superadmin,
  admin,
  teacher,
  parent,
  student,
};

