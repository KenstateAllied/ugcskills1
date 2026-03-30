import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API, { buildAssetUrl } from "../api";
import toast from "react-hot-toast";
import PageFooter from "../components/PageFooter";

const createEmptyForm = () => ({
  name: "",
  email: "",
  mobile: "",
  industry: "",
  sub_industry: "",
  skill: "",
  sub_county: "",
  ward: "",
  experience: "",
  image: null,
});

export default function CreateEmployee({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();

  /* --------------------------------
     Industry → SubIndustry → Skills
  -------------------------------- */

  const industryData = {

  
  "Agriculture, Mining & Natural Resources": {
    "Aquaculture_Fisheries": [
      "Fish Farming",
      "Fish Processing",
      "Fishing Operations"
    ],
    "Crop Production": [
      "Cash Crop Farming",
      "Cereal Farming",
      "Fruit Farming",
      "Vegetable Farming"
    ],
    "Forestry": [
      "Charcoal Production",
      "Logging",
      "Timber Harvesting"
    ],
    "Livestock Farming": [
      "Beef Cattle Farming",
      "Dairy Farming",
      "Goat Farming",
      "Poultry Farming",
      "Sheep Farming"
    ],
    "Mining": [
      "Coal Mining",
      "Gold Mining",
      "Quarrying",
      "Sand Harvesting"
    ]
  },

  "Business, Finance & Management": {
    "Administration": [
      "Clerical Work",
      "Office Administration",
      "Records Management"
    ],
    "Finance": [
      "Accounting",
      "Auditing",
      "Budgeting",
      "Tax Preparation"
    ],
    "Human Resource Management": [
      "Employee Relations",
      "Payroll Management",
      "Recruitment"
    ],
    "Management": [
      "Operations Management",
      "Project Management",
      "Strategic Planning"
    ]
  },

  "Construction & Infrastructure": {
    "Electrical": [
      "CCTV Installation",
      "Electrical Installation",
      "Solar Installation"
    ],
    "Masonry": [
      "Bricklaying",
      "Painting & Decorating",
      "Steel Fixing",
      "Tiling"
    ],
    "Plumbing": [
      "Pipe Fitting",
      "Plumbing Installation",
      "Water System Maintenance"
    ],
    "Woodwork": [
      "Cabinet Making",
      "Ceiling Installation",
      "Roofing"
    ]
  },

  "Education & Training": {
    "Early Childhood Education": [
      "Child Care",
      "Playgroup Teaching"
    ],
    "Primary & Secondary Education": [
      "Classroom Teaching",
      "Curriculum Development",
      "Student Assessment"
    ],
    "Technical & Vocational Training": [
      "Apprenticeship Training",
      "Skills Instruction"
    ]
  },

  "Engineering & Manufacturing": {
    "Mechanical Engineering": [
      "Machine Maintenance",
      "Mechanical Design",
      "Welding"
    ],
    "Production Engineering": [
      "Process Optimization",
      "Production Planning"
    ]
  },

  "Energy & Utilities": {
    "Electrical Utilities": [
      "Grid Maintenance",
      "Power Distribution"
    ],
    "Renewable Energy": [
      "Hydropower Maintenance",
      "Solar Installation",
      "Wind Turbine Maintenance"
    ]
  },

  "Financial Services & Banking": {
    "Banking Operations": [
      "Customer Service",
      "Teller Operations"
    ],
    "Credit & Loans": [
      "Credit Analysis",
      "Loan Processing"
    ],
    "Insurance": [
      "Claims Processing",
      "Underwriting"
    ]
  },

  "Government & Public Administration": {
    "Public Administration": [
      "Policy Implementation",
      "Public Service Delivery",
      "Reporting"
    ],
    "Regulation & Compliance": [
      "Inspection",
      "Licensing",
      "Regulatory Enforcement"
    ]
  },

  "Hair Dressing & Beauty Services": {
    "Beauty Therapy": [
      "Facials",
      "Makeup Application",
      "Manicure & Pedicure"
    ],
    "Hairdressing": [
      "Barbering",
      "Hair Coloring",
      "Hair Styling",
      "Hair Treatment"
    ]
  },

  "Healthcare & Social Services": {
    "Clinical Services": [
      "Diagnosis",
      "Nursing",
      "Patient Care"
    ],
    "Community Health": [
      "Health Education",
      "Outreach Programs"
    ],
    "Social Work": [
      "Counseling",
      "Case Management"
    ]
  },

  "Hospitality, Tourism & Food Services": {
    "Food & Beverage": [
      "Cooking",
      "Food Preparation",
      "Waitstaff Service"
    ],
    "Housekeeping": [
      "Cleaning",
      "Laundry Services"
    ],
    "Tourism": [
      "Tour Guiding",
      "Travel Planning"
    ]
  },

  "Manufacturing & Production": {
    "Assembly": [
      "Assembly Line Work",
      "Component Fitting"
    ],
    "Quality Control": [
      "Inspection",
      "Testing"
    ],
    "Packaging": [
      "Labeling",
      "Packing"
    ]
  },

  "Marketing & Creative Arts": {
    "Creative Design": [
      "Graphic Design",
      "Illustration"
    ],
    "Digital Marketing": [
      "Content Creation",
      "Social Media Management",
      "SEO"
    ],
    "Market Research": [
      "Data Collection",
      "Survey Analysis"
    ]
  },

  "Media, Arts & Entertainment": {
    "Film & Video": [
      "Acting",
      "Video Editing",
      "Videography"
    ],
    "Music": [
      "Music Production",
      "Sound Engineering"
    ],
    "Photography": [
      "Photo Editing",
      "Photography"
    ]
  },

  "Professional Services & Consulting": {
    "Business Consulting": [
      "Business Strategy",
      "Process Improvement"
    ],
    "Research & Analysis": [
      "Data Analysis",
      "Report Writing"
    ]
  },

  "Retail, Wholesale & E-Commerce": {
    "E-Commerce": [
      "Online Store Management",
      "Order Fulfillment"
    ],
    "Retail Sales": [
      "Customer Service",
      "Sales",
      "Stock Management"
    ],
    "Wholesale": [
      "Bulk Distribution",
      "Inventory Management"
    ]
  },

  "Security": {
    "Physical Security": [
      "Access Control",
      "Guard Services",
      "Surveillance"
    ],
    "Security Systems": [
      "Alarm Installation",
      "CCTV Monitoring"
    ]
  },

  "Technology & Information Technology": {
    "IT Support": [
      "Help Desk Support",
      "System Troubleshooting"
    ],
    "Software Development": [
      "Application Development",
      "Web Development"
    ],
    "Systems & Networks": [
      "Cybersecurity",
      "Database Management",
      "Network Administration"
    ]
  },

  "Telecommunications": {
    "Infrastructure": [
      "Fiber Installation",
      "Tower Maintenance"
    ],
    "Network Services": [
      "Network Configuration",
      "Signal Processing"
    ]
  },

  "Transportation & Logistics": {
    "Logistics": [
      "Logistics Planning",
      "Warehouse Management"
    ],
    "Transportation": [
      "Delivery Driving",
      "Fleet Management"
    ]
  }


  };




  /* --------------------------------
     Ward Options
  -------------------------------- */

  const wardOptions = {
    Ainabkoi: ["Ainabkoi/Olare", "Kapsoya", "Kaptagat"],
    Kapseret: ["Kipkenyo", "Langas", "Megun", "Ngeria", "Simat/Kapseret"],
    Kesses: ["Cheptiret/Kipchamo", "Racecourse", "Tarakwa", "Tulwet/Chuiyat"],
    Moiben: ["Karuna/Meibeki", "Kimumu", "Moiben", "Sergoit", "Tembelio"],
    Soy: [
      "Kapkures",
      "Kipsomba",
      "Kuinet/Kapsuswa",
      "Mois Bridge",
      "Segero/Barsombe",
      "Soy",
      "Ziwa",
    ],
    Turbo: [
      "Huruma",
      "Kamagut",
      "Kapsaos",
      "Kiplombe",
      "Ngenyilel",
      "Tapsagoi",
    ],
  };

  /* --------------------------------
     Form State
  -------------------------------- */

  const [formData, setFormData] = useState(createEmptyForm);

  const [subIndustries, setSubIndustries] = useState([]);
  const [skills, setSkills] = useState([]);
  const [availableWards, setAvailableWards] = useState([]);
  const [submitError, setSubmitError] = useState("");

  /* --------------------------------
     Fetch Employee (Edit Mode)
  -------------------------------- */

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        if (mode === "edit" && id) {
          const res = await API.get(`/employee/getEmployeeById/${id}`);
          const emp = res?.data?.employee;

          setFormData({
            name: emp?.name || "",
            email: emp?.email || "",
            mobile: emp?.mobile || "",
            industry: emp?.industry || "",
            sub_industry: emp?.sub_industry || "",
            skill: emp?.skill || "",
            sub_county: emp?.sub_county || "",
            ward: emp?.ward || "",
            experience: emp?.experience || "",
            image: emp?.image || null,
          });

          if (emp.sub_county) {
            setAvailableWards(wardOptions[emp.sub_county] || []);
          }

          if (emp.industry) {
            const subs = Object.keys(industryData[emp.industry] || {});
            setSubIndustries(subs);
          }

          if (emp.sub_industry) {
            const skillsList =
              industryData[emp.industry]?.[emp.sub_industry] || [];
            setSkills(skillsList);
          }
        }
      } catch (error) {
        console.error("Failed to fetch employee:", error);
      }
    };

    fetchEmployee();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, id]);

  /* --------------------------------
     Handle Change
  -------------------------------- */

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      return;
    }

    setFormData((prev) => {
      let updated = { ...prev, [name]: value };

      /* Industry Change */
      if (name === "industry") {
        updated.sub_industry = "";
        updated.skill = "";

        const subs = Object.keys(industryData[value] || {});
        setSubIndustries(subs);
        setSkills([]);
      }

      /* Sub Industry Change */
      if (name === "sub_industry") {
        updated.skill = "";

        const skillList =
          industryData[updated.industry]?.[value] || [];

        setSkills(skillList);
      }

      /* Sub County Change */
      if (name === "sub_county") {
        updated.ward = "";
        setAvailableWards(wardOptions[value] || []);
      }

      return updated;
    });
  };

  /* --------------------------------
     Submit
  -------------------------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    try {
      const data = new FormData();
      const fields = [
        "name",
        "email",
        "mobile",
        "industry",
        "sub_industry",
        "skill",
        "sub_county",
        "ward",
        "experience",
      ];

      fields.forEach((field) => {
        data.append(field, formData[field] || "");
      });

      if (formData.image instanceof File) {
        data.append("image", formData.image);
      }

      if (mode === "edit") {
        const res = await API.put(
          `/employee/updateEmployee/${id}`,
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (res?.data?.success) {
          toast.success("Professional updated successfully!");
        }
      } else {
        const res = await API.post(
          "/employee/addEmployee",
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (res?.data?.success) {
          toast.success("Professional added successfully!");
        }
      }

      navigate("/ProfessionalsList");
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";
      toast.error(message);
      setSubmitError(message);
    }
  };

  /* --------------------------------
     UI
  -------------------------------- */

  const previewImage =
    typeof formData.image === "string"
      ? buildAssetUrl(formData.image)
      : formData.image
        ? URL.createObjectURL(formData.image)
        : "";

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-200">
          <div className="bg-gradient-to-r from-amber-300 via-amber-200 to-emerald-100 px-6 py-5">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-800">
              Admin Form
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">
              {mode === "create" ? "Create Professional" : "Update Professional"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-700">
              Capture county skills with clean, complete details so the directory stays easy to
              search and maintain.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-slate-50 p-6 sm:p-8"
          >

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              required
            />
          </div>

          {/* Mobile */}
         <div>
  <label className="mb-2 block text-sm font-medium text-slate-700">Mobile</label>
  <input
    type="text"
    name="mobile"
    value={formData.mobile}
    onChange={(e) => {
      const { name, value } = e.target;
      let updatedValue = value;

      // ✅ Only apply to mobile: keep leading zeros and max 10 digits
      if (name === "mobile") {
        updatedValue = value.replace(/\D/g, "").slice(0, 10);
      }

      setFormData((prev) => ({
        ...prev,
        [name]: updatedValue,
      }));
    }}
    pattern="[0-9]*"
    inputMode="numeric"
    placeholder="07XXXXXXXX"
    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
    required
  />
</div>

          {/* Industry */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Industry</label>
            <select
              name="industry"
              value={formData.industry || ""}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              required
            >
              <option value="">Select Industry</option>
              {Object.keys(industryData).map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          {/* Sub Industry */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Sub Industry</label>
            <select
              name="sub_industry"
              value={formData.sub_industry || ""}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              required
            >
              <option value="">Select Sub Industry</option>

              {subIndustries.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* Skill */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Skill</label>
            <select
              name="skill"
              value={formData.skill || ""}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              required
            >
              <option value="">Select Skill</option>

              {skills.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>

          {/* Sub County */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Sub County</label>
            <select
              name="sub_county"
              value={formData.sub_county || ""}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              required
            >
              <option value="">Select</option>

              {Object.keys(wardOptions).map((sc) => (
                <option key={sc} value={sc}>
                  {sc}
                </option>
              ))}
            </select>
          </div>

          {/* Ward */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Ward</label>
            <select
              name="ward"
              value={formData.ward || ""}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              required
            >
              <option value="">Select</option>

              {availableWards.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>

          {/* Experience */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Experience</label>
            <select
              name="experience"
              value={formData.experience || ""}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              required
            >
              <option value="">Select</option>
              <option value="Entry_Level">Entry Level</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Senior">Senior</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          {/* Image */}
          <div className="col-span-full grid gap-4 rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-slate-700">Image Upload</label>

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            {previewImage && (
              <div className="h-24 w-24 overflow-hidden rounded-2xl ring-1 ring-slate-200">
                <img
                  src={previewImage}
                  alt="preview"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>

        </div>

        {submitError && (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {submitError}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate("/ProfessionalsList")}
            className="rounded-2xl border border-slate-200 px-6 py-3 font-medium text-slate-700 transition hover:bg-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-2xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            {mode === "create" ? "Create" : "Update"}
          </button>
        </div>

          </form>
        </div>
      </div>

      <PageFooter />
    </div>
  );
}
