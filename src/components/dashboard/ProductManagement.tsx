import React, { useState, useEffect } from 'react';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../../api/productApi';
import { Product } from '../../models/Product';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: 0, image: '', category: '' });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        alert('Failed to load products. Please try again later.');
      }
    };
    loadProducts();
  }, []);

  const handleAddProduct = async () => {
    try {
      if (newProduct.price <= 0) {
        alert('Price must be a positive number.');
        return;
      }

      const addedProduct = await addProduct(newProduct);
      setProducts([...products, addedProduct]);
      alert('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again later.');
    }
  };

  const handleUpdateProduct = async (id: string, updatedFields: Partial<Product>) => {
    try {
      const updatedProduct = await updateProduct(id, updatedFields);
      setProducts(products.map((product) => (product._id === id ? updatedProduct : product)));
      alert('Product updated successfully!');
      setEditingProduct(null); // Reset the editing state to close the form
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again later.');
    }
  };

  const handleDeleteProduct = async (id: string | undefined) => {
    if (!id) {
      console.error('Product ID is undefined. Cannot delete product.');
      alert('Failed to delete product. Product ID is missing.');
      return;
    }

    try {
      await deleteProduct(id);
      alert('Product deleted successfully!');
      const updatedProducts = await fetchProducts();
      setProducts(updatedProducts);
    } catch (error: any) {
      console.error('Error deleting product:', error.message);
      alert('Failed to delete product. Please try again later.');
    }
  };

  return (
    <div className="p-6 bg-gradient-to-tr from-gray-50 to-gray-100 min-h-screen">
      <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-800">Product Management</h1>

      {/* Unified Form */}
      <div className="bg-white p-8 rounded-2xl shadow-lg mb-10 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">
          {editingProduct ? 'Update Product' : 'Add New Product'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {['name', 'price', 'image'].map((field) => (
            <input
              key={field}
              type={field === 'price' ? 'number' : 'text'}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={(editingProduct ? editingProduct[field as keyof Product] : newProduct[field as keyof Product]) || ''}
              onChange={(e) => {
                const value = field === 'price' ? parseFloat(e.target.value) : e.target.value;
                if (editingProduct) {
                  setEditingProduct({ ...editingProduct, [field]: value });
                } else {
                  setNewProduct({ ...newProduct, [field]: value });
                }
              }}
              className="border border-gray-300 rounded-lg p-4 w-full focus:ring-2 focus:ring-yellow-500"
            />
          ))}
          <select
            value={editingProduct ? editingProduct.category : newProduct.category}
            onChange={(e) => {
              const value = e.target.value;
              if (editingProduct) {
                setEditingProduct({ ...editingProduct, category: value });
              } else {
                setNewProduct({ ...newProduct, category: value });
              }
            }}
            className="border border-gray-300 rounded-lg p-4 w-full focus:ring-2 focus:ring-yellow-500"
          >
            <option value="" disabled>Select Category</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Fruits">Fruits</option>
            <option value="Dairy">Dairy</option>
            <option value="Grains">Grains</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-4 mt-6">
          <button
            onClick={editingProduct ? () => handleUpdateProduct(editingProduct._id, editingProduct) : handleAddProduct}
            className="bg-yellow-300 text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 focus:ring-2 focus:ring-blue-700 transition duration-300"
          >
            {editingProduct ? 'Save Changes' : 'Add Product'}
          </button>
          {editingProduct && (
            <button
              onClick={() => setEditingProduct(null)}
              className="bg-gray-400 text-white py-3 px-6 rounded-lg hover:bg-gray-500 focus:ring-2 focus:ring-gray-700 transition duration-300"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Product List */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-black text-center">Product List</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 p-6">
              {product.image && (
                <img src={product.image} alt={product.name} className="h-40 w-full object-cover rounded-lg mb-4" />
              )}
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-1">💰 <strong>Rs.{product.price}</strong></p>
              <p className="text-gray-600 mb-1">📦 Category: {product.category}</p>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setEditingProduct(product)}
                  className="flex items-center bg-yellow-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-300"
                >
                  <FaEdit className="mr-2" /> Update
                </button>
                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  className="flex items-center bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition duration-300"
                >
                  <FaTrashAlt className="mr-2" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
