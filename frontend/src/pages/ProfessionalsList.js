import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import API, { buildAssetUrl } from "../api";
import PageFooter from "../components/PageFooter";

const PAGE_SIZE = 8;

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "NA";

export default function ProfessionalsList() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await API.get("/employee/getAllEmployee");
        setEmployees(res.data.employees || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load professionals");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const query = search.trim().toLowerCase();
  const filteredEmployees = [...employees]
    .filter((emp) => {
      if (!query) {
        return true;
      }

      return [
        emp.id,
        emp.name,
        emp.email,
        emp.mobile,
        emp.industry,
        emp.sub_industry,
        emp.skill,
        emp.sub_county,
        emp.ward,
      ]
        .filter(Boolean)
        .some((value) => value.toString().toLowerCase().includes(query));
    })
    .sort((a, b) => {
      const aValue = (a[sortConfig.key] ?? "").toString().toLowerCase();
      const bValue = (b[sortConfig.key] ?? "").toString().toLowerCase();

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }

      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }

      return 0;
    });

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / PAGE_SIZE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedData = filteredEmployees.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    const shouldDelete = window.confirm("Delete this professional from the databank?");
    if (!shouldDelete) {
      return;
    }

    try {
      const res = await API.delete(`/employee/deleteEmployee/${id}`);

      if (res.data.success) {
        setEmployees((prev) => prev.filter((employee) => employee._id !== id));
        toast.success("Professional deleted successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete professional");
    }
  };

  const pageSummary = `Page ${currentPage} of ${totalPages}`;

  return (
    <div className="min-h-screen bg-slate-100">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
                Admin Workspace
              </p>
              <h1 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
                Professionals Database
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Review, search, and maintain registered county professionals from one responsive
                dashboard.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                Total records: {filteredEmployees.length}
              </div>
              <Link
                to="/create-professional"
                className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
              >
                Create Professional
              </Link>
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="professional-search" className="mb-2 block text-sm font-medium text-slate-700">
              Search by name, skill, location, or contact
            </label>
            <input
              id="professional-search"
              type="text"
              placeholder="Search the county databank"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>
        </section>

        {isLoading ? (
          <div className="mt-6 rounded-[2rem] bg-white p-8 text-center text-slate-500 shadow-sm ring-1 ring-slate-200">
            Loading professionals...
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="mt-6 rounded-[2rem] bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">No professionals found</h2>
            <p className="mt-2 text-sm text-slate-600">
              Try adjusting the search term or add a new professional to the databank.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-4 xl:hidden">
              {paginatedData.map((employee) => (
                <article
                  key={employee._id}
                  className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-slate-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-4">
                      {employee.image ? (
                        <img
                          src={buildAssetUrl(employee.image)}
                          alt={employee.name}
                          className="h-14 w-14 rounded-2xl object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 font-semibold text-emerald-800">
                          {getInitials(employee.name)}
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-lg font-semibold text-slate-900">{employee.name}</p>
                        <p className="truncate text-sm text-slate-500">{employee.email}</p>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
                          {employee.id}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                      {formatDate(employee.createdAt)}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Industry</p>
                      <p className="mt-1 font-medium text-slate-800">{employee.industry}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Skill</p>
                      <p className="mt-1 font-medium text-slate-800">{employee.skill}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Location</p>
                      <p className="mt-1 font-medium text-slate-800">
                        {employee.sub_county}, {employee.ward}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Contact</p>
                      <p className="mt-1 font-medium text-slate-800">{employee.mobile}</p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <Link
                      to={`/update-professional/${employee._id}`}
                      className="inline-flex items-center justify-center rounded-2xl border border-emerald-200 px-4 py-3 font-medium text-emerald-700 transition hover:bg-emerald-50"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(employee._id)}
                      className="inline-flex items-center justify-center rounded-2xl bg-rose-600 px-4 py-3 font-medium text-white transition hover:bg-rose-700"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-6 hidden overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-200 xl:block">
              <div className="overflow-x-auto">
                <table className="min-w-[1200px] divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr className="text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                      <th className="px-5 py-4">
                        <button type="button" onClick={() => handleSort("id")}>
                          Unique ID
                        </button>
                      </th>
                      <th className="px-5 py-4">Image</th>
                      <th className="px-5 py-4">
                        <button type="button" onClick={() => handleSort("name")}>
                          Name
                        </button>
                      </th>
                      <th className="px-5 py-4">
                        <button type="button" onClick={() => handleSort("email")}>
                          Email
                        </button>
                      </th>
                      <th className="px-5 py-4">Mobile</th>
                      <th className="px-5 py-4">Industry</th>
                      <th className="px-5 py-4">Sub Industry</th>
                      <th className="px-5 py-4">Skill</th>
                      <th className="px-5 py-4">Sub County</th>
                      <th className="px-5 py-4">Ward</th>
                      <th className="px-5 py-4">Experience</th>
                      <th className="px-5 py-4">
                        <button type="button" onClick={() => handleSort("createdAt")}>
                          Created
                        </button>
                      </th>
                      <th className="px-5 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedData.map((employee) => (
                      <tr key={employee._id} className="text-sm text-slate-700">
                        <td className="px-5 py-4 font-medium text-slate-900">{employee.id}</td>
                        <td className="px-5 py-4">
                          {employee.image ? (
                            <img
                              src={buildAssetUrl(employee.image)}
                              alt={employee.name}
                              className="h-12 w-12 rounded-2xl object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 font-semibold text-emerald-800">
                              {getInitials(employee.name)}
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-4 font-medium text-slate-900">{employee.name}</td>
                        <td className="px-5 py-4 text-emerald-700">{employee.email}</td>
                        <td className="px-5 py-4">{employee.mobile}</td>
                        <td className="px-5 py-4">{employee.industry}</td>
                        <td className="px-5 py-4">{employee.sub_industry}</td>
                        <td className="px-5 py-4">{employee.skill}</td>
                        <td className="px-5 py-4">{employee.sub_county}</td>
                        <td className="px-5 py-4">{employee.ward}</td>
                        <td className="px-5 py-4">{employee.experience}</td>
                        <td className="px-5 py-4">{formatDate(employee.createdAt)}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <Link
                              to={`/update-professional/${employee._id}`}
                              className="font-medium text-emerald-700 hover:text-emerald-800"
                            >
                              Edit
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDelete(employee._id)}
                              className="font-medium text-rose-600 hover:text-rose-700"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 rounded-[1.75rem] bg-white px-5 py-4 shadow-sm ring-1 ring-slate-200 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-slate-600">{pageSummary}</p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      <PageFooter />
    </div>
  );
}
