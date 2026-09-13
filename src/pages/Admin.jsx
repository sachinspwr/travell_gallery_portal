import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  createTravel,
  getTravels,
  uploadImage,
  deleteTravel,
  deleteImage,
  getImages,
} from "../services/api";
import { showToast, showAlert } from "../utils/toast";
import Spinner from "../components/Spinner";
export default function Admin() {
  const location = useLocation();
  const [t, setT] = useState([]),
    [title, setTitle] = useState(""),
    [slug, setSlug] = useState(""),
    [desc, setDesc] = useState(""),
    [cover, setCover] = useState(),
    [created, setCreated] = useState(),
    [files, setFiles] = useState([]),
    [msg, setMsg] = useState(""),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [creating, setCreating] = useState(false),
    [uploading, setUploading] = useState(false),
    [editingJourney, setEditingJourney] = useState(null),
    [editPhotos, setEditPhotos] = useState([]),
    [loadingPhotos, setLoadingPhotos] = useState(false),
    [deletingPhoto, setDeletingPhoto] = useState(null);

  const load = () => {
    setLoading(true);
    setError("");
    return getTravels()
      .then(setT)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [location.pathname]);

  const create = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const f = new FormData();
      f.append("title", title);
      f.append("slug", slug);
      f.append("description", desc);
      if (cover) f.append("cover", cover);
      const x = await createTravel(f);
      setCreated(x);
      setTitle("");
      setSlug("");
      setDesc("");
      setCover(null);
      showToast(`Journey "${x.title}" created successfully!`, "success");
      load();
    } catch (x) {
      showAlert("Error Creating Journey", x.message, "error");
    } finally {
      setCreating(false);
    }
  };

  const upload = async () => {
    if (!files || files.length === 0) {
      showAlert(
        "Please select files",
        "Select at least one photo to upload",
        "warning",
      );
      return;
    }
    setUploading(true);
    try {
      for (const f of files) await uploadImage(created.id, f);
      showToast(`Uploaded ${files.length} photo(s) successfully!`, "success");
      setFiles([]);
      load();
    } catch (x) {
      showAlert("Error Uploading Photos", x.message, "error");
    } finally {
      setUploading(false);
    }
  };

  const startEdit = async (journey) => {
    setEditingJourney(journey);
    setLoadingPhotos(true);
    try {
      const photos = await getImages(journey.id);
      setEditPhotos(photos);
    } catch (err) {
      showAlert("Error Loading Photos", err.message, "error");
    } finally {
      setLoadingPhotos(false);
    }
  };

  const cancelEdit = () => {
    setEditingJourney(null);
    setEditPhotos([]);
    setFiles([]);
  };

  const addMorePhotos = async () => {
    if (!files || files.length === 0) {
      showAlert(
        "Please select files",
        "Select at least one photo to upload",
        "warning",
      );
      return;
    }
    setUploading(true);
    try {
      for (const f of files) await uploadImage(editingJourney.id, f);
      showToast(`Added ${files.length} photo(s)!`, "success");
      setFiles([]);
      await startEdit(editingJourney);
      load();
    } catch (err) {
      showAlert("Error Adding Photos", err.message, "error");
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = async (photoId) => {
    setDeletingPhoto(photoId);
    try {
      await deleteImage(photoId);
      showToast("Photo deleted!", "success");
      setEditPhotos((prev) => prev.filter((p) => p.id !== photoId));
      load();
    } catch (err) {
      showAlert("Error Deleting Photo", err.message, "error");
    } finally {
      setDeletingPhoto(null);
    }
  };

  if (loading) {
    return (
      <main className="admin">
        <Spinner />
      </main>
    );
  }

  if (error) {
    return (
      <main className="admin">
        <div className="error">Error: {error}</div>
        <button onClick={load}>Retry</button>
      </main>
    );
  }

  return (
    <main className="admin">
      <small>PRIVATE ADMIN</small>
      <h1>Build your archive.</h1>
      <div className="admin-grid">
        {!created ? (
          <form className="panel" onSubmit={create}>
            <h2>1. Create journey</h2>
            <label>
              Title
              <input
                required
                value={title}
                disabled={creating}
                onChange={(e) => {
                  let v = e.target.value;
                  setTitle(v);
                  setSlug(
                    v
                      .toLowerCase()
                      .trim()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/(^-|-$)/g, ""),
                  );
                }}
              />
            </label>
            <label>
              Slug
              <input
                required
                value={slug}
                disabled={creating}
                onChange={(e) => setSlug(e.target.value)}
              />
            </label>
            <label>
              Description
              <textarea
                value={desc}
                disabled={creating}
                onChange={(e) => setDesc(e.target.value)}
              />
            </label>
            <label>
              Cover
              <input
                type="file"
                disabled={creating}
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setCover(e.target.files?.[0])}
              />
            </label>
            <button disabled={creating}>
              {creating && <span className="btn-spinner" aria-hidden />}
              {creating ? "Creating..." : "Create journey"}
            </button>
          </form>
        ) : (
          <div className="panel">
            <h2>2. Upload photos</h2>
            <p>
              Selected: <b>{created.title}</b>
            </p>
            <input
              type="file"
              multiple
              disabled={uploading}
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setFiles([...e.target.files])}
            />
            <p>{files.length} selected</p>
            <button disabled={uploading} onClick={upload}>
              {uploading && <span className="btn-spinner" aria-hidden />}
              {uploading ? "Uploading..." : "Upload photos"}
            </button>
          </div>
        )}
      </div>
      {editingJourney ? (
        <div className="panel">
          <div className="edit-header">
            <h2>Edit: {editingJourney.title}</h2>
            <button onClick={cancelEdit} className="cancel-btn">
              Back
            </button>
          </div>

          {loadingPhotos ? (
            <Spinner />
          ) : (
            <>
              <div className="photos-grid">
                {editPhotos.map((photo) => (
                  <div className="photo-item" key={photo.id}>
                    <img src={photo.url} alt={photo.fileName} />
                    <button
                      onClick={() => removePhoto(photo.id)}
                      disabled={deletingPhoto === photo.id}
                      className="delete-photo-btn"
                    >
                      {deletingPhoto === photo.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                ))}
              </div>

              <div className="add-more-section">
                <h3>Add More Photos</h3>
                <input
                  type="file"
                  multiple
                  disabled={uploading}
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setFiles([...e.target.files])}
                />
                <p>{files.length} selected</p>
                <button disabled={uploading} onClick={addMorePhotos}>
                  {uploading && <span className="btn-spinner" aria-hidden />}
                  {uploading ? "Adding..." : "Add Photos"}
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="panel">
          <h2>Existing journeys</h2>
          {t.map((x) => (
            <div className="row" key={x.id}>
              <div className="journey-info">
                <span>{x.title}</span>
                <span className="photo-count">{x.photoCount} photos</span>
              </div>
              <button onClick={() => startEdit(x)} className="edit-btn">
                Edit
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
