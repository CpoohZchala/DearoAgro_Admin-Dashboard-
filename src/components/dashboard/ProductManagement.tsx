import React, { useState, useEffect } from 'react';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../../api/productApi';
import { Product } from '../../models/Product';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: 0, image: '', category: '', quantity: 0 });

  useEffect(() => {
    const loadProducts = async () => {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
    };
    loadProducts();
  }, []);

  const handleAddProduct = async () => {
    const addedProduct = await addProduct(newProduct);
    setProducts([...products, addedProduct]);
  };

  const handleUpdateProduct = async (id: string, updatedFields: Partial<Product>) => {
    const updatedProduct = await updateProduct(id, updatedFields);
    setProducts(products.map((product) => (product.id === id ? updatedProduct : product)));
  };

  const handleDeleteProduct = async (id: string) => {
    await deleteProduct(id);
    setProducts(products.filter((product) => product.id !== id));
  };

  return (
<div className="p-6 bg-gradient-to-tr from-yellow-50 to-yellow-100 min-h-screen">
  <h1 className="text-4xl font-bold mb-8 text-center text-black">Product Management</h1>

  {/* Add Product Form */}
  <div className="bg-white p-8 rounded-xl shadow-md mb-10 max-w-4xl mx-auto">
    <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add New Product</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Input Fields */}
      {['name', 'price', 'image', 'category', 'quantity'].map((field) => (
        <input
          key={field}
          type={field === 'price' || field === 'quantity' ? 'number' : 'text'}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          value={(newProduct as any)[field]}
          onChange={(e) =>
            setNewProduct({ ...newProduct, [field]: field === 'price' || field === 'quantity' ? +e.target.value : e.target.value })
          }
          className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-yellow-500"
        />
      ))}
    </div>
    <button
      onClick={handleAddProduct}
      className="mt-6 bg-yellow-400 text-white py-3 px-6 rounded-lg hover:bg-yellow-500 focus:ring-2 focus:ring-black transition duration-300"
    >
      Add Product
    </button>
  </div>

  {/* Product List */}
  <div className="max-w-6xl mx-auto">
    <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">Product List</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 p-6">
          {product.image && (
            <img src={product.image} alt={product.name} className="h-40 w-full object-cover rounded-lg mb-4" />
          )}
          <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
          <p className="text-gray-600 mb-1">💰 <strong>${product.price}</strong></p>
          <p className="text-gray-600 mb-1">📦 Category: {product.category}</p>
          <div className="flex justify-between">
            <button
              onClick={() => handleUpdateProduct(product.id, { name: 'Updated Name' })}
              className="flex items-center bg-yellow-400 hover:bg-yellow-500 text-white py-2 px-4 rounded-lg transition duration-300"
            >
              <FaEdit className="mr-2" /> Update
            </button>
            <button
              onClick={() => handleDeleteProduct(product.id)}
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
