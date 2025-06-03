import { useState, ChangeEvent, FormEvent } from "react";
import { createMarketingOfficer } from "../../api/marketingOfficerApi";
import React from "react";
import bcrypt from "bcryptjs";
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
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    if (!initialData && !formData.password.trim()) {
      setError("Password is required for new officers.");
      return false;
    }
    if (!initialData && !formData.branchName.trim()) {
      setError("Branch Name is required.");
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
    let resultData = { ...formData };

    if (!initialData) {
      const hashedPassword = await bcrypt.hash(formData.password, 10);
      resultData.password = hashedPassword;

      const response = await createMarketingOfficer(resultData);
      if (!response.success) throw new Error(response.message);
      onSubmit(response.data);
    } else {
      onSubmit(resultData);
    }

    onClose();
  } catch (err: any) {
    setError(err.message || "Something went wrong.");
  } finally {
    setIsLoading(false);
  }
};


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? "Edit Marketing Officer" : "Add New Marketing Officer"}
        </h2>

        {error && (
          <div className="mb-4 p-2 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="fullName"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="mobileNumber"
            >
              Mobile Number
            </label>
            <input
              type="text"
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-6 relative z-10">
            {" "}
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="branchName"
            >
              Branch Name
            </label>
            <select
              id="branchName"
              name="branchName"
              value={formData.branchName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
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

          <div className="mb-4 relative">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password (Optional)
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required={!initialData} 
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
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
