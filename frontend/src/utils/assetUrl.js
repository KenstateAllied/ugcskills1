const configuredBaseUrl = (process.env.REACT_APP_API_URL || "").trim().replace(/\/$/, "");

export const API_BASE_URL =
  configuredBaseUrl || (process.env.NODE_ENV === "development" ? "http://localhost:5000" : "");

export const buildAssetUrl = (assetPath = "") => {
  const normalizedPath = assetPath.replace(/\\/g, "/").replace(/^\/+/, "");

  if (!normalizedPath) {
    return "";
  }

  if (/^https?:\/\//i.test(normalizedPath)) {
    return normalizedPath;
  }

  if (!API_BASE_URL) {
    return `/${normalizedPath}`;
  }

  return `${API_BASE_URL}/${normalizedPath}`;
};
