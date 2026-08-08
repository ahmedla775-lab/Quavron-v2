import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../../components/auth/AuthProvider";
import { can } from "../../security/AccessControl";

import AdminVerificationService from "../../services/admin/AdminVerificationService";

import VerificationRequestCard from "../../components/admin/verification/VerificationRequestCard";
import VerificationDetailsDialog from "../../components/admin/verification/VerificationDetailsDialog";

export default function VerificationManagement() {
  const { profile } = useAuth();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  async function loadRequests() {
    setLoading(true);

    const { data, error } =
      await AdminVerificationService.getRequests();
      console.log("Verification requests result:", { data, error });
      console.log("First verification request:", data?.[0]);

    if (error) {
      console.error("Failed to load verification requests:", error);
    }

    setRequests(data || []);
    setLoading(false);
  }

  useEffect(() => {
    if (profile) {
      loadRequests();
    }
  }, [profile]);

  if (!can(profile, "verificationReview")) {
    return <Navigate to="/admin" replace />;
  }

  function handleReview(request) {
    setSelectedRequest(request);
    setDetailsDialogOpen(true);
  }

  function handleCloseDetails() {
    setDetailsDialogOpen(false);
    setSelectedRequest(null);
  }

  async function handleUpdated() {
    handleCloseDetails();
    await loadRequests();
  }

  return (
    <>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">
          Verification Requests
        </h1>

        {loading ? (
          <div className="rounded-2xl bg-slate-900 p-8 text-center text-slate-400">
            Loading...
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-2xl bg-slate-900 p-8 text-center text-slate-400">
            No verification requests.
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <VerificationRequestCard
                key={request.id}
                request={request}
                onOpen={handleReview}
              />
            ))}
          </div>
        )}
      </div>

      <VerificationDetailsDialog
        open={detailsDialogOpen}
        request={selectedRequest}
        onClose={handleCloseDetails}
        onUpdated={handleUpdated}
      />
    </>
  );
}
