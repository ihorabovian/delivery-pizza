import { NextRequest, NextResponse } from "next/server";

const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY;

export async function GET(request: NextRequest) {
  const text = request.nextUrl.searchParams.get("text")?.trim();

  if (!text) {
    return NextResponse.json({ results: [] });
  }

  // Toronto coordinates, used to bias results toward Canada's most populous city
  const TORONTO_LON = -79.3832;
  const TORONTO_LAT = 43.6532;

  const url = new URL("https://api.geoapify.com/v1/geocode/autocomplete");
  url.searchParams.set("text", text);
  url.searchParams.set("format", "json");
  url.searchParams.set("filter", "countrycode:ca");
  url.searchParams.set("bias", `proximity:${TORONTO_LON},${TORONTO_LAT}`);
  url.searchParams.set("apiKey", GEOAPIFY_API_KEY ?? "");

  const response = await fetch(url);

  if (!response.ok) {
    return NextResponse.json(
      { results: [] },
      { status: response.status },
    );
  }

  const data = await response.json();

  return NextResponse.json({ results: data.results ?? [] });
}
