import { useEffect, useState } from "react";
import { getPendingRequests, approvePermission } from "../services/api";
import Spinner from "../components/Spinner";

export default function Permissions() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [approving, setApproving] = useState(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getPendingRequests();
      setRequests(data);
    } catch (err) {
      setError(err.message || "Failed to load permission requests");
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id) => {
    setApproving(id);
    try {
      await approvePermission(id);
      setRequests((prev) => prev.filter((req) => req.id !== id));
      await loadRequests();
    } catch (err) {
      setError(err.message || "Failed to approve request");
    } finally {
      setApproving(null);
    }
  };

  if (loading) {
    return (
      <main className="admin">
        <Spinner />
      </main>
    );
  }

  return (
    <main className="admin">
      <small>ACCESS MANAGEMENT</small>
      <h1>Permission Requests</h1>

      {error && <div className="error">{error}</div>}

      <div className="panel">
        <h2>Pending Requests ({requests.length})</h2>
        {requests.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>No pending requests</p>
        ) : (
          <div className="requests-list">
            {requests.map((req) => (
              <div className="request-row" key={req.id}>
                <div className="request-info">
                  <span className="email">{req.emailId}</span>
                  <span className="role">Role: {req.role}</span>
                </div>
                <button
                  onClick={() => approve(req.id)}
                  disabled={approving === req.id}
                  className="approve-btn"
                >
                  {approving === req.id ? "Approving..." : "Approve"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
