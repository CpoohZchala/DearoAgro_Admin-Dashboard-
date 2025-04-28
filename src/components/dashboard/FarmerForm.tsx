import { useState, ChangeEvent, FormEvent } from "react";
import { createFarmer, updateFarmer } from "../../api/farmerApi";
import React from "react";
import bcrypt from "bcryptjs";

interface FarmerFormProps {
  farmer?: {
    id: string;
    fullName: string;
    mobileNumber: string;
  };
  onClose: () => void;
  onSubmit: (result: any) => void;
}

const FarmerForm: React.FC<FarmerFormProps> = ({
  farmer,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    fullName: farmer?.fullName || "",
    mobileNumber: farmer?.mobileNumber || "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // In the handleSubmit function, ensure we're passing the correct ID
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const farmerData = {
        fullName: formData.fullName,
        mobileNumber: formData.mobileNumber,
      };

      let result;
      if (farmer && farmer.id) {
        // Explicitly check for farmer.id
        console.log("Updating farmer with ID:", farmer.id); // Debug log
        result = await updateFarmer(farmer.id, farmerData);
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(formData.password, salt);
        result = await createFarmer({
          ...farmerData,
          password: hashedPassword,
        });
      }

      if (!result.success) {
        throw new Error(result.message || "Failed to save farmer");
      }

      onSubmit(result.data);
    } catch (err: any) {
      console.error("Error in handleSubmit:", err); // More detailed error logging
      setError(err.message || "Failed to save farmer");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {farmer ? "Edit Farmer" : "Add New Farmer"}
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

          {!farmer && (
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
          )}

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

export default FarmerForm;
