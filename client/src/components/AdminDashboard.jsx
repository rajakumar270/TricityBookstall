import React, { useState } from 'react';
import { ShieldCheck, Plus, Trash2, Edit3, CheckCircle, X, LogOut, BookOpen, Clock, Building2, User, Phone, Mail, Sparkles } from 'lucide-react';
import { loginAdmin } from '../services/api';

export default function AdminDashboard({
  isOpen,
  onClose,
  isAdmin,
  setIsAdmin,
  books,
  setBooks,
  bookings,
  setBookings,
}) {
  const [activeTab, setActiveTab] = useState('books'); // 'books' | 'requests'
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Add Book Form state
  const [showAddBook, setShowAddBook] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    category: 'Kids Wisdom',
    isKidsSection: true,
    isFeatured: false,
    language: 'English',
    description: '',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    badge: 'New Release',
    readingAge: 'Ages 8 - 14',
    pages: 120,
    availableStock: 50,
  });

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      await loginAdmin(loginForm.username, loginForm.password);
      setIsAdmin(true);
    } catch (err) {
      setLoginError(err.message || 'Invalid login. Try admin / admin123');
    }
  };

  const handleAddBook = (e) => {
    e.preventDefault();
    const created = {
      id: 'b' + Date.now(),
      ...newBook,
    };
    setBooks([created, ...books]);
    setShowAddBook(false);
  };

  const handleDeleteBook = (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      setBooks(books.filter((b) => b.id !== id));
    }
  };

  const handleUpdateBookingStatus = (id, newStatus) => {
    setBookings(
      bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden my-8">
        
        {/* Top Bar Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-800 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white">Tricity Bookstall Admin Portal</h3>
              <p className="text-xs text-slate-400">Books Management & Institutional Requests</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {isAdmin && (
              <button
                onClick={() => setIsAdmin(false)}
                className="flex items-center space-x-1 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/30"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="bg-slate-800 text-slate-400 hover:text-white p-2 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {!isAdmin ? (
            /* Login View */
            <div className="max-w-md mx-auto py-8 space-y-6">
              <div className="text-center space-y-2">
                <ShieldCheck className="w-12 h-12 text-orange-500 mx-auto" />
                <h4 className="text-2xl font-bold text-white">Admin Authentication</h4>
                <p className="text-xs text-slate-400">Enter credentials to access book management and stall requests.</p>
              </div>

              {loginError && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3 rounded-xl text-center font-medium">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Username</label>
                  <input
                    type="text"
                    required
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    placeholder="Username (e.g. admin)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="Password (e.g. admin123)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-orange-500"
                  />
                </div>

                <p className="text-[11px] text-amber-400/90 text-center font-medium bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                  💡 Demo Credentials: Username <strong>admin</strong> | Password <strong>admin123</strong>
                </p>

                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs py-3 rounded-xl shadow-lg"
                >
                  Access Admin Dashboard
                </button>
              </form>
            </div>
          ) : (
            /* Admin Dashboard View */
            <div className="space-y-6">
              
              {/* Tabs navigation */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveTab('books')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeTab === 'books'
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    Manage Books Catalog ({books.length})
                  </button>

                  <button
                    onClick={() => setActiveTab('requests')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeTab === 'requests'
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    Stall Requests ({bookings.length})
                  </button>
                </div>

                {activeTab === 'books' && (
                  <button
                    onClick={() => setShowAddBook(!showAddBook)}
                    className="flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Book</span>
                  </button>
                )}
              </div>

              {/* TAB 1: BOOKS MANAGEMENT */}
              {activeTab === 'books' && (
                <div className="space-y-6">
                  
                  {/* Add Book Form Drawer */}
                  {showAddBook && (
                    <form onSubmit={handleAddBook} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                      <h4 className="text-sm font-bold text-orange-400 flex items-center space-x-1">
                        <Plus className="w-4 h-4" />
                        <span>Add New Book to Inventory</span>
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          placeholder="Book Title *"
                          value={newBook.title}
                          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                          className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Author Name *"
                          value={newBook.author}
                          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                          className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <select
                          value={newBook.category}
                          onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                          className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                        >
                          <option value="Kids Wisdom">Kids Wisdom</option>
                          <option value="Mind & Character">Mind & Character</option>
                          <option value="Self Discovery">Self Discovery</option>
                          <option value="Vedanta & Classics">Vedanta & Classics</option>
                        </select>

                        <select
                          value={newBook.language}
                          onChange={(e) => setNewBook({ ...newBook, language: e.target.value })}
                          className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                        >
                          <option value="English">English</option>
                          <option value="Hindi">Hindi</option>
                          <option value="Bilingual">Bilingual</option>
                        </select>

                        <input
                          type="number"
                          placeholder="Available Stock Count"
                          value={newBook.availableStock}
                          onChange={(e) => setNewBook({ ...newBook, availableStock: Number(e.target.value) })}
                          className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>

                      <div className="flex items-center space-x-4 pt-1">
                        <label className="flex items-center space-x-2 text-xs text-slate-300 font-semibold cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newBook.isKidsSection}
                            onChange={(e) => setNewBook({ ...newBook, isKidsSection: e.target.checked })}
                            className="rounded bg-slate-900 border-slate-700 text-pink-500 focus:ring-0"
                          />
                          <span>Feature in Kids Wisdom Corner 🎈</span>
                        </label>
                      </div>

                      <textarea
                        rows={2}
                        placeholder="Book description..."
                        value={newBook.description}
                        onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white resize-none"
                      />

                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setShowAddBook(false)}
                          className="px-4 py-2 rounded-xl text-xs bg-slate-800 text-slate-300"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white"
                        >
                          Save Book
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Books List Table */}
                  <div className="overflow-x-auto rounded-2xl border border-slate-800">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 font-bold uppercase border-b border-slate-800">
                        <tr>
                          <th className="p-3">Book</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Stock</th>
                          <th className="p-3">Kids Feature</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {books.map((b) => (
                          <tr key={b.id} className="hover:bg-slate-950/60">
                            <td className="p-3 flex items-center space-x-3">
                              <img src={b.coverImage} alt={b.title} className="w-10 h-10 object-cover rounded-lg" />
                              <div>
                                <div className="font-bold text-white line-clamp-1">{b.title}</div>
                                <div className="text-[11px] text-slate-400">{b.author}</div>
                              </div>
                            </td>
                            <td className="p-3">
                              <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                                {b.category}
                              </span>
                            </td>
                            <td className="p-3 font-semibold text-emerald-400">{b.availableStock} pcs</td>
                            <td className="p-3">
                              {b.isKidsSection ? (
                                <span className="bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full text-[11px] font-bold">
                                  Kids Section
                                </span>
                              ) : (
                                <span className="text-slate-500">—</span>
                              )}
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => handleDeleteBook(b.id)}
                                className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg"
                                title="Delete Book"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

              {/* TAB 2: INSTITUTIONAL STALL REQUESTS */}
              {activeTab === 'requests' && (
                <div className="space-y-4">
                  {bookings.map((req) => (
                    <div
                      key={req.id}
                      className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="bg-orange-500/20 text-orange-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                              {req.institutionType}
                            </span>
                            <span className="text-xs text-slate-400">{req.city}</span>
                          </div>
                          <h4 className="text-lg font-bold text-white mt-1">
                            {req.institutionName}
                          </h4>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                            req.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            req.status === 'Pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                            'bg-slate-800 text-slate-400'
                          }`}>
                            {req.status}
                          </span>

                          <select
                            value={req.status}
                            onChange={(e) => handleUpdateBookingStatus(req.id, e.target.value)}
                            className="bg-slate-900 text-xs text-slate-200 border border-slate-700 rounded-lg px-2 py-1 outline-none"
                          >
                            <option value="Pending">Mark Pending</option>
                            <option value="Approved">Approve Request</option>
                            <option value="Completed">Mark Completed</option>
                            <option value="Declined">Decline</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
                        <div>
                          <span className="text-slate-400">Contact Person:</span>
                          <div className="font-semibold text-white">{req.contactPerson} ({req.designation || 'Staff'})</div>
                        </div>

                        <div>
                          <span className="text-slate-400">Phone / Email:</span>
                          <div className="font-semibold text-amber-300">{req.phone} | {req.email}</div>
                        </div>

                        <div>
                          <span className="text-slate-400">Preferred Date & Footfall:</span>
                          <div className="font-semibold text-white">{req.preferredDate || 'TBD'} ({req.estimatedFootfall})</div>
                        </div>
                      </div>

                      {req.additionalNotes && (
                        <div className="text-xs bg-slate-900 p-3 rounded-xl text-slate-300 italic border border-slate-800">
                          "{req.additionalNotes}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
