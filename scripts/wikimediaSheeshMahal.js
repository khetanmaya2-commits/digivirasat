const API_URL =
  "https://commons.wikimedia.org/w/api.php";

const params = new URLSearchParams({
  action: "query",
  generator: "search",
  gsrsearch: "Sheesh Mahal Amber Fort Jaipur",
  gsrnamespace: "6",
  gsrlimit: "20",
  prop: "imageinfo",
  iiprop: "url|extmetadata",
  iiurlwidth: "1200",
  format: "json",
  origin: "*",
});

function extractYear(dateValue) {
  if (!dateValue) return null;

  const match = String(dateValue).match(/\b(19|20)\d{2}\b/);

  return match ? match[0] : null;
}

function cleanMetadataValue(value) {
  if (!value) return null;

  return String(value)
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .trim();
}

function selectRepresentativePhotos(photos) {
  const groupedByYear = new Map();

  for (const photo of photos) {
    if (!photo.year) continue;

    if (!groupedByYear.has(photo.year)) {
      groupedByYear.set(photo.year, []);
    }

    groupedByYear.get(photo.year).push(photo);
  }

  return Array.from(groupedByYear.entries())
    .sort(([yearA], [yearB]) => Number(yearA) - Number(yearB))
    .map(([year, yearPhotos]) => {
      const representative = [...yearPhotos].sort((a, b) => {
        const aScore =
          (a.captureDate ? 2 : 0) +
          (a.latitude && a.longitude ? 1 : 0);

        const bScore =
          (b.captureDate ? 2 : 0) +
          (b.latitude && b.longitude ? 1 : 0);

        return bScore - aScore;
      })[0];

      return {
        ...representative,
        evidenceStatus: "candidate",
        evidenceCount: yearPhotos.length,
      };
    });
}

function isSheeshMahalPhoto(page, metadata) {
  const title = String(page.title || "").toLowerCase();

  const description =
    String(
      metadata.ImageDescription?.value || ""
    ).toLowerCase();

  const objectName =
    String(
      metadata.ObjectName?.value || ""
    ).toLowerCase();

  // Require an explicit Sheesh Mahal reference
  // in the file title, description, or object name.
  return (
    title.includes("sheesh mahal") ||
    description.includes("sheesh mahal") ||
    objectName.includes("sheesh mahal")
  );
}

async function fetchSheeshMahalPhotos() {
  const response = await fetch(
  `${API_URL}?${params.toString()}`,
  {
    headers: {
      "User-Agent":
        "DigiVirasat/2.0 (heritage research project; contact:mansikhetan205@gmail.com)",
    },
  }
);

  const data = await response.json();

  const pages = Object.values(
    data.query?.pages || {}
  );
const photos = pages
  .map((page) => {
    const imageInfo = page.imageinfo?.[0];

    if (!imageInfo) return null;

    const metadata =
      imageInfo.extmetadata || {};

    // Keep only photographs explicitly associated
    // with Sheesh Mahal.
    if (!isSheeshMahalPhoto(page, metadata)) {
      return null;
    }

    const captureDate =
      metadata.DateTimeOriginal?.value || null;

   const author =
  cleanMetadataValue(metadata.Artist?.value);

const description =
  cleanMetadataValue(
    metadata.ImageDescription?.value
  );

    const license =
      metadata.LicenseShortName?.value || null;

    const latitude =
      metadata.GPSLatitude?.value || null;

    const longitude =
      metadata.GPSLongitude?.value || null;

    return {
  title: page.title.replace(/^File:/, ""),

  imageUrl: imageInfo.url,

  sourceUrl:
    imageInfo.descriptionurl,

  captureDate,

  year: extractYear(captureDate),

  author,

  license,

  description,

  latitude,

  longitude,

  sourceType: "Wikimedia Commons",

  // This evidence is currently associated
  // with the broader Sheesh Mahal area.
  evidenceScope: "Sheesh Mahal",

  // Element-level mapping will be assigned
  // only after further verification.
  elementId: null,
  evidenceStatus: "candidate",
};
  })
  .filter(Boolean);

  const temporalEvidence = photos
  .filter(photo => photo.year)
  .sort((a, b) => Number(a.year) - Number(b.year));

  return photos;
}

fetchSheeshMahalPhotos()
  .then((photos) => {
    const temporalEvidence =
      selectRepresentativePhotos(photos);

    console.log(
      JSON.stringify(temporalEvidence, null, 2)
    );
  })