import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "./core";

// Ensure the client points to our custom API route at /api/storage
export const { useUploadThing, uploadFiles } =
	generateReactHelpers<OurFileRouter>({
		url: "/api/storage",
	});
