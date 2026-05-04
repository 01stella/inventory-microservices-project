import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  // 1. Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // 2. Creating Modal States
  const [createModalOpen, setCreateModalOpen] = useState(false); // Controls the create pop-up
  const [viewModalOpen, setViewModalOpen] = useState(false); // Controls the view pop-up
  const [isEditing, setIsEditing] = useState(false); // Tracks if we're in edit mode
  const [selectedItem, setSelectedItem] = useState(null); // Holds the item being viewed/edited

  const [newItem, setNewItem] = useState({ short_name: '', description: '', price: 0, amount: 0 }); // Holds form data

  const API_URL = 'http://127.0.0.1:8000/items/'

  // 3. HANDLE GET ITEMS
  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL)
      setItems(response.data);
    } catch (err) {
      setError('Failed to fetch items', err)
    }
  };

  useEffect(() => {
    fetchItems();
  }, [])

  // 4. PAGINATION CALCULATION
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // 5. HANDLE CREATE ITEMS
  const handleCreate = async () => {
    if (!newItem.short_name || newItem.price <= 0 || newItem.amount < 0) {
      alert('Short name, price, and amount are required.');
      return;
    }

    const itemData = {
      short_name: newItem.short_name,
      description: newItem.description || 'N/A',
      price: newItem.price,
      amount: newItem.amount
    };

    try {
      await axios.post(API_URL, itemData);
      fetchItems();
      setNewItem({ short_name: '', description: '', price: 0, amount: 0 });
      setCreateModalOpen(false);
    } catch (err) {
      alert('Failed to create item');

    }
  };

  // 6. HANDLE UPDATE ITEMS
  const handleUpdate = async () => {
    if (!selectedItem.short_name || selectedItem.price <= 0 || selectedItem.amount < 0) {
      alert('Short name, price, and amount are required.');
      return;
    }

    const itemData = {
      short_name: selectedItem.short_name,
      description: selectedItem.description || 'N/A',
      price: selectedItem.price,
      amount: selectedItem.amount
    };

    try {
      await axios.put(`${API_URL}${selectedItem.id}/`, itemData);
      fetchItems();
      setSelectedItem(null);
      setIsEditing(false);
      setViewModalOpen(false);
    } catch (err) {
      alert('Failed to update item');
    }
  };

  // 7. HANDLE DELETE ITEMS
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
    
      try {
        await axios.delete(`${API_URL}${selectedItem.id}`);
        fetchItems();
        setSelectedItem(null);
        setIsEditing(false);
        setViewModalOpen(false);
      } catch (err) {
        alert('Failed to delete item');
      }
    }
  };

  // 8. POP UP WINDOW STYLES
  const modelOverlay = {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(25, 40, 60, 0.8)',
    display: 'flex', justifyContent: 'center', alignItems: 'center'
  };

  const modalBox = {
    backgroundColor: '#E1E8F8', color: '#36507A', padding: '20px', borderRadius: '5px',
    display: 'flex', flexDirection: 'column', alignItems: 'center'
  };

  return (
    <div style = {{ padding: '20px', fontFamily: 'Poppins, sans-serif', backgroundColor: '#36507A', color: '#E1E8F0', minHeight: '100vh' }}>
      <h1 style = {{ color: '#b6cde6', marginBottom: '50px' }}>Inventory App</h1>

      {/* Error Message */}
      {error && <p style = {{ color: 'red', marginBottom: '20px' }}>{error}</p>}
      
      {/* Items List */}
      <table border = "1" cellPadding = "10" style = {{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style = {{ backgroundColor: '#97B6CE', color: '#36507A' }}>
          <tr>
            <th>Item ID</th>
            <th>Short Name</th>
            <th>Price</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && !loading ? (
            <tr>
              <td colSpan = "5" style = {{ textAlign: 'center', padding: '20px' }}>
                {loading ? 'Loading...' : 'No items found.'}
              </td>
            </tr>
          ) : null}
            {currentItems.map((item) => (
              <tr key = {item.id}
                onClick = {() => {
                  setSelectedItem(item);
                  setIsEditing(false);
                  setViewModalOpen(true);
                }}
                style={{ cursor: 'pointer', backgroundColor: selectedItem && selectedItem.id === item.id ? '#92adbf' : 'transparent', color: selectedItem && selectedItem.id === item.id ? '#143364' : '#E1E8F0' }}
                >
                <td>{item.id}</td>
                <td>{item.short_name}</td>
                <td>Rp{item.price.toFixed(2)}</td>
                <td>{item.amount}</td>
              </tr>
            ))}
        </tbody>
      </table>
      
      {/* Pagination Controls */}
      <div style = {{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <button disabled = {currentPage === 1} onClick = {() => setCurrentPage(currentPage - 1)} style = {{ padding: '10px 20px', fontSize: '16px', marginRight: '10px' }}>
          Previous
        </button>
        <span style = {{ padding: '10px 20px', fontSize: '16px' }}>
          Page {currentPage} of {totalPages || 1}
        </span>
        <button disabled = {currentPage === totalPages || totalPages === 0} onClick = {() => setCurrentPage(currentPage + 1)} style = {{ padding: '10px 20px', fontSize: '16px', marginLeft: '10px' }}>
          Next
        </button>
      </div>

      {/* Create button */}
      <div style = {{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
        <button onClick = {() => setCreateModalOpen(true)} style = {{ marginBottom: '20px', padding: '10px 20px', fontSize: '16px' }}>
          Create Item
        </button>
      </div>

      {/* Create Modal */}
      {createModalOpen && (
        <div style = {modelOverlay} onClick = {() => setCreateModalOpen(false)}>
          <div style = {modalBox} onClick = {(e) => e.stopPropagation()}>
            <h2 style = {{ color: '#36507A', padding: '10px 20px' }}>Create New Item</h2>

            <label style = {{ marginBottom: '10px', fontWeight: 'bold' }}>Short Name:</label>
            <input
              type = "text"
              placeholder = "Short Name"
              value = {newItem.short_name}
              onChange = {(e) => setNewItem({ ...newItem, short_name: e.target.value })}
            />

            <label style = {{ marginBottom: '10px', fontWeight: 'bold' }}>Description:</label>
            <input
              type = "text"
              placeholder = "Description"
              value = {newItem.description}
              onChange = {(e) => setNewItem({ ...newItem, description: e.target.value })}
            />

            <label style = {{ marginBottom: '10px', fontWeight: 'bold' }}>Price:</label>
            <input
              type = "number"
              placeholder = "Price"
              value = {newItem.price}
              onChange = {(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
            />

            <label style = {{ marginBottom: '10px', fontWeight: 'bold' }}>Amount:</label>
            <input
              type = "number"
              placeholder = "Amount"
              value = {newItem.amount}
              onChange = {(e) => setNewItem({ ...newItem, amount: parseInt(e.target.value) })}
            />

            <div style = {{ marginTop: '20px' }}>
              <button onClick = {handleCreate} style = {{ padding: '10px 20px', fontSize: '16px' }}>
                Create
              </button>
              <button onClick = {() => setCreateModalOpen(false)} style = {{ padding: '10px 20px', fontSize: '16px', marginLeft: '10px' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View/Edit Modal */}
      {viewModalOpen && selectedItem && (
        <div style = {modelOverlay} onClick = {() => {
          if (!isEditing) {
            setViewModalOpen(false);
          }
        }}>
          <div style = {modalBox} onClick = {(e) => e.stopPropagation()}>
            <h2 style = {{ color: '#36507A', padding: '10px 20px' }}>{isEditing ? 'Edit' : 'View'} Item Details</h2>

            <label style = {{ marginBottom: '10px', fontWeight: 'bold' }}>Short Name:</label>
            <input disabled = {!isEditing} type = "text" value = {selectedItem.short_name} onChange = {(e) => setSelectedItem({ ...selectedItem, short_name: e.target.value })} />

            <label style = {{ marginBottom: '10px', fontWeight: 'bold' }}>Description:</label>
            <input disabled = {!isEditing} type = "text" value = {selectedItem.description} onChange = {(e) => setSelectedItem({ ...selectedItem, description: e.target.value })} />

            <label style = {{ marginBottom: '10px', fontWeight: 'bold' }}>Price:</label>
            <input disabled = {!isEditing} type = "number" value = {selectedItem.price} onChange = {(e) => setSelectedItem({ ...selectedItem, price: parseFloat(e.target.value) })} />

            <label style = {{ marginBottom: '10px', fontWeight: 'bold' }}>Amount:</label>
            <input disabled = {!isEditing} type = "number" value = {selectedItem.amount} onChange = {(e) => setSelectedItem({ ...selectedItem, amount: parseInt(e.target.value) })} />

            <div style = {{ marginTop: '20px' }}>
              {isEditing ? (
                <>
                  <button onClick = {handleUpdate} style = {{ padding: '10px 20px', fontSize: '16px' }}>Save</button>
                  <button onClick = {() => { setIsEditing(false); fetchItems(); }} style = {{ padding: '10px 20px', fontSize: '16px', marginLeft: '10px' }}>Cancel</button>                
                </>
              ) : (
                <>
                  <button onClick = {() => setIsEditing(true)} style = {{ padding: '10px 20px', fontSize: '16px' }}>Edit</button>
                  <button onClick = {handleDelete} style = {{ padding: '10px 20px', fontSize: '16px', marginLeft: '10px' }}>Delete</button>
                  <button onClick = {() => { setViewModalOpen(false); setSelectedItem(null)}} style = {{ padding: '10px 20px', fontSize: '16px', marginLeft: '10px' }}>Close</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
