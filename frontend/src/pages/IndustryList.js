import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import API from "../api";
import PageFooter from "../components/PageFooter";

const PAGE_SIZE = 8;

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default function IndustryList() {
  const [employees, setEmployees] = useState([]);
  const [filters, setFilters] = useState({
    industry: "",
    sub_industry: "",
    skill: "",
    sub_county: "",
    ward: "",
  });
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

  const filteredEmployees = [...employees]
    .filter((employee) =>
      Object.entries(filters).every(([key, value]) =>
        (employee[key] || "").toLowerCase().includes(value.trim().toLowerCase())
      )
    )
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

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
                Public Directory
              </p>
              <h1 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
                Industry Directory
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Filter the county database by industry, skill, and location to find the right
                professional faster.
              </p>
            </div>

            <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
              Matching professionals: {filteredEmployees.length}
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <input
              name="industry"
              placeholder="Industry"
              value={filters.industry}
              onChange={handleFilterChange}
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
            <input
              name="sub_industry"
              placeholder="Sub industry"
              value={filters.sub_industry}
              onChange={handleFilterChange}
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
            <input
              name="skill"
              placeholder="Skill"
              value={filters.skill}
              onChange={handleFilterChange}
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
            <input
              name="sub_county"
              placeholder="Sub county"
              value={filters.sub_county}
              onChange={handleFilterChange}
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
            <input
              name="ward"
              placeholder="Ward"
              value={filters.ward}
              onChange={handleFilterChange}
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>
        </section>

        {isLoading ? (
          <div className="mt-6 rounded-[2rem] bg-white p-8 text-center text-slate-500 shadow-sm ring-1 ring-slate-200">
            Loading professionals...
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="mt-6 rounded-[2rem] bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">No matching results</h2>
            <p className="mt-2 text-sm text-slate-600">
              Adjust one or more filters to widen the search and explore more professionals.
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
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
                        {employee.id}
                      </p>
                      <h2 className="mt-2 text-lg font-semibold text-slate-900">{employee.skill}</h2>
                      <p className="mt-1 text-sm text-slate-600">{employee.industry}</p>
                    </div>
                    <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                      {formatDate(employee.createdAt)}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Sub industry</p>
                      <p className="mt-1 font-medium text-slate-800">{employee.sub_industry}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Experience</p>
                      <p className="mt-1 font-medium text-slate-800">{employee.experience}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Sub county</p>
                      <p className="mt-1 font-medium text-slate-800">{employee.sub_county}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Ward</p>
                      <p className="mt-1 font-medium text-slate-800">{employee.ward}</p>
                    </div>
                  </div>

                  <a
                    href={`tel:${employee.mobile}`}
                    className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3 font-medium text-white transition hover:bg-emerald-700"
                  >
                    Contact {employee.mobile}
                  </a>
                </article>
              ))}
            </div>

            <div className="mt-6 hidden overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-200 xl:block">
              <div className="overflow-x-auto">
                <table className="min-w-[1100px] divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr className="text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                      <th className="px-5 py-4">
                        <button type="button" onClick={() => handleSort("id")}>
                          Unique ID
                        </button>
                      </th>
                      <th className="px-5 py-4">
                        <button type="button" onClick={() => handleSort("industry")}>
                          Industry
                        </button>
                      </th>
                      <th className="px-5 py-4">Sub Industry</th>
                      <th className="px-5 py-4">
                        <button type="button" onClick={() => handleSort("skill")}>
                          Skill
                        </button>
                      </th>
                      <th className="px-5 py-4">Sub County</th>
                      <th className="px-5 py-4">Ward</th>
                      <th className="px-5 py-4">Experience</th>
                      <th className="px-5 py-4">
                        <button type="button" onClick={() => handleSort("createdAt")}>
                          Created
                        </button>
                      </th>
                      <th className="px-5 py-4">Contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedData.map((employee) => (
                      <tr key={employee._id} className="text-sm text-slate-700">
                        <td className="px-5 py-4 font-medium text-slate-900">{employee.id}</td>
                        <td className="px-5 py-4">{employee.industry}</td>
                        <td className="px-5 py-4">{employee.sub_industry}</td>
                        <td className="px-5 py-4 font-medium text-slate-900">{employee.skill}</td>
                        <td className="px-5 py-4">{employee.sub_county}</td>
                        <td className="px-5 py-4">{employee.ward}</td>
                        <td className="px-5 py-4">{employee.experience}</td>
                        <td className="px-5 py-4">{formatDate(employee.createdAt)}</td>
                        <td className="px-5 py-4">
                          <a
                            href={`tel:${employee.mobile}`}
                            className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-2 font-medium text-emerald-700 transition hover:bg-emerald-100"
                          >
                            {employee.mobile}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 rounded-[1.75rem] bg-white px-5 py-4 shadow-sm ring-1 ring-slate-200 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-slate-600">
                Page {currentPage} of {totalPages}
              </p>
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
