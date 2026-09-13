const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const req = async (url, opt = {}) => {
  const headers = opt.headers || {};

  // Don't set Content-Type for FormData, let browser set it
  if (!(opt.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const r = await fetch(API + url, { ...opt, headers });

    if (!r.ok) {
      const text = await r.text();
      console.error(`API Error [${r.status}]:`, text);
      throw new Error(text || `Request failed with status ${r.status}`);
    }

    const contentType = r.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      return r.json();
    }
    return r;
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
};

export const getTravels = () => req("/travelling");

export const getTravelBySlug = (slug) =>
  req("/travelling/slug/" + encodeURIComponent(slug));

export const getImages = (id) => req(`/travelling/${id}/images`);

export const createTravel = (data) =>
  req("/travelling", { method: "POST", body: data });

export const uploadImage = (id, file) => {
  const formData = new FormData();
  formData.append("file", file);
  return req(`/travelling/${id}/images`, { method: "POST", body: formData });
};

export const deleteTravel = (id) =>
  req(`/travelling/${id}`, { method: "DELETE" });

export const deleteImage = (id) => req(`/images/${id}`, { method: "DELETE" });

export const validateAccess = (emailId) =>
  req("/permissions/validate", {
    method: "POST",
    body: JSON.stringify({ emailId }),
  });

export const getPendingRequests = () =>
  req("/permissions/requests", { method: "GET" });

export const approvePermission = (id) =>
  req(`/permissions/${id}/approve`, { method: "POST" });
