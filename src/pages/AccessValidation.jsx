import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateAccess } from "../services/api";

const STORAGE_KEY = "travelGalleryAccess";

export default function AccessValidation() {
  const navigate = useNavigate();
  const [emailId, setEmailId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    const trimmedEmail = emailId.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await validateAccess(trimmedEmail);

      if (!result.isApproved) {
        setSubmitted(true);
        setSubmittedEmail(trimmedEmail);
        setEmailId("");
        return;
      }

      const access = {
        emailId: result.emailId,
        role: result.role,
        canAccessAdmin: result.canAccessAdmin,
        createdAt: Date.now(),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(access));
      navigate("/home", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to validate access request.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="access-page">
        <section className="access-card glass-card">
          <small>WAITING FOR APPROVAL</small>
          <h1>Request Submitted</h1>
          <p>
            Your access request for <strong>{submittedEmail}</strong> has been
            submitted.
          </p>
          <p style={{ marginTop: "24px", color: "var(--text-secondary)" }}>
            ⏳ Please wait for the admin to approve your request. Once approved,
            you'll be able to access the gallery.
          </p>

          <button
            onClick={() => setSubmitted(false)}
            className="access-form"
            style={{ marginTop: "32px" }}
          >
            Submit Another Request
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="access-page">
      <section className="access-card glass-card">
        <small>ACCESS REQUEST</small>
        <h1>Request permission to view the gallery</h1>
        <p>
          Enter your email to request access. Admin will review your request and
          approve it. Once approved, you can view the gallery.
        </p>

        <form onSubmit={submit} className="access-form">
          <label>
            Email address
            <input
              type="email"
              value={emailId}
              onChange={(event) => setEmailId(event.target.value)}
              placeholder="name@example.com"
              disabled={loading}
            />
          </label>

          {error && <div className="error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "Submitting request..." : "Request access"}
          </button>
        </form>
      </section>
    </main>
  );
}
