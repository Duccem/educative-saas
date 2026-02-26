import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { defaultLocale, locales } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const cookieLocale = (await cookies()).get("NEXT_LOCALE")?.value;
  const requested = await requestLocale;
  const locale = hasLocale(locales, cookieLocale)
    ? cookieLocale
    : hasLocale(locales, requested)
      ? requested
      : defaultLocale;

  return {
    locale,
    messages: (await import(`./locales/${locale}.json`)).default,
    timeZone: "America/Caracas",
  };
});

