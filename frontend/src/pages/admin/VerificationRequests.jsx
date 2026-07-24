import { useEffect, useMemo, useState } from "react";

import AdminVerificationService from "../../services/admin/AdminVerificationService";

import VerificationRequestCard from "../../components/admin/verification/VerificationRequestCard";
import VerificationDetailsDialog from "../../components/admin/verification/VerificationDetailsDialog";

export default function VerificationRequests() {

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const [selected, setSelected] = useState(null);

  async function loadRequests() {

    setLoading(true);

    const { data, error } =
      await AdminVerificationService.getRequests();

    if (!error) {
      setRequests(data || []);
    }

    setLoading(false);

  }

  useEffect(() => {
    loadRequests();
  }, []);

  const filtered = useMemo(() => {

    return requests.filter((item) => {

      const profile = item.profiles || {};

      const matchSearch =
        (profile.full_name || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        (profile.username || "")
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchStatus =
        status === "all"
          ? true
          : item.status === status;

      return matchSearch && matchStatus;

    });

  }, [requests, search, status]);

  return (

    <div className="mx-auto max-w-7xl p-8">

      <h1 className="mb-8 text-4xl font-bold text-white">

        Verification Requests

      </h1>

      <div className="mb-8 flex flex-wrap gap-4">

        <input
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          placeholder="Search..."
          className="rounded-xl bg-slate-800 p-3 text-white outline-none"
        />

        <select
          value={status}
          onChange={(e)=>setStatus(e.target.value)}
          className="rounded-xl bg-slate-800 p-3 text-white"
        >

          <option value="all">All</option>

          <option value="pending">Pending</option>

          <option value="approved">Approved</option>

          <option value="rejected">Rejected</option>

        </select>

      </div>

      {loading ? (

        <p className="text-slate-400">

          Loading...

        </p>

      ) : (

        <div className="grid gap-6">

          {filtered.map((request)=>(

            <VerificationRequestCard

              key={request.id}

              request={request}

              onOpen={()=>
                setSelected(request)
              }

            />

          ))}

        </div>

      )}

      <VerificationDetailsDialog

        request={selected}

        open={!!selected}

        onClose={()=>
          setSelected(null)
        }

        onUpdated={loadRequests}

      />

    </div>

  );

}
