import React, { useEffect, useState } from "react";
import { Crop, CROP_CATEGORIES } from "@/models/crop";
import { fetchCrops, addCrop, updateCrop, deleteCrop } from "@/api/cropApi";

// Add Crop Form Component
interface AddCropFormProps {
  crops: Crop[];
  setCrops: React.Dispatch<React.SetStateAction<Crop[]>>;
}

const AddCropForm: React.FC<AddCropFormProps> = ({ crops, setCrops }) => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    imageUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.imageUrl) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const newCrop = await addCrop(formData);
      setCrops([...crops, newCrop]);
      setFormData({ name: "", category: "", imageUrl: "" });
      setShowForm(false);
    } catch (err) {
      alert("Failed to add crop");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", category: "", imageUrl: "" });
    setShowForm(false);
  };

  return (
    <div className="mb-8">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-200"
        >
          ➕ Add New Crop
        </button>
      ) : (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg mt-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Add New Crop</h3>
            <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Crop Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter crop name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Select a category</option>
                {CROP_CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL *</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter image URL"
                required
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-6 rounded-lg"
              >
                {loading ? "Adding..." : "Add Crop"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

// Crop List Component with Filter
interface CropListProps {
  crops: Crop[];
  setCrops: React.Dispatch<React.SetStateAction<Crop[]>>;
}

const CATEGORY_FILTERS = [
  "All",
  "ධාන්‍ය බෝග",
  "මුලබෝග",
  "පලතුරු බෝග",
  "එළවළු බෝග",
  "පාන බෝග",
  "ඖෂධීය සහ සුගන්ධ බෝග",
];

const CropList: React.FC<CropListProps> = ({ crops, setCrops }) => {
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const [editFormData, setEditFormData] = useState({ name: "", category: "", imageUrl: "" });
  const [loading, setLoading] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");

  const handleEdit = (crop: Crop) => {
    setEditingCrop(crop);
    setEditFormData({ name: crop.name, category: crop.category, imageUrl: crop.imageUrl });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCrop?._id) return;

    setLoading(editingCrop._id);
    try {
      const updatedCrop = await updateCrop(editingCrop._id, editFormData);
      setCrops((prev) => prev.map((crop) => (crop._id === editingCrop._id ? updatedCrop : crop)));
      setEditingCrop(null);
    } catch (err) {
      alert("Failed to update crop");
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this crop?")) return;
    setLoading(id);
    try {
      await deleteCrop(id);
      setCrops((prev) => prev.filter((crop) => crop._id !== id));
    } catch (err) {
      alert("Failed to delete crop");
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingCrop(null);
    setEditFormData({ name: "", category: "", imageUrl: "" });
  };

  const filteredCrops =
    activeFilter === "All" ? crops : crops.filter((crop) => crop.category === activeFilter);

  return (
    <div>
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        {CATEGORY_FILTERS.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-4 py-2 rounded-full font-medium transition duration-200 ${
              activeFilter === cat ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredCrops.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No crops found</h3>
          <p className="text-gray-500">Add some crops to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCrops.map((crop) => (
            <div key={crop._id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              {editingCrop?._id === crop._id ? (
                <form onSubmit={handleUpdate} className="p-4 space-y-4">
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    {CROP_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <input
                    type="url"
                    value={editFormData.imageUrl}
                    onChange={(e) => setEditFormData({ ...editFormData, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                  <div className="flex space-x-2">
                    <button type="submit" disabled={loading === crop._id} className="flex-1 bg-green-600 text-white py-2 rounded-md">
                      {loading === crop._id ? "Saving..." : "Save"}
                    </button>
                    <button type="button" onClick={handleCancelEdit} className="flex-1 bg-gray-500 text-white py-2 rounded-md">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <img
                    src={crop.imageUrl}
                    alt={crop.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => ((e.target as HTMLImageElement).src = "https://via.placeholder.com/300x200?text=No+Image")}
                  />
                  <div className="p-4">
                    <h4 className="text-lg font-semibold">{crop.name}</h4>
                    <p className="text-sm text-gray-600 mb-4">{crop.category}</p>
                    <div className="flex space-x-2">
                      <button onClick={() => handleEdit(crop)} className="flex-1 bg-yellow-500 text-white py-2 rounded-md">
                        Edit
                      </button>
                      <button
                        onClick={() => crop._id && handleDelete(crop._id)}
                        disabled={loading === crop._id}
                        className="flex-1 bg-red-600 text-white py-2 rounded-md"
                      >
                        {loading === crop._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main ManageCrops Component
const ManageCrops: React.FC = () => {
  const [crops, setCrops] = useState<Crop[]>([]);

  useEffect(() => {
    const loadCrops = async () => {
      try {
        const data = await fetchCrops();
        setCrops(data);
      } catch (error) {
        console.error(error);
        alert("Failed to load crops");
      }
    };
    loadCrops();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Manage Crops</h1>
        <AddCropForm crops={crops} setCrops={setCrops} />
        <CropList crops={crops} setCrops={setCrops} />
      </div>
    </div>
  );
};

export default ManageCrops;
