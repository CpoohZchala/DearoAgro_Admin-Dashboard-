// src/pages/admin/ProductManagement.tsx
import React, { useState, useEffect, ChangeEvent } from 'react';
import { Product } from '../../models/Product';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  fetchProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct, 
  createCrop
} from '@/api/productApi';

const CropManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Simplified form state
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    image: ''
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);

  // Fetch all products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Handle form submission
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    if (isEditing && currentProductId) {
      // For updates, use all product fields
      const updatedProduct = await updateProduct(currentProductId, {
        ...formData,
        price: 0, // Default value
        quantity: 0, // Default value
        harvestId: 'default-harvest-id' // Default value
      });
      setProducts(products.map(p => p._id === currentProductId ? updatedProduct : p));
      toast.success('Crop updated successfully');
    } else {
      // For new crops, use the simplified createCrop endpoint
      const newProduct = await createCrop(formData);
      setProducts([...products, newProduct]);
      toast.success('Crop added successfully');
    }

    resetForm();
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to process crop';
    toast.error(errorMessage);
  }
};

  // Edit product
  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      category: product.category,
      image: product.image
    });
    setIsEditing(true);
    setCurrentProductId(product._id);
  };

  // Delete product
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this crop?')) return;
    
    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p._id !== id));
      toast.success('Crop deleted successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete crop';
      toast.error(errorMessage);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      image: ''
    });
    setIsEditing(false);
    setCurrentProductId(null);
  };

  // Extract unique categories from existing products
  const existingCategories = [...new Set(products.map(p => p.category))];

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">Error: {error}</div>;

    function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
        throw new Error('Function not implemented.');
    }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Crop Management</h1>
      
      {/* Simplified Crop Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? 'Edit Crop' : 'Add New Crop'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Crop Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                list="categories"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <datalist id="categories">
                {existingCategories.map((category, index) => (
                  <option key={index} value={category} />
                ))}
              </datalist>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              {isEditing ? 'Update Crop' : 'Add Crop'}
            </button>
            
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      
      {/* Crops Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-xl font-semibold p-6 pb-0">Existing Crops</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No crops found. Add your first crop above.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img 
                        src={product.image || '/images/default-crop.jpg'} 
                        alt={product.name} 
                        className="h-10 w-10 rounded-full object-cover" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/default-crop.jpg';
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CropManagement;