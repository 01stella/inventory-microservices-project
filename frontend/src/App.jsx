import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [createModalOpen, setCreateModalOpen] = useState(false); // Controls the pop-up
  const [newItem, setNewItem] = useState({ name: '', description: '', price: 0, amount: 0 }); // Holds form data

  const API_URL = 'http://127.0.0.1:8000/items/'

  // 1. HANDLE GET ITEMS
  const fetchItems = async () => {
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

  // 2. HANDLE CREATE ITEMS
  const handleCreate = async () => {
    try {
      await axios.post(API_URL, { short_name: newItem.short_name, description: newItem.description, price: newItem.price, amount: newItem.amount });

      fetchItems()

      setNewItem({ short_name: '' , description: '', price: 0 , amount: 0 });
      setCreateModalOpen(false);
    } catch (err) {
      setError('Failed to create item', err)
    }
  };
  
  // 3. POP UP WINDOW 
  const modelOverlay = {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex', justifyContent: 'center', alignItems: 'center'
  };

  const modalBox = {
    backgroundColor: '#fff', padding: '20px', borderRadius: '5px',
    display: 'flex', flexDirection: 'column', alignItems: 'center'
  };

  return (
    <div style = {{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style = {{ marginBottom: '50px' }}>Inventory App</h1>

      {/* Items List */}
      <table border = "1" cellPadding = "10" style = {{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style = {{ backgroundColor: '#f0f0f0' }}>
          <tr>
            <th>Item ID</th>
            <th>Short Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan = "5" style = {{ textAlign: 'center', padding: '20px' }}>
                {loading ? 'Loading...' : 'No items found.'}
              </td>
            </tr>
          ) : null}
            {items.map((item) => (
              <tr key = {item.id}>
                <td>{item.id}</td>
                <td>{item.short_name}</td>
                <td>{item.description}</td>
                <td>Rp.{item.price?.toFixed(2) || '0,00'}</td>
                <td>{item.amount}</td>
              </tr>
            ))}
        </tbody>
      </table>
      
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
            <h2>Create New Item</h2>

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


    </div>
  );
}

export default App;
