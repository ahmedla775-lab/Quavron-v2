import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../components/auth/AuthProvider";
import { can } from "../../security/AccessControl";

import AdminVerificationService from "../../services/admin/AdminVerificationService";

import VerificationRequestCard from "../../components/admin/verification/VerificationRequestCard";
import VerificationApproveDialog from "../../components/admin/verification/VerificationApproveDialog";

export default function VerificationManagement() {
  const { profile } = useAuth();

  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedRequest, setSelectedRequest] =
    useState(null);

  const [approveDialogOpen, setApproveDialogOpen] =
    useState(false);


  async function loadRequests() {

    setLoading(true);

    const { data } =
      await AdminVerificationService.getRequests();

    setRequests(data || []);

    setLoading(false);

  }

  useEffect(() => {

    loadRequests();

  }, []);

    if (!can(profile, "verificationReview")) {
      return <Navigate to="/admin" replace />;
    }

  function handleApprove(request) {

    setSelectedRequest(request);

    setApproveDialogOpen(true);

  }

  async function confirmApprove(type) {

    const { error } = await AdminVerificationService.approve(
        selectedRequest.id,
        type
      );

      if (error) {
        alert(error.message);
        return;
      }

    setApproveDialogOpen(false);

    setSelectedRequest(null);

    await loadRequests();

  }

  async function handleReject(request) {

    const reason =
      prompt("Reason", "");

    if (reason === null) return;

    const { error } = await AdminVerificationService.reject(
        request.id,
        reason
      );

      if (error) {
        alert(error.message);
        return;
      }

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

                onApprove={handleApprove}

                onReject={handleReject}

              />

            ))}

          </div>

        )}

      </div>

      <VerificationApproveDialog

        open={approveDialogOpen}

        onClose={() => {

          setApproveDialogOpen(false);

          setSelectedRequest(null);

        }}

        onApprove={confirmApprove}

      />

    </>

  );

}
