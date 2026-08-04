import { useState, ChangeEvent, FormEvent } from "react";
import { createMarketingOfficer } from "../../api/marketingOfficerApi";
import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface MarketingOfficerFormProps {
  onClose: () => void;
  onSubmit: (result: any) => void;
  initialData?: {
    fullName: string;
    mobileNumber: string;
    branchName: string;
    profileImage?: string;
  };
}

const MarketingOfficerForm: React.FC<MarketingOfficerFormProps> = ({
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    fullName: initialData?.fullName || "",
    mobileNumber: initialData?.mobileNumber || "",
    branchName: initialData?.branchName || "",
    profileImage: initialData?.profileImage || "",
    password: "",
  });

  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);

  const branches = [
    "Head Office - Colombo",
    "Badulla",
    "Welimada",
    "Dambulla",
    "Mannar",
    "Chenkalady",
    "Muthur",
    "Nelliady",
    "Mahiyanganaya",
    "Polonnaruwa",
    "Thissamaharama",
    "Trincomalee",
    "Vavunathivu",
    "Kinniya",
    "Chunnakam",
    "Kaluwanchikudy",
    "Dehiattakandiya",
    "Batticaloa",
    "Vavuniya",
    "Ampara",
  ];

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError("Full Name is required.");
      return false;
    }

    if (!/^[0-9]{10}$/.test(formData.mobileNumber)) {
      setError("Mobile Number must be a valid 10-digit number.");
      return false;
    }

    if (!formData.branchName.trim()) {
      setError("Branch Name is required.");
      return false;
    }

    if (!initialData && !formData.password.trim()) {
      setError("Password is required.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    try {
      setIsLoading(true);

      if (!initialData) {
        const response = await createMarketingOfficer(formData);

        if (!response.success) {
          throw new Error(response.message || "Failed to create officer.");
        }

        onSubmit(response.data);
      } else {
        onSubmit(formData);
      }

      onClose();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-gray-900">
            {initialData ? "Edit Marketing Officer" : "Add New Marketing Officer"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {initialData
              ? "Update marketing officer details"
              : "Create a new marketing officer account"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-100 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              className="w-full bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg py-3 px-4 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none"
              required
            />
          </div>

          {/* Mobile */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Mobile Number
            </label>
            <input
              type="text"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              maxLength={10}
              placeholder="07XXXXXXXX"
              className="w-full bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg py-3 px-4 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none"
              required
            />
          </div>

          {/* Branch */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Branch Name
            </label>
            <select
              name="branchName"
              value={formData.branchName}
              onChange={handleChange}
              className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none"
              required
            >
              <option value="">Select Branch</option>
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>

          {/* Password */}
          {!initialData && (
            <div className="mb-5 relative">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg py-3 px-4 pr-12 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none"
                required
              />

              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-10 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2.5 rounded-lg font-medium transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-5 py-2.5 rounded-lg font-medium transition"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MarketingOfficerForm;