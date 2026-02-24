import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { onError } from "@orpc/server";
import { NextRequest } from "next/server";
import { subjectRouter } from "@/lib/api/routers/subject";
import { academicTermRouter } from "@/lib/api/routers/academic-term";
import { courseRouter } from "@/lib/api/routers/course";
import { moduleRouter } from "@/lib/api/routers/module";
import { lessonRouter } from "@/lib/api/routers/lesson";
import { classroomRouter } from "@/lib/api/routers/classroom";
import { classScheduleRouter } from "@/lib/api/routers/class-schedule";
import { classAttendanceRouter } from "@/lib/api/routers/class-attendance";
import { enrollmentRouter } from "@/lib/api/routers/enrollment";

const apiHandler = new OpenAPIHandler(
  {
    subject: subjectRouter,
    academicTerm: academicTermRouter,
    course: courseRouter,
    module: moduleRouter,
    lesson: lessonRouter,
    classroom: classroomRouter,
    classSchedule: classScheduleRouter,
    classAttendance: classAttendanceRouter,
    enrollment: enrollmentRouter,
  },
  {
    plugins: [
      new OpenAPIReferencePlugin({
        docsProvider: "scalar",
        schemaConverters: [new ZodToJsonSchemaConverter()],
        specGenerateOptions: {
          info: {
            title: "Acontia API",
            version: "1.0.0",
          },
        },
      }),
    ],
    interceptors: [
      onError((error) => {
        console.error(error);
      }),
    ],
  },
);

async function handleRequest(req: NextRequest) {
  const apiResult = await apiHandler.handle(req, {
    prefix: "/api",
  });
  if (apiResult.response) return apiResult.response;

  return new Response("Not found", { status: 404 });
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;

