import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { onError } from "@orpc/server";
import { NextRequest } from "next/server";
import { subjectRouter } from "@/lib/api/routers/subject";
import { academicTermRouter } from "@/lib/api/routers/academic-term";

const apiHandler = new OpenAPIHandler(
  {
    subject: subjectRouter,
    academicTerm: academicTermRouter,
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

