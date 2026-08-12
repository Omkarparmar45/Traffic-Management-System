import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Filter, Plus, Edit2, Trash2 } from 'lucide-react';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [form, setForm] = useState({ plateNumber: '', type: 'Car', ownerName: '', registeredDate: '', status: 'Active' });

  useEffect(() => {
    axios.get('http://localhost:8080/api/vehicles')
      .then(res => {
        if (res.data && res.data.length > 0) setVehicles(res.data);
        else setMockData();
      })
      .catch(() => setMockData());
  }, []);

  const setMockData = () => {
    setVehicles([
      { id: 1, plateNumber: 'UP80 AB 1234', type: 'Car', ownerName: 'Amit Sharma', registeredDate: '2024-01-15', status: 'Active' },
      { id: 2, plateNumber: 'DL 01 CD 5678', type: 'Truck', ownerName: 'Ravi Kumar', registeredDate: '2024-02-20', status: 'Active' },
      { id: 3, plateNumber: 'MH 12 EF 9012', type: 'Motorcycle', ownerName: 'Priya Singh', registeredDate: '2024-01-08', status: 'Inactive' },
      { id: 4, plateNumber: 'KA 05 GH 3456', type: 'Bus', ownerName: 'Suresh Patel', registeredDate: '2024-03-01', status: 'Active' },
      { id: 5, plateNumber: 'TN 09 IJ 7890', type: 'Car', ownerName: 'Deepa Rao', registeredDate: '2024-03-10', status: 'Active' },
      { id: 6, plateNumber: 'GJ 01 KL 2345', type: 'Motorcycle', ownerName: 'Vijay Mehta', registeredDate: '2023-12-20', status: 'Active' },
    ]);
  };

  const getBadgeColor = (type) => {
    switch (type) {
      case 'Car': return 'text-blue-400 bg-blue-400/10 border border-blue-400/20';
      case 'Truck': return 'text-orange-400 bg-orange-400/10 border border-orange-400/20';
      case 'Motorcycle': return 'text-purple-400 bg-purple-400/10 border border-purple-400/20';
      case 'Bus': return 'text-yellow-400 bg-yellow-400/10 border border-yellow-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border border-gray-400/20';
    }
  };

  const openAddModal = () => {
    setEditingVehicle(null);
    setForm({ plateNumber: '', type: 'Car', ownerName: '', registeredDate: new Date().toISOString().slice(0, 10), status: 'Active' });
    setShowModal(true);
  };

  const openEditModal = (v) => {
    setEditingVehicle(v);
    setForm({ plateNumber: v.plateNumber || '', type: v.type || 'Car', ownerName: v.ownerName || '', registeredDate: v.registeredDate || '', status: v.status || 'Active' });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingVehicle(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (editingVehicle) {
      // Update (try backend, fallback to local)
      try {
        const res = await axios.put(`http://localhost:8080/api/vehicles/${editingVehicle.id}`, form);
        setVehicles(prev => prev.map(x => x.id === editingVehicle.id ? res.data : x));
      } catch (err) {
        setVehicles(prev => prev.map(x => x.id === editingVehicle.id ? { ...x, ...form } : x));
      }
    } else {
      try {
        const res = await axios.post('http://localhost:8080/api/vehicles', form);
        setVehicles(prev => [res.data, ...prev]);
      } catch (err) {
        const newVehicle = { id: Date.now(), ...form };
        setVehicles(prev => [newVehicle, ...prev]);
      }
    }
    closeModal();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vehicle?')) return;
    try {
      await axios.delete(`http://localhost:8080/api/vehicles/${id}`);
      setVehicles(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      setVehicles(prev => prev.filter(v => v.id !== id));
    }
  };

  const toggleStatus = async (id) => {
    // optimistic UI
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, status: v.status === 'Active' ? 'Inactive' : 'Active' } : v));
    // fire-and-forget backend update
    try {
      const target = vehicles.find(v => v.id === id);
      if (target) {
        const updated = { ...target, status: target.status === 'Active' ? 'Inactive' : 'Active' };
        await axios.put(`http://localhost:8080/api/vehicles/${id}`, updated);
      }
    } catch (err) {
      // ignore
    }
  };

  return (
    <div className="text-gray-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Vehicles</h1>
          <p className="text-gray-400 text-sm">{vehicles.length} registered vehicles</p>
        </div>
        <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 flex items-center gap-2 rounded-lg font-medium transition-colors">
          <Plus size={18} />
          Add Vehicle
        </button>
      </div>

      <div className="bg-[#111827] rounded-xl border border-gray-800 p-4 mb-6 sticky top-0 z-10">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search by plate or owner..."
              className="w-full bg-[#0a0f18] border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 bg-[#0a0f18] border border-gray-800 rounded-lg px-4 py-2.5">
            <Filter size={18} className="text-gray-500" />
            <select className="bg-transparent text-sm text-gray-300 outline-none">
              <option value="all">All Types</option>
              <option value="car">Car</option>
            </select>
          </div>
          <p className="text-sm text-gray-500 whitespace-nowrap">{vehicles.length} results</p>
        </div>
      </div>

      <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left font-sans">
          <thead className="bg-[#1f2937] text-xs uppercase text-gray-400 font-semibold border-b border-gray-800 tracking-wider">
            <tr>
              <th className="px-6 py-4">Plate No.</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Owner Name</th>
              <th className="px-6 py-4">Registered</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {vehicles.map(v => (
              <tr key={v.id} className="hover:bg-[#1a2235] transition-colors">
                <td className="px-6 py-4 font-mono font-medium text-white">{v.plateNumber}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getBadgeColor(v.type)}`}>
                    {v.type}
                  </span>
                </td>
                <td className="px-6 py-4">{v.ownerName}</td>
                <td className="px-6 py-4 font-mono text-sm">{v.registeredDate}</td>
                <td className="px-6 py-4">
                  <button type="button" onClick={() => toggleStatus(v.id)} className="focus:outline-none">
                    {v.status === 'Active' ? (
                      <div className="flex items-center gap-2 text-green-500 p-1.5 px-3 bg-green-500/10 rounded-full w-fit border border-green-500/20 text-sm font-medium">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        Active
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-400 p-1.5 px-3 bg-gray-500/10 rounded-full w-fit border border-gray-500/20 text-sm font-medium">
                        Inactive
                      </div>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 flex gap-3">
                  <button onClick={() => openEditModal(v)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg border border-transparent hover:border-blue-400/20 transition-all">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(v.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg border border-transparent hover:border-red-400/20 transition-all">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4 px-2">
        <p className="text-sm text-gray-500">Showing 1-{vehicles.length} of {vehicles.length}</p>
        <div className="flex gap-1">
          <button className="px-3 py-1 bg-blue-600 text-white rounded font-medium text-sm">1</button>
          <button className="px-3 py-1 bg-transparent hover:bg-gray-800 text-gray-400 rounded font-medium text-sm transition-colors cursor-pointer">2</button>
          <button className="px-3 py-1 bg-transparent hover:bg-gray-800 text-gray-400 rounded font-medium text-sm transition-colors cursor-pointer">&gt;</button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#0a0f18] rounded-xl p-6 w-full max-w-lg border border-gray-800">
            <h2 className="text-lg font-semibold text-white mb-4">{editingVehicle ? 'Edit Vehicle' : 'Add Vehicle'}</h2>
            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input name="plateNumber" value={form.plateNumber} onChange={handleFormChange} placeholder="Plate Number" className="bg-[#111827] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white" />
                <select name="type" value={form.type} onChange={handleFormChange} className="bg-[#111827] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white">
                  <option>Car</option>
                  <option>Truck</option>
                  <option>Motorcycle</option>
                  <option>Bus</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input name="ownerName" value={form.ownerName} onChange={handleFormChange} placeholder="Owner Name" className="bg-[#111827] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white" />
                <input type="date" name="registeredDate" value={form.registeredDate} onChange={handleFormChange} className="bg-[#111827] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white" />
              </div>

              <div className="flex items-center justify-end gap-2 mt-4">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg bg-transparent border border-gray-700 text-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vehicles;
