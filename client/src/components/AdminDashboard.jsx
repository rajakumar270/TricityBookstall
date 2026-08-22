import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, Plus, Trash2, Edit3, CheckCircle, X, LogOut, BookOpen, Clock, Building2, User, Phone, Mail, Sparkles, Upload, Calendar, DollarSign, Tag, CheckSquare, Layers, FileSpreadsheet, Smartphone, ShoppingBag, Download, Settings, Globe, Share2, ToggleLeft, ToggleRight
} from 'lucide-react';
import { loginAdmin, createBookApi, updateBookApi, deleteBookApi, recordSalesEntryApi, fetchSalesLogsApi, fetchSettingsApi, updateSettingsApi } from '../services/api';

export default function AdminDashboard({
  isOpen,
  onClose,
  isAdmin,
  setIsAdmin,
  userRole,
  setUserRole,
  books,
  setBooks,
  bookings,
  setBookings,
  siteVersion = 'v2',
  siteSettings,
  setSiteSettings,
  onSettingsUpdated,
}) {
  const [activeTab, setActiveTab] = useState('books'); // 'books' | 'sales' | 'csv' | 'requests' | 'settings'
  const [selectedMainCatFilter, setSelectedMainCatFilter] = useState('All');
  
  // Auth state
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  // Settings form state
  const [localSettings, setLocalSettings] = useState({
    catalogEnabled: false,
    contactInfo: {
      phone: '+91 98765 43210',
      email: 'contact@ekatvafoundation.org',
      address: 'Tricity Stall Center, Sector 17, Chandigarh',
      whatsapp: 'https://wa.me/919876543210',
      instagram: 'https://instagram.com/ekatvafoundation',
      youtube: 'https://youtube.com/acharyaprashant',
      facebook: 'https://facebook.com/ekatvafoundation',
    },
    homeBanner: {
      badge: 'Tricity Campus & PTM Literature Movement',
      title: 'Transforming Lives Through Higher Wisdom Literature',
      subtitle: 'Bringing timeless clarity, Vedanta, and youth character-building literature to schools, universities, and book stalls across Chandigarh, Mohali, and Panchkula.',
      imageUrl: '/assets/banner.jpg',
    },
    eventsConfig: {
      bannerImage: '/assets/cgc1.jpg',
      title: 'Campus Impact & Bookstall Gallery',
      description: 'Moments of student engagement, book fairs, and PTM bookstalls across Tricity educational institutions.',
    },
  });
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState('');

  // Add / Edit Book Form state
  const [showBookModal, setShowBookModal] = useState(false);
  const [editingBookId, setEditingBookId] = useState(null);
  const [bookForm, setBookForm] = useState({
    title: '',
    hinglishTitle: '',
    author: '',
    mainCategory: 'Acharya Prashant Foundation',
    category: 'Kids Wisdom',
    isKidsSection: false,
    isFeatured: false,
    language: 'Hindi',
    mrp: 280,
    buyingCost: 120,
    sellingPrice: 120,
    availableStock: 50,
    description: '',
    coverImage: '',
    externalLink: '',
    problemAddressedTag: 'Overcoming Fear & Stress',
  });

  // Sales Entry state
  const [salesLogs, setSalesLogs] = useState([]);
  const [salesForm, setSalesForm] = useState({
    date: new Date().toISOString().split('T')[0],
    bookId: '',
    quantitySold: 1,
    sellingPriceOnDate: 0,
    recordedBy: '',
    location: 'Chandigarh Stall',
    notes: '',
  });
  const [salesSuccess, setSalesSuccess] = useState('');

  // CSV Import state
  const [csvText, setCsvText] = useState('');
  const [csvTargetCat, setCsvTargetCat] = useState('Other Author');
  const [csvMessage, setCsvMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (isAdmin) {
        loadSalesLogs();
      }
      fetchSettingsApi().then((data) => {
        if (data) {
          setLocalSettings(data);
          if (setSiteSettings) setSiteSettings(data);
        }
      });
    }
  }, [isOpen, isAdmin]);

  const loadSalesLogs = async () => {
    const logs = await fetchSalesLogsApi();
    if (logs && Array.isArray(logs)) {
      setSalesLogs(logs);
    }
  };

  if (!isOpen) return null;

  const isV2 = siteVersion === 'v2';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const data = await loginAdmin(loginForm.username, loginForm.password);
      setIsAdmin(true);
      const role = data.user?.role || 'Admin';
      setUserRole(role);
      setCurrentUser(data.user);
      setSalesForm((prev) => ({ ...prev, recordedBy: data.user?.name || role }));
    } catch (err) {
      setLoginError(err.message || 'Invalid credentials. Please check your username and password.');
    }
  };

  const handleSaveSettingsSubmit = async (e) => {
    e.preventDefault();
    setSettingsSaving(true);
    setSettingsSuccess('');
    try {
      const updated = await updateSettingsApi(localSettings);
      if (updated) {
        setLocalSettings(updated);
        if (setSiteSettings) setSiteSettings(updated);
        if (onSettingsUpdated) onSettingsUpdated(updated);
        setSettingsSuccess('✅ Site controls & dynamic settings updated successfully!');
        setTimeout(() => setSettingsSuccess(''), 3500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleToggleCatalog = async () => {
    const nextState = !localSettings.catalogEnabled;
    const updatedLocal = { ...localSettings, catalogEnabled: nextState };
    setLocalSettings(updatedLocal);
    try {
      const updated = await updateSettingsApi(updatedLocal);
      if (updated) {
        setLocalSettings(updated);
        if (setSiteSettings) setSiteSettings(updated);
        if (onSettingsUpdated) onSettingsUpdated(updated);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenAddModal = () => {
    setEditingBookId(null);
    setBookForm({
      title: '',
      hinglishTitle: '',
      author: '',
      mainCategory: 'Acharya Prashant Foundation',
      category: 'Kids Wisdom',
      isKidsSection: false,
      isFeatured: false,
      language: 'Hindi',
      mrp: 280,
      buyingCost: 120,
      sellingPrice: 120,
      availableStock: 50,
      description: '',
      coverImage: '',
      externalLink: '',
      problemAddressedTag: 'Overcoming Fear & Stress',
    });
    setShowBookModal(true);
  };

  const handleOpenEditModal = (book) => {
    setEditingBookId(book.id);
    setBookForm({
      title: book.title || '',
      hinglishTitle: book.hinglishTitle || '',
      author: book.author || '',
      mainCategory: book.mainCategory || 'Acharya Prashant Foundation',
      category: book.category || 'Kids Wisdom',
      isKidsSection: !!book.isKidsSection,
      isFeatured: !!book.isFeatured,
      language: book.language || 'Hindi',
      mrp: book.mrp || 0,
      buyingCost: book.buyingCost || 0,
      sellingPrice: book.sellingPrice || 0,
      availableStock: book.availableStock || 0,
      description: book.description || '',
      coverImage: book.coverImage || '',
      externalLink: book.externalLink || '',
      problemAddressedTag: book.problemAddressedTag || 'Personal Growth & Freedom',
    });
    setShowBookModal(true);
  };

  const handleSaveBook = async (e) => {
    e.preventDefault();
    if (editingBookId) {
      const updated = await updateBookApi(editingBookId, bookForm);
      setBooks((prev) => prev.map((b) => (b.id === editingBookId ? updated : b)));
    } else {
      const created = await createBookApi(bookForm);
      setBooks((prev) => [created, ...prev]);
    }
    setShowBookModal(false);
  };

  const handleDeleteBook = async (id) => {
    if (window.confirm('Are you sure you want to delete this book entry from inventory?')) {
      await deleteBookApi(id);
      setBooks((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const handleBookSelectForSales = (bookId) => {
    const book = books.find((b) => b.id === bookId);
    if (book) {
      setSalesForm((prev) => ({
        ...prev,
        bookId: book.id,
        sellingPriceOnDate: book.sellingPrice || book.mrp || 0,
      }));
    }
  };

  const handleRecordSalesSubmit = async (e) => {
    e.preventDefault();
    setSalesSuccess('');
    if (!salesForm.bookId) return;

    const res = await recordSalesEntryApi(salesForm);
    if (res) {
      setSalesLogs((prev) => [res, ...prev]);
      setBooks((prev) =>
        prev.map((b) => {
          if (b.id === salesForm.bookId) {
            return {
              ...b,
              availableStock: Math.max(0, b.availableStock - salesForm.quantitySold),
              sellingPrice: salesForm.sellingPriceOnDate,
            };
          }
          return b;
        })
      );
      setSalesSuccess(`Logged sale of ${salesForm.quantitySold} copies!`);
      setTimeout(() => setSalesSuccess(''), 3000);
    }
  };

  const handleCsvFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setCsvText(evt.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleCsvImportSubmit = async (e) => {
    e.preventDefault();
    setCsvMessage('');
    if (!csvText.trim()) return;

    const lines = csvText.split('\n').filter((l) => l.trim().length > 0);
    let count = 0;
    const newBooks = [];

    for (let line of lines) {
      const parts = line.split(',').map((p) => p.trim().replace(/^["']|["']$/g, ''));
      if (parts.length >= 2) {
        const title = parts[0];
        const author = parts[1] || 'Author';
        const mrp = parseFloat(parts[2]) || 200;
        const buyingCost = parseFloat(parts[3]) || 100;
        const sellingPrice = parseFloat(parts[4]) || 100;
        const stock = parseInt(parts[5]) || 10;
        const lang = parts[6] || 'Hindi';

        const created = await createBookApi({
          title,
          author,
          mainCategory: csvTargetCat,
          category: 'Mind & Character',
          isKidsSection: false,
          isFeatured: false,
          language: lang,
          mrp,
          buyingCost,
          sellingPrice,
          availableStock: stock,
          problemAddressedTag: 'Personal Growth & Freedom',
        });
        newBooks.push(created);
        count++;
      }
    }

    setBooks((prev) => [...newBooks, ...prev]);
    setCsvMessage(`Successfully imported ${count} books into ${csvTargetCat}!`);
    setCsvText('');
  };

  const handleDownloadSampleCsv = () => {
    const sampleContent = `Title, Author, MRP, BuyingCost, SellingPrice, Stock, Language
"Sankalp", "Acharya Prashant", 280, 100, 150, 20, "Hindi"
"1984", "George Orwell", 199, 99.5, 99.5, 5, "English"`;
    const blob = new Blob([sampleContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_inventory_books.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredBooks = books.filter((b) => {
    if (selectedMainCatFilter === 'All') return true;
    return b.mainCategory === selectedMainCatFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <div className={`relative w-full max-w-6xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] ${
        isV2 ? 'bg-[#F7F4EE] border-[#A36B42]/30 text-[#242220]' : 'bg-slate-900 border-slate-800 text-white'
      }`}>
        
        {/* Modal Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isV2 ? 'bg-[#EFEBE2] border-[#A36B42]/20' : 'bg-slate-950 border-slate-800'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-2xl ${
              isV2 ? 'bg-[#242220] text-[#A36B42]' : 'bg-gradient-to-tr from-orange-500 to-amber-400 text-slate-950'
            }`}>
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className={`text-base font-extrabold flex items-center space-x-2 ${isV2 ? 'font-serif-editorial text-[#242220]' : 'text-white'}`}>
                <span>Ekatva Foundation Bookstall Inventory Portal</span>
              </h3>
              <p className={`text-xs ${isV2 ? 'text-[#5C554E]' : 'text-slate-400'}`}>
                Books Inventory, MRP/Cost Management, Feature Toggles & Sales Logger
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isAdmin && (
              <button
                onClick={() => {
                  setIsAdmin(false);
                  setCurrentUser(null);
                }}
                className={`flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                  isV2 ? 'bg-[#EFEBE2] text-rose-700 border-rose-300 hover:bg-rose-100' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            )}
            <button
              onClick={onClose}
              className={`p-2 rounded-xl border transition-all ${
                isV2 ? 'bg-[#EFEBE2] text-[#4A443E] border-[#A36B42]/20 hover:bg-[#E5DFD3]' : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {!isAdmin ? (
            /* Login Form */
            <div className="max-w-md mx-auto py-8 space-y-6">
              <div className="text-center space-y-2">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto shadow-lg ${
                  isV2 ? 'bg-[#242220] text-[#A36B42] border border-[#A36B42]/30' : 'bg-gradient-to-tr from-orange-500 to-amber-400 text-slate-950'
                }`}>
                  <Smartphone className="w-7 h-7" />
                </div>
                <h4 className={`text-2xl font-bold ${isV2 ? 'font-serif-editorial text-[#242220]' : 'text-white'}`}>Team Member Login</h4>
                <p className={`text-xs ${isV2 ? 'text-[#5C554E]' : 'text-slate-400'}`}>Log in from mobile or desktop to manage books inventory or record daily stall sales.</p>
              </div>

              {loginError && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs p-3 rounded-xl text-center font-medium">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className={`block text-xs font-bold mb-1 ${isV2 ? 'text-[#4A443E]' : 'text-slate-300'}`}>Username / ID</label>
                  <input
                    type="text"
                    required
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    placeholder="Enter Username"
                    className={`w-full rounded-xl px-4 py-3 text-xs outline-none transition-all ${
                      isV2 
                        ? 'bg-[#EFEBE2] border border-[#A36B42]/30 text-[#242220] placeholder-[#8C847B] focus:border-[#A36B42]'
                        : 'bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:border-orange-500'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1 ${isV2 ? 'text-[#4A443E]' : 'text-slate-300'}`}>Password</label>
                  <input
                    type="password"
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="Enter Password"
                    className={`w-full rounded-xl px-4 py-3 text-xs outline-none transition-all ${
                      isV2 
                        ? 'bg-[#EFEBE2] border border-[#A36B42]/30 text-[#242220] placeholder-[#8C847B] focus:border-[#A36B42]'
                        : 'bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:border-orange-500'
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full font-bold text-sm py-3.5 rounded-full shadow-md transition-all ${
                    isV2
                      ? 'bg-[#242220] hover:bg-[#3D3834] text-white hover:scale-102'
                      : 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950'
                  }`}
                >
                  Log In to Mobile Portal
                </button>
              </form>
            </div>
          ) : (
            /* Admin Portal View */
            <div className="space-y-6">
              
              {/* Navigation Tabs */}
              <div className={`flex items-center justify-between border-b pb-4 flex-wrap gap-3 ${isV2 ? 'border-[#A36B42]/20' : 'border-slate-800'}`}>
                <div className="flex space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                  <button
                    onClick={() => setActiveTab('books')}
                    className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                      activeTab === 'books'
                        ? isV2 ? 'bg-[#242220] text-white shadow-md' : 'bg-orange-500 text-slate-950 shadow-md'
                        : isV2 ? 'bg-[#EFEBE2] text-[#5C554E] hover:text-[#242220] border border-[#A36B42]/20' : 'bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Books Inventory ({books.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('sales')}
                    className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                      activeTab === 'sales'
                        ? isV2 ? 'bg-[#242220] text-white shadow-md' : 'bg-orange-500 text-slate-950 shadow-md'
                        : isV2 ? 'bg-[#EFEBE2] text-[#5C554E] hover:text-[#242220] border border-[#A36B42]/20' : 'bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Date-Wise Sales Entry</span>
                  </button>

                  {userRole === 'Admin' && (
                    <button
                      onClick={() => setActiveTab('settings')}
                      className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                        activeTab === 'settings'
                          ? isV2 ? 'bg-[#242220] text-white shadow-md' : 'bg-orange-500 text-slate-950 shadow-md'
                          : isV2 ? 'bg-[#EFEBE2] text-[#5C554E] hover:text-[#242220] border border-[#A36B42]/20' : 'bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Settings className="w-4 h-4" />
                      <span>⚙️ Site Controls & Settings</span>
                    </button>
                  )}

                  {userRole === 'Admin' && (
                    <button
                      onClick={() => setActiveTab('csv')}
                      className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                        activeTab === 'csv'
                          ? isV2 ? 'bg-[#242220] text-white shadow-md' : 'bg-orange-500 text-slate-950 shadow-md'
                          : isV2 ? 'bg-[#EFEBE2] text-[#5C554E] hover:text-[#242220] border border-[#A36B42]/20' : 'bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Upload className="w-4 h-4" />
                      <span>Bulk CSV Import</span>
                    </button>
                  )}

                  {userRole === 'Admin' && (
                    <button
                      onClick={() => setActiveTab('requests')}
                      className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                        activeTab === 'requests'
                          ? isV2 ? 'bg-[#242220] text-white shadow-md' : 'bg-orange-500 text-slate-950 shadow-md'
                          : isV2 ? 'bg-[#EFEBE2] text-[#5C554E] hover:text-[#242220] border border-[#A36B42]/20' : 'bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                      <span>Stall Requests ({bookings.length})</span>
                    </button>
                  )}
                </div>

                {activeTab === 'books' && userRole === 'Admin' && (
                  <button
                    onClick={handleOpenAddModal}
                    className={`flex items-center space-x-1 text-xs font-extrabold px-4 py-2.5 rounded-full transition-all shadow-md ml-auto ${
                      isV2 ? 'bg-[#242220] hover:bg-[#3D3834] text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Book</span>
                  </button>
                )}
              </div>

              {/* TAB: SITE CONTROLS & SETTINGS */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  {settingsSuccess && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs p-3.5 rounded-xl font-bold flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      <span>{settingsSuccess}</span>
                    </div>
                  )}

                  {/* 1. BOOKS CATALOG FEATURE TOGGLE CARD */}
                  <div className={`p-6 rounded-2xl border space-y-3 ${isV2 ? 'bg-[#EFEBE2] border-[#A36B42]/30' : 'bg-slate-950 border-slate-800'}`}>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <h4 className="text-base font-extrabold flex items-center space-x-2">
                          <BookOpen className="w-5 h-5 text-[#A36B42]" />
                          <span>Public Books Catalog Feature Control</span>
                        </h4>
                        <p className={`text-xs ${isV2 ? 'text-[#5C554E]' : 'text-slate-400'}`}>
                          Enable or disable the Books Catalog section for public visitors on the website.
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          localSettings.catalogEnabled
                            ? 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-700 border border-amber-500/30'
                        }`}>
                          {localSettings.catalogEnabled ? '🟢 Catalog ENABLED (Visible to Public)' : '🔴 Catalog DISABLED ("Updating Soon" Notice Active)'}
                        </span>

                        <button
                          type="button"
                          onClick={handleToggleCatalog}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-full font-bold text-xs shadow-sm transition-all ${
                            localSettings.catalogEnabled
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : 'bg-amber-600 hover:bg-amber-700 text-white'
                          }`}
                        >
                          {localSettings.catalogEnabled ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                          <span>{localSettings.catalogEnabled ? 'Switch Catalog OFF' : 'Switch Catalog ON'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 2. DYNAMIC CONTACT & SOCIAL MEDIA SETTINGS */}
                  <form onSubmit={handleSaveSettingsSubmit} className="space-y-6">
                    <div className={`p-6 rounded-2xl border space-y-4 ${isV2 ? 'bg-[#EFEBE2] border-[#A36B42]/30' : 'bg-slate-950 border-slate-800'}`}>
                      <h4 className="text-sm font-extrabold flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-[#A36B42]" />
                        <span>Dynamic Contact Info & Social Media Links</span>
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="block font-bold mb-1">Phone Number *</label>
                          <input
                            type="text"
                            required
                            value={localSettings.contactInfo.phone}
                            onChange={(e) => setLocalSettings({
                              ...localSettings,
                              contactInfo: { ...localSettings.contactInfo, phone: e.target.value }
                            })}
                            className={`w-full rounded-xl px-3 py-2.5 outline-none ${isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30' : 'bg-slate-900 border-slate-700'}`}
                          />
                        </div>

                        <div>
                          <label className="block font-bold mb-1">Email Address *</label>
                          <input
                            type="email"
                            required
                            value={localSettings.contactInfo.email}
                            onChange={(e) => setLocalSettings({
                              ...localSettings,
                              contactInfo: { ...localSettings.contactInfo, email: e.target.value }
                            })}
                            className={`w-full rounded-xl px-3 py-2.5 outline-none ${isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30' : 'bg-slate-900 border-slate-700'}`}
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block font-bold mb-1">Physical Address / Stall Center</label>
                          <input
                            type="text"
                            value={localSettings.contactInfo.address}
                            onChange={(e) => setLocalSettings({
                              ...localSettings,
                              contactInfo: { ...localSettings.contactInfo, address: e.target.value }
                            })}
                            className={`w-full rounded-xl px-3 py-2.5 outline-none ${isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30' : 'bg-slate-900 border-slate-700'}`}
                          />
                        </div>

                        <div>
                          <label className="block font-bold mb-1">WhatsApp Link / Number</label>
                          <input
                            type="text"
                            value={localSettings.contactInfo.whatsapp}
                            onChange={(e) => setLocalSettings({
                              ...localSettings,
                              contactInfo: { ...localSettings.contactInfo, whatsapp: e.target.value }
                            })}
                            className={`w-full rounded-xl px-3 py-2.5 outline-none ${isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30' : 'bg-slate-900 border-slate-700'}`}
                          />
                        </div>

                        <div>
                          <label className="block font-bold mb-1">Instagram Profile URL</label>
                          <input
                            type="text"
                            value={localSettings.contactInfo.instagram}
                            onChange={(e) => setLocalSettings({
                              ...localSettings,
                              contactInfo: { ...localSettings.contactInfo, instagram: e.target.value }
                            })}
                            className={`w-full rounded-xl px-3 py-2.5 outline-none ${isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30' : 'bg-slate-900 border-slate-700'}`}
                          />
                        </div>

                        <div>
                          <label className="block font-bold mb-1">YouTube Channel URL</label>
                          <input
                            type="text"
                            value={localSettings.contactInfo.youtube}
                            onChange={(e) => setLocalSettings({
                              ...localSettings,
                              contactInfo: { ...localSettings.contactInfo, youtube: e.target.value }
                            })}
                            className={`w-full rounded-xl px-3 py-2.5 outline-none ${isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30' : 'bg-slate-900 border-slate-700'}`}
                          />
                        </div>

                        <div>
                          <label className="block font-bold mb-1">Facebook Page URL</label>
                          <input
                            type="text"
                            value={localSettings.contactInfo.facebook}
                            onChange={(e) => setLocalSettings({
                              ...localSettings,
                              contactInfo: { ...localSettings.contactInfo, facebook: e.target.value }
                            })}
                            className={`w-full rounded-xl px-3 py-2.5 outline-none ${isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30' : 'bg-slate-900 border-slate-700'}`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* 3. HOME HERO BANNER CONFIG */}
                    <div className={`p-6 rounded-2xl border space-y-4 ${isV2 ? 'bg-[#EFEBE2] border-[#A36B42]/30' : 'bg-slate-950 border-slate-800'}`}>
                      <h4 className="text-sm font-extrabold flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-[#A36B42]" />
                        <span>Dynamic Home Hero Banner Config</span>
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="block font-bold mb-1">Hero Badge Text</label>
                          <input
                            type="text"
                            value={localSettings.homeBanner.badge}
                            onChange={(e) => setLocalSettings({
                              ...localSettings,
                              homeBanner: { ...localSettings.homeBanner, badge: e.target.value }
                            })}
                            className={`w-full rounded-xl px-3 py-2.5 outline-none ${isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30' : 'bg-slate-900 border-slate-700'}`}
                          />
                        </div>

                        <div>
                          <label className="block font-bold mb-1">Home Banner Image URL</label>
                          <input
                            type="text"
                            value={localSettings.homeBanner.imageUrl}
                            onChange={(e) => setLocalSettings({
                              ...localSettings,
                              homeBanner: { ...localSettings.homeBanner, imageUrl: e.target.value }
                            })}
                            className={`w-full rounded-xl px-3 py-2.5 outline-none ${isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30' : 'bg-slate-900 border-slate-700'}`}
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block font-bold mb-1">Hero Headline Title</label>
                          <input
                            type="text"
                            value={localSettings.homeBanner.title}
                            onChange={(e) => setLocalSettings({
                              ...localSettings,
                              homeBanner: { ...localSettings.homeBanner, title: e.target.value }
                            })}
                            className={`w-full rounded-xl px-3 py-2.5 outline-none ${isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30' : 'bg-slate-900 border-slate-700'}`}
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block font-bold mb-1">Hero Subtitle</label>
                          <textarea
                            rows={2}
                            value={localSettings.homeBanner.subtitle}
                            onChange={(e) => setLocalSettings({
                              ...localSettings,
                              homeBanner: { ...localSettings.homeBanner, subtitle: e.target.value }
                            })}
                            className={`w-full rounded-xl p-2.5 outline-none resize-none ${isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30' : 'bg-slate-900 border-slate-700'}`}
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={settingsSaving}
                      className={`w-full font-extrabold text-sm py-3.5 rounded-full shadow-lg transition-all ${
                        isV2 ? 'bg-[#242220] hover:bg-[#3D3834] text-white' : 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950'
                      }`}
                    >
                      {settingsSaving ? 'Saving Site Settings...' : 'Save All Site Settings & Feature Controls'}
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 1: BOOKS INVENTORY */}
              {activeTab === 'books' && (
                <div className="space-y-4">
                  {/* Category Filter Pills */}
                  <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                    <span className={`text-xs font-semibold mr-1 flex items-center ${isV2 ? 'text-[#5C554E]' : 'text-slate-400'}`}>
                      <Layers className="w-3.5 h-3.5 mr-1" /> Category:
                    </span>
                    {['All', 'Acharya Prashant Foundation', 'Other Author'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedMainCatFilter(cat)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
                          selectedMainCatFilter === cat
                            ? isV2 ? 'bg-[#242220] text-white border-[#242220]' : 'bg-orange-500/20 text-orange-400 border-orange-500/50'
                            : isV2 ? 'bg-[#EFEBE2] text-[#5C554E] border-[#A36B42]/20' : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        {cat === 'All' ? 'All Books' : cat}
                      </button>
                    ))}
                  </div>

                  {/* Books Table / Cards */}
                  <div className={`rounded-2xl border overflow-hidden shadow-sm ${isV2 ? 'bg-[#EFEBE2] border-[#A36B42]/20' : 'bg-slate-950 border-slate-800'}`}>
                    <div className="overflow-x-auto">
                      <table className={`w-full text-left text-xs ${isV2 ? 'text-[#242220]' : 'text-slate-300'}`}>
                        <thead className={`font-bold border-b uppercase text-[10px] tracking-wider ${
                          isV2 ? 'bg-[#242220] text-white border-[#A36B42]/30' : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}>
                          <tr>
                            <th className="p-3.5">Book Title & Author</th>
                            <th className="p-3.5">🎯 Problem Addressed</th>
                            <th className="p-3.5">MRP (₹)</th>
                            <th className="p-3.5">Buying Cost (₹)</th>
                            <th className="p-3.5">Selling Cost (₹)</th>
                            <th className="p-3.5">Stock</th>
                            <th className="p-3.5 text-center">Lang</th>
                            {userRole === 'Admin' && <th className="p-3.5 text-right">Actions</th>}
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${isV2 ? 'divide-[#A36B42]/15' : 'divide-slate-800/60'}`}>
                          {filteredBooks.length === 0 ? (
                            <tr>
                              <td colSpan={8} className="p-8 text-center text-slate-500 text-xs">
                                No books found under "{selectedMainCatFilter}".
                              </td>
                            </tr>
                          ) : (
                            filteredBooks.map((book) => (
                              <tr key={book.id} className={isV2 ? 'hover:bg-[#F7F4EE]/80 transition-colors' : 'hover:bg-slate-900/60 transition-colors'}>
                                <td className="p-3.5">
                                  <div className="flex items-center space-x-3">
                                    {book.coverImage ? (
                                      <img
                                        src={book.coverImage}
                                        alt={book.title}
                                        className="w-9 h-11 object-cover rounded-lg bg-slate-800 border border-[#A36B42]/20 shrink-0"
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                      />
                                    ) : (
                                      <div className={`w-9 h-11 rounded-lg border flex items-center justify-center shrink-0 ${
                                        isV2 ? 'bg-[#F7F4EE] border-[#A36B42]/30 text-[#A36B42]' : 'bg-slate-800 border-slate-700 text-orange-400'
                                      }`}>
                                        <BookOpen className="w-4 h-4" />
                                      </div>
                                    )}
                                    <div>
                                      <div className={`font-bold ${isV2 ? 'text-[#242220]' : 'text-white'}`}>{book.title}</div>
                                      <div className={`text-[11px] ${isV2 ? 'text-[#A36B42]' : 'text-amber-400'}`}>{book.author}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-3.5">
                                  <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                                    isV2 ? 'bg-[#F7F4EE] text-[#242220] border-[#A36B42]/30' : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                  }`}>
                                    🎯 {book.problemAddressedTag || 'Personal Growth'}
                                  </span>
                                </td>
                                <td className="p-3.5 font-bold">₹{book.mrp || 0}</td>
                                <td className="p-3.5 font-semibold text-rose-600 dark:text-rose-400">₹{book.buyingCost || 0}</td>
                                <td className="p-3.5 font-bold text-emerald-600 dark:text-emerald-400">₹{book.sellingPrice || 0}</td>
                                <td className="p-3.5">
                                  <span className={`px-2.5 py-1 rounded-lg font-extrabold text-[11px] ${
                                    book.availableStock > 10
                                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                      : book.availableStock > 0
                                      ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                                      : 'bg-rose-500/10 text-rose-700 dark:text-rose-400'
                                  }`}>
                                    {book.availableStock} copies
                                  </span>
                                </td>
                                <td className="p-3.5 text-center font-bold text-slate-500">
                                  {book.language}
                                </td>
                                {userRole === 'Admin' && (
                                  <td className="p-3.5 text-right space-x-1">
                                    <button
                                      onClick={() => handleOpenEditModal(book)}
                                      className="p-1.5 text-slate-500 hover:text-[#A36B42] hover:bg-[#F7F4EE] rounded-lg transition-all"
                                      title="Edit details"
                                    >
                                      <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteBook(book.id)}
                                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-[#F7F4EE] rounded-lg transition-all"
                                      title="Delete entry"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </td>
                                )}
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SALES ENTRY */}
              {activeTab === 'sales' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className={`p-5 rounded-2xl border space-y-4 ${isV2 ? 'bg-[#EFEBE2] border-[#A36B42]/20' : 'bg-slate-950 border-slate-800'}`}>
                    <h4 className={`text-sm font-bold flex items-center space-x-1.5 ${isV2 ? 'text-[#242220]' : 'text-orange-400'}`}>
                      <Calendar className="w-4 h-4 text-[#A36B42]" />
                      <span>Record Stall Sale Entry</span>
                    </h4>

                    {salesSuccess && (
                      <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs p-3 rounded-xl font-bold flex items-center space-x-1.5">
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        <span>{salesSuccess}</span>
                      </div>
                    )}

                    <form onSubmit={handleRecordSalesSubmit} className="space-y-3 text-xs">
                      <div>
                        <label className={`block font-bold mb-1 ${isV2 ? 'text-[#4A443E]' : 'text-slate-300'}`}>Sale Date *</label>
                        <input
                          type="date"
                          required
                          value={salesForm.date}
                          onChange={(e) => setSalesForm({ ...salesForm, date: e.target.value })}
                          className={`w-full rounded-xl px-3 py-2.5 text-xs outline-none ${
                            isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30 text-[#242220]' : 'bg-slate-900 border border-slate-700 text-white'
                          }`}
                        />
                      </div>

                      <div>
                        <label className={`block font-bold mb-1 ${isV2 ? 'text-[#4A443E]' : 'text-slate-300'}`}>Select Book *</label>
                        <select
                          required
                          value={salesForm.bookId}
                          onChange={(e) => handleBookSelectForSales(e.target.value)}
                          className={`w-full rounded-xl px-3 py-2.5 text-xs outline-none ${
                            isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30 text-[#242220]' : 'bg-slate-900 border border-slate-700 text-white'
                          }`}
                        >
                          <option value="">-- Choose Book from Inventory --</option>
                          {books.map((b) => (
                            <option key={b.id} value={b.id}>
                              [{b.mainCategory === 'Acharya Prashant Foundation' ? 'AP' : 'Other'}] {b.title} (Stock: {b.availableStock})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className={`block font-bold mb-1 ${isV2 ? 'text-[#4A443E]' : 'text-slate-300'}`}>Qty Sold *</label>
                          <input
                            type="number"
                            min="1"
                            required
                            value={salesForm.quantitySold}
                            onChange={(e) => setSalesForm({ ...salesForm, quantitySold: Math.max(1, parseInt(e.target.value) || 1) })}
                            className={`w-full rounded-xl px-3 py-2.5 text-xs outline-none ${
                              isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30 text-[#242220]' : 'bg-slate-900 border border-slate-700 text-white'
                            }`}
                          />
                        </div>

                        <div>
                          <label className={`block font-bold mb-1 ${isV2 ? 'text-[#4A443E]' : 'text-slate-300'}`}>Selling Cost (₹) *</label>
                          <input
                            type="number"
                            min="0"
                            required
                            value={salesForm.sellingPriceOnDate}
                            onChange={(e) => setSalesForm({ ...salesForm, sellingPriceOnDate: parseFloat(e.target.value) || 0 })}
                            className={`w-full rounded-xl px-3 py-2.5 text-xs outline-none ${
                              isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30 text-[#242220]' : 'bg-slate-900 border border-slate-700 text-white'
                            }`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={`block font-bold mb-1 ${isV2 ? 'text-[#4A443E]' : 'text-slate-300'}`}>Stall Location / Event</label>
                        <input
                          type="text"
                          placeholder="e.g. Sector 17 Stall, Panjab University"
                          value={salesForm.location}
                          onChange={(e) => setSalesForm({ ...salesForm, location: e.target.value })}
                          className={`w-full rounded-xl px-3 py-2.5 text-xs outline-none ${
                            isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30 text-[#242220]' : 'bg-slate-900 border border-slate-700 text-white'
                          }`}
                        />
                      </div>

                      <div>
                        <label className={`block font-bold mb-1 ${isV2 ? 'text-[#4A443E]' : 'text-slate-300'}`}>Recorded By</label>
                        <input
                          type="text"
                          placeholder="Volunteer Name"
                          value={salesForm.recordedBy}
                          onChange={(e) => setSalesForm({ ...salesForm, recordedBy: e.target.value })}
                          className={`w-full rounded-xl px-3 py-2.5 text-xs outline-none ${
                            isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30 text-[#242220]' : 'bg-slate-900 border border-slate-700 text-white'
                          }`}
                        />
                      </div>

                      <button
                        type="submit"
                        className={`w-full font-extrabold py-3 rounded-full shadow-md mt-2 transition-all ${
                          isV2 ? 'bg-[#242220] hover:bg-[#3D3834] text-white' : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950'
                        }`}
                      >
                        Save Sales Entry
                      </button>
                    </form>
                  </div>

                  <div className="lg:col-span-2 space-y-3">
                    <h4 className="text-sm font-bold flex items-center justify-between">
                      <span>Sales Transaction History</span>
                      <span className="text-xs font-extrabold text-[#A36B42]">
                        Total Logged: ₹{salesLogs.reduce((acc, log) => acc + (log.totalAmount || 0), 0)}
                      </span>
                    </h4>

                    <div className={`rounded-2xl border overflow-hidden ${isV2 ? 'bg-[#EFEBE2] border-[#A36B42]/20' : 'bg-slate-950 border-slate-800'}`}>
                      <div className="max-h-[420px] overflow-y-auto">
                        <table className="w-full text-left text-xs">
                          <thead className={`font-bold border-b uppercase text-[10px] ${isV2 ? 'bg-[#242220] text-white border-[#A36B42]/30' : 'bg-slate-900 text-slate-400 border-slate-800'}`}>
                            <tr>
                              <th className="p-3">Date</th>
                              <th className="p-3">Book Name</th>
                              <th className="p-3">Qty</th>
                              <th className="p-3">Price / Copy</th>
                              <th className="p-3">Total (₹)</th>
                              <th className="p-3">Logged By</th>
                            </tr>
                          </thead>
                          <tbody className={`divide-y ${isV2 ? 'divide-[#A36B42]/15 text-[#242220]' : 'divide-slate-800/50 text-slate-300'}`}>
                            {salesLogs.length === 0 ? (
                              <tr>
                                <td colSpan={6} className="p-8 text-center text-slate-500">
                                  No sales logs recorded yet. Use the form on the left to record daily stall sales!
                                </td>
                              </tr>
                            ) : (
                              salesLogs.map((log) => (
                                <tr key={log.id} className={isV2 ? 'hover:bg-[#F7F4EE]' : 'hover:bg-slate-900/60'}>
                                  <td className="p-3 font-semibold text-[#A36B42] whitespace-nowrap">{log.date}</td>
                                  <td className="p-3 font-bold">{log.bookTitle}</td>
                                  <td className="p-3 font-bold text-blue-600">{log.quantitySold}</td>
                                  <td className="p-3">₹{log.sellingPriceOnDate}</td>
                                  <td className="p-3 font-extrabold text-emerald-600">₹{log.totalAmount}</td>
                                  <td className="p-3 text-slate-500 text-[11px]">{log.recordedBy}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: BULK CSV IMPORT */}
              {activeTab === 'csv' && (
                <div className={`max-w-2xl mx-auto p-6 rounded-2xl border space-y-5 ${isV2 ? 'bg-[#EFEBE2] border-[#A36B42]/20' : 'bg-slate-950 border-slate-800'}`}>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2.5 rounded-xl ${isV2 ? 'bg-[#F7F4EE] text-[#A36B42] border border-[#A36B42]/30' : 'bg-blue-500/20 text-blue-400'}`}>
                        <FileSpreadsheet className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold">Bulk CSV Book Import</h4>
                        <p className={`text-xs ${isV2 ? 'text-[#5C554E]' : 'text-slate-400'}`}>Upload or paste CSV rows to instantly add books into Inventory database.</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleDownloadSampleCsv}
                      className={`flex items-center space-x-1.5 font-extrabold text-xs px-3.5 py-2 rounded-full border transition-all shadow-sm ${
                        isV2
                          ? 'bg-[#242220] hover:bg-[#3D3834] text-white border-[#A36B42]/30'
                          : 'bg-slate-900 hover:bg-slate-800 text-orange-400 border-orange-500/30'
                      }`}
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Sample CSV Template</span>
                    </button>
                  </div>

                  {csvMessage && (
                    <div className={`p-3 rounded-xl text-xs font-bold ${
                      csvMessage.includes('Successfully') ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/30'
                    }`}>
                      {csvMessage}
                    </div>
                  )}

                  <div className={`p-4 rounded-xl border space-y-2 text-xs ${isV2 ? 'bg-[#F7F4EE] border-[#A36B42]/30' : 'bg-slate-900/60 border-slate-800'}`}>
                    <span className="font-bold block">📁 Choose .CSV File from Device:</span>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleCsvFileUpload}
                      className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#242220] file:text-white cursor-pointer"
                    />
                  </div>

                  <form onSubmit={handleCsvImportSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold mb-1">Target Main Category *</label>
                      <select
                        value={csvTargetCat}
                        onChange={(e) => setCsvTargetCat(e.target.value)}
                        className={`w-full rounded-xl px-3 py-2.5 text-xs font-bold outline-none ${
                          isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30 text-[#242220]' : 'bg-slate-900 border border-slate-700 text-white'
                        }`}
                      >
                        <option value="Acharya Prashant Foundation">Acharya Prashant Foundation Books</option>
                        <option value="Other Author">Other Author Books</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold mb-1">CSV Text Data</label>
                      <textarea
                        rows={7}
                        placeholder={`Example:\n"1984", "George Orwell", 199, 99.5, 99.5, 5, "English", "Other Author", "Mind & Character", "Mind Control & Freedom", "No"`}
                        value={csvText}
                        onChange={(e) => setCsvText(e.target.value)}
                        className={`w-full rounded-xl p-3 font-mono text-xs resize-none outline-none ${
                          isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30 text-[#242220]' : 'bg-slate-900 border border-slate-700 text-white'
                        }`}
                      />
                    </div>

                    <button
                      type="submit"
                      className={`w-full font-extrabold py-3 rounded-full shadow-md transition-all ${
                        isV2 ? 'bg-[#242220] hover:bg-[#3D3834] text-white' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                      }`}
                    >
                      Import CSV Books into Inventory Database
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 4: STALL REQUESTS */}
              {activeTab === 'requests' && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold">Institutional Bookstall Requests</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bookings.length === 0 ? (
                      <div className={`col-span-2 p-8 text-center text-slate-500 rounded-2xl border ${isV2 ? 'bg-[#EFEBE2] border-[#A36B42]/20' : 'bg-slate-950 border-slate-800'}`}>
                        No stall requests submitted yet.
                      </div>
                    ) : (
                      bookings.map((b) => (
                        <div key={b.id} className={`p-4 rounded-2xl border space-y-2 ${isV2 ? 'bg-[#EFEBE2] border-[#A36B42]/20' : 'bg-slate-950 border-slate-800'}`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-bold">{b.institutionName}</h5>
                              <p className="text-xs text-slate-500">{b.contactPerson} • {b.phone}</p>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              b.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-amber-500/20 text-amber-700 dark:text-amber-400'
                            }`}>
                              {b.status || 'Pending'}
                            </span>
                          </div>
                          <div className="text-xs space-y-1 pt-1 border-t border-[#A36B42]/15">
                            <div><strong>Location:</strong> {b.location}</div>
                            <div><strong>Target Date:</strong> {b.eventDate}</div>
                            <div><strong>Expected Attendees:</strong> {b.expectedAttendees}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

      </div>

      {/* Add / Edit Book Modal */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md overflow-y-auto">
          <div className={`relative w-full max-w-xl rounded-3xl border p-6 space-y-4 shadow-2xl my-8 ${
            isV2 ? 'bg-[#F7F4EE] border-[#A36B42]/30 text-[#242220]' : 'bg-slate-900 border-slate-800 text-white'
          }`}>
            <div className={`flex justify-between items-center border-b pb-3 ${isV2 ? 'border-[#A36B42]/20' : 'border-slate-800'}`}>
              <h4 className={`text-base font-bold flex items-center space-x-2 ${isV2 ? 'font-serif-editorial text-[#242220]' : 'text-orange-400'}`}>
                <Edit3 className="w-5 h-5 text-[#A36B42]" />
                <span>{editingBookId ? 'Edit Book Details & Pricing' : 'Add New Book to Inventory'}</span>
              </h4>
              <button onClick={() => setShowBookModal(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBook} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Main Category *</label>
                  <select
                    value={bookForm.mainCategory}
                    onChange={(e) => setBookForm({ ...bookForm, mainCategory: e.target.value })}
                    className={`w-full rounded-xl px-3 py-2.5 text-xs outline-none ${
                      isV2 ? 'bg-[#EFEBE2] border border-[#A36B42]/30 text-[#242220]' : 'bg-slate-950 border border-slate-700 text-white'
                    }`}
                  >
                    <option value="Acharya Prashant Foundation">Acharya Prashant Foundation Books</option>
                    <option value="Other Author">Other Author Books</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Sub Category / Genre *</label>
                  <select
                    value={bookForm.category}
                    onChange={(e) => setBookForm({ ...bookForm, category: e.target.value })}
                    className={`w-full rounded-xl px-3 py-2.5 text-xs outline-none ${
                      isV2 ? 'bg-[#EFEBE2] border border-[#A36B42]/30 text-[#242220]' : 'bg-slate-950 border border-slate-700 text-white'
                    }`}
                  >
                    <option value="Kids Wisdom">Kids Wisdom</option>
                    <option value="Mind & Character">Mind & Character</option>
                    <option value="Self Discovery">Self Discovery</option>
                    <option value="Vedanta & Classics">Vedanta & Classics</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Book Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1984 or Stree"
                  value={bookForm.title}
                  onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                  className={`w-full rounded-xl px-3 py-2.5 text-xs outline-none ${
                    isV2 ? 'bg-[#EFEBE2] border border-[#A36B42]/30 text-[#242220]' : 'bg-slate-950 border border-slate-700 text-white'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Author Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Author"
                    value={bookForm.author}
                    onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                    className={`w-full rounded-xl px-3 py-2.5 text-xs outline-none ${
                      isV2 ? 'bg-[#EFEBE2] border border-[#A36B42]/30 text-[#242220]' : 'bg-slate-950 border border-slate-700 text-white'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Language Tag</label>
                  <select
                    value={bookForm.language}
                    onChange={(e) => setBookForm({ ...bookForm, language: e.target.value })}
                    className={`w-full rounded-xl px-3 py-2.5 text-xs font-bold outline-none ${
                      isV2 ? 'bg-[#EFEBE2] border border-[#A36B42]/30 text-[#242220]' : 'bg-slate-950 border border-slate-700 text-white'
                    }`}
                  >
                    <option value="Hindi">Hindi</option>
                    <option value="English">English</option>
                    <option value="Bilingual">Bilingual</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">🎯 Problem Addressed Tag *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Overcoming Fear & Stress, Student Focus, Relationships"
                  value={bookForm.problemAddressedTag}
                  onChange={(e) => setBookForm({ ...bookForm, problemAddressedTag: e.target.value })}
                  className={`w-full rounded-xl px-3 py-2.5 text-xs outline-none ${
                    isV2 ? 'bg-[#EFEBE2] border border-[#A36B42]/30 text-[#242220]' : 'bg-slate-950 border border-slate-700 text-white'
                  }`}
                />
              </div>

              <div className={`grid grid-cols-3 gap-3 p-3 rounded-xl border ${isV2 ? 'bg-[#EFEBE2] border-[#A36B42]/20' : 'bg-slate-950 border-slate-800'}`}>
                <div>
                  <label className="block font-bold mb-1 text-slate-500">MRP (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={bookForm.mrp}
                    onChange={(e) => setBookForm({ ...bookForm, mrp: parseFloat(e.target.value) || 0 })}
                    className={`w-full rounded-xl px-3 py-2 text-xs font-bold outline-none ${
                      isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30 text-[#242220]' : 'bg-slate-900 border border-slate-700 text-white'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-rose-600 dark:text-rose-400">Actual Buying Cost (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={bookForm.buyingCost}
                    onChange={(e) => setBookForm({ ...bookForm, buyingCost: parseFloat(e.target.value) || 0 })}
                    className={`w-full rounded-xl px-3 py-2 text-xs font-bold outline-none ${
                      isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30 text-[#242220]' : 'bg-slate-900 border border-slate-700 text-white'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-emerald-600 dark:text-emerald-400">Selling Price (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={bookForm.sellingPrice}
                    onChange={(e) => setBookForm({ ...bookForm, sellingPrice: parseFloat(e.target.value) || 0 })}
                    className={`w-full rounded-xl px-3 py-2 text-xs font-bold outline-none ${
                      isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30 text-[#242220]' : 'bg-slate-900 border border-slate-700 text-white'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Available Stock Count *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={bookForm.availableStock}
                    onChange={(e) => setBookForm({ ...bookForm, availableStock: parseInt(e.target.value) || 0 })}
                    className={`w-full rounded-xl px-3 py-2.5 text-xs font-bold outline-none ${
                      isV2 ? 'bg-[#EFEBE2] border border-[#A36B42]/30 text-[#242220]' : 'bg-slate-950 border border-slate-700 text-white'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Cover Image Path / URL</label>
                  <input
                    type="text"
                    placeholder="/assets/books/book_images/..."
                    value={bookForm.coverImage}
                    onChange={(e) => setBookForm({ ...bookForm, coverImage: e.target.value })}
                    className={`w-full rounded-xl px-3 py-2.5 text-xs outline-none ${
                      isV2 ? 'bg-[#EFEBE2] border border-[#A36B42]/30 text-[#242220]' : 'bg-slate-950 border border-slate-700 text-white'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Book Summary & Description</label>
                <textarea
                  rows={2}
                  placeholder="Summary of book message..."
                  value={bookForm.description}
                  onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
                  className={`w-full rounded-xl p-2.5 text-xs resize-none outline-none ${
                    isV2 ? 'bg-[#EFEBE2] border border-[#A36B42]/30 text-[#242220]' : 'bg-slate-950 border border-slate-700 text-white'
                  }`}
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center space-x-2 font-bold cursor-pointer p-3 rounded-xl border bg-pink-500/10 border-pink-500/30">
                  <input
                    type="checkbox"
                    checked={bookForm.isKidsSection}
                    onChange={(e) => setBookForm({ ...bookForm, isKidsSection: e.target.checked })}
                    className="w-4 h-4 rounded text-pink-500 focus:ring-0"
                  />
                  <span>Select this book for Kids Section on User Home Page 🎈</span>
                </label>
              </div>

              <button
                type="submit"
                className={`w-full font-extrabold text-xs py-3.5 rounded-full shadow-lg mt-3 transition-all ${
                  isV2 ? 'bg-[#242220] hover:bg-[#3D3834] text-white' : 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950'
                }`}
              >
                {editingBookId ? 'Save Updated Book Details' : 'Add Book to Inventory Database'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
