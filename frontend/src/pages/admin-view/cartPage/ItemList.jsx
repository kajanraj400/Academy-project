import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteConfirmation from "@/components/admin-view/cart/ItemList/DeleteConfirmation";
import ImageModal from "@/components/admin-view/cart/ItemList/ItemModel";
import SearchBar from "@/components/admin-view/cart/ItemList/SearchBar";
import ItemCard from "@/components/admin-view/cart/ItemList/ItemCart";
import Navbar from "@/components/admin-view/cart/common/Navbar";
import { FiShoppingCart } from "react-icons/fi"; 


const ItemList = () => {
  const [items, setItems] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0); 

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("http://localhost:5000/cart");
        setItems(response.data);
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    const updateCartCount = () => {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(storedCart.length); 
    };

    updateCartCount();
    window.addEventListener("storage", updateCartCount); 

    return () => window.removeEventListener("storage", updateCartCount);
  }, []);
  

  const handleSizeChange = (itemId, size) => {
    setSelectedSizes((prevSizes) => ({
      ...prevSizes,
      [itemId]: size,
    }));
  };

  const getPriceForSize = (item, size) => {
    const sizeDetail = item.sizes.find((s) => s.size === size);
    return sizeDetail ? sizeDetail.price : item.sizes[0]?.price;
  };

  const handleEdit = (itemId) => {
    const item = items.find((item) => item._id === itemId);
    navigate("/admin/create-product", { state: { item } });
    toast.success("Item edited successfully!");
  };

  const handleDelete = (itemId) => {
    setItemToDelete(itemId);
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`http://localhost:5000/cart/${itemToDelete}`);
      setItems(items.filter((item) => item._id !== itemToDelete));
      toast.success("Item deleted successfully!");
    } catch (err) {
      console.error("Error deleting item:", err);
      toast.error("Error deleting item. Please try again!");
    } finally {
      setIsDeleting(false);
      setShowConfirmation(false);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
    setItemToDelete(null);
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const filteredItems = items.filter((item) => {
    return item.name.toLowerCase().startsWith(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-200">
      { location.pathname.includes('/client/products') && <div className="h-[250px] md:h-[450px] bg-[url('@/assets/products.jpg')] bg-cover bg-center"></div> }
      { !location.pathname.includes('/client/products') && <Navbar /> }

      { !location.pathname.includes('/admin/product-list') &&
        <div className="bg-blue-500 fixed left-1 top-4 md:top-6 z-50 p-2 md:p-3 lg:p-4 rounded-full">
            <Link to="/client/cart" className="relative text-white hover:text-gray-200">
                <FiShoppingCart className="text-lg md:text-xl lg:text-2xl" />
                {cartCount > 0 && ( 
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] md:text-xs px-1 md:px-2 py-[1px] md:py-0.5 rounded-full">
                    {cartCount}
                    </span>
                )}
            </Link>
        </div>
       }


      <div className="max-w-6xl mx-auto px-3">
        <h1 className="text-4xl mt-8 mb-8 text-center text-blue-900 underline font-bold">
          Product List
        </h1>

        {/* Search Bar */}
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Item List */}
        <div className="grid md:grid-cols-2 gap-20 mb-20 mt-10">
          {filteredItems.map((item) => (
            <ItemCard
              key={item._id}
              item={item}
              selectedSize={selectedSizes[item._id] || "small"}
              onSizeChange={(size) => handleSizeChange(item._id, size)}
              onEdit={() => handleEdit(item._id)}
              onDelete={() => handleDelete(item._id)}
              onImageClick={() => handleImageClick(item.image)}
              getPriceForSize={getPriceForSize}
            />
          ))}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <ImageModal imageUrl={selectedImage} onClose={handleCloseModal} />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        showConfirmation={showConfirmation}
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      {/* ToastContainer */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeButton
        pauseOnHover
        draggable
        limit={3}
      />
    </div>
  );
};

export default ItemList;
