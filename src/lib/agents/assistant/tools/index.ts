import { getClassScheduleOverview } from "./get-class-schedule-overview";
import { getCourseContentOverview } from "./get-course-content-overview";
import { getCourseStudentPerformance } from "./get-course-student-performance";
import { getUpcomingCourseDeadlines } from "./get-upcoming-course-deadlines";
import { listTeacherCourses } from "./list-teacher-courses";

export const assistantTools = {
  listTeacherCourses,
  getCourseContentOverview,
  getUpcomingCourseDeadlines,
  getCourseStudentPerformance,
  getClassScheduleOverview,
};

export {
  listTeacherCourses,
  getCourseContentOverview,
  getUpcomingCourseDeadlines,
  getCourseStudentPerformance,
  getClassScheduleOverview,
};

