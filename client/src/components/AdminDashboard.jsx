import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck, Plus, Trash2, Edit3, CheckCircle, X, LogOut, BookOpen, Clock, Building2, User, Phone, Mail, Sparkles, Upload, Calendar, DollarSign, Tag, CheckSquare, Layers, FileSpreadsheet, Smartphone, ShoppingBag, Download, Settings, Globe, Share2, ToggleLeft, ToggleRight, Type, Image as ImageIcon, FileText, Users, ArrowLeft, Eye, RefreshCw, Key, Check, AlertCircle, Copy, FolderOpen, AlertTriangle, ExternalLink, HardDrive
} from 'lucide-react';
import {
  loginAdmin, createBookApi, updateBookApi, deleteBookApi, recordSalesEntryApi, fetchSalesLogsApi,
  fetchSettingsApi, updateSettingsApi,
  fetchEvents, createEventApi, updateEventApi, deleteEventApi,
  fetchGalleryApi, createGalleryApi, updateGalleryApi, deleteGalleryApi,
  fetchCmsBlocksApi, updateCmsBlockApi,
  fetchUsersApi, createUserApi, updateUserApi, deleteUserApi,
  fetchMediaAssetsApi, uploadMediaAssetApi, renameMediaAssetApi, deleteMediaAssetApi, checkMediaUsageApi,
} from '../services/api';

export default function AdminDashboard({
  isOpen,
  onClose,
  isAdmin,
  setIsAdmin,
  userRole,
  setUserRole,
  books,
  setBooks,
  events,
  setEvents,
  bookings,
  setBookings,
  siteVersion = 'v2',
  setSiteVersion,
  siteSettings,
  setSiteSettings,
  onSettingsUpdated,
}) {
  const [activeTab, setActiveTab] = useState('books'); // 'books' | 'events' | 'gallery' | 'assets' | 'cms' | 'sales' | 'settings' | 'users' | 'csv' | 'requests'
  const [selectedMainCatFilter, setSelectedMainCatFilter] = useState('All');
  
  // Auth state
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  // Settings form state
  const [localSettings, setLocalSettings] = useState({
    catalogEnabled: false,
    showVersionToggle: false,
    logoConfig: {
      title: 'Ekatva Foundation',
      subtitle: 'Clarity of Mind • Freedom of Being',
      logoUrl: '/assets/ekatva_v3_logo_1.jpg',
      faviconUrl: '/assets/ekatva_logo_1.jpg',
    },
    quoteConfig: {
      line1: 'Books open minds.',
      line2: 'Dialogues open possibilities.',
      line3: 'Together, we create change.',
      author: 'Ekatva Movement',
    },
    contactInfo: {
      phone: '+91 80544 48521',
      email: 'ekatvafoundation.bookstall@gmail.com',
      address: 'Tricity Stall Center, Sector 17, Chandigarh',
      whatsapp: 'https://wa.me/918054448521',
      instagram: 'https://instagram.com/ekatvafoundation',
      youtube: 'https://youtube.com/acharyaprashant',
      facebook: 'https://facebook.com/ekatvafoundation',
    },
    homeBanner: {
      badge: 'Tricity Campus & PTM Literature Movement',
      title: 'Transforming Lives Through Higher Wisdom Literature',
      subtitle: 'Bringing timeless clarity, Vedanta, and youth character-building literature to schools, universities, and book stalls across Chandigarh, Mohali, and Panchkula.',
      imageUrl: '/assets/cgc1.jpg',
      bannerImages: [
        '/assets/cgc1.jpg',
        '/assets/cgc2.jpg',
        '/assets/cu1.jpg',
        '/assets/ekatva_v3_logo_1.jpg',
      ],
    },
    eventsConfig: {
      bannerImage: '/assets/cgc1.jpg',
      title: 'Campus Impact & Bookstall Gallery',
      description: 'Moments of student engagement, book fairs, and PTM bookstalls across Tricity educational institutions.',
    },
  });

  const [slideshowText, setSlideshowText] = useState('');
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState('');

  // Events CRUD state
  const [adminEvents, setAdminEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    location: '',
    city: 'Mohali',
    date: 'Feb 2026',
    description: '',
    category: 'University Fest',
    imagesText: '/assets/cgc1.jpg\n/assets/cgc2.jpg',
  });
  const [eventActionLoading, setEventActionLoading] = useState(false);
  const [eventUploading, setEventUploading] = useState(false);

  // Gallery state
  const [galleryImages, setGalleryImages] = useState([]);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [editingGalleryId, setEditingGalleryId] = useState(null);
  const [galleryForm, setGalleryForm] = useState({
    image_url: '',
    caption: '',
    category: 'Campus',
    display_order: 0,
    is_active: true,
  });
  const [galleryActionLoading, setGalleryActionLoading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);

  // Media / Assets Manager state
  const [mediaAssets, setMediaAssets] = useState([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaSearch, setMediaSearch] = useState('');
  const [mediaFilter, setMediaFilter] = useState('all'); // 'all' | 'used' | 'unused'
  const [mediaUploading, setMediaUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState('');
  
  // Asset Rename modal
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameTarget, setRenameTarget] = useState(null);
  const [newAssetName, setNewAssetName] = useState('');
  const [renameAutoUpdateRefs, setRenameAutoUpdateRefs] = useState(true);
  const [renameLoading, setRenameLoading] = useState(false);
  const [renameError, setRenameError] = useState('');

  // Asset Delete Warning modal
  const [showDeleteWarningModal, setShowDeleteWarningModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // CMS state
  const [cmsBlocks, setCmsBlocks] = useState({
    hero_section: {
      badge: 'Clarity of Mind, Freedom of Being • स्पष्ट मन, मुक्त जीवन',
      title: 'Timeless Wisdom. Meaningful Dialogues. Stronger Communities.',
      subtitle: 'We bring philosophical books and reflective dialogue to schools, colleges, institutions, and public events across the Tri-City.',
      ctaPrimary: 'Explore Book Catalog',
      ctaSecondary: 'Invite a Bookstall',
    },
    impact_stats: {
      stats: [
        { label: 'Books Distributed', value: '55+' },
        { label: 'Events Conducted', value: '185+' },
        { label: 'Students Engaged', value: '10K+' },
        { label: 'Dedicated Volunteers', value: '50+' },
      ],
    },
    what_we_do: {
      sectionTitle: 'What We Do',
      sectionSubtitle: 'Spreading clarity & character through books and conversation',
      cards: [
        { title: 'Schools & Colleges', description: 'Bringing value-based literature closer to students and educators.' },
        { title: 'Events & Fairs', description: 'Engaging communities through book fairs, melas, and cultural events.' },
        { title: 'Meaningful Dialogue', description: 'Encouraging conversations that nurture clarity, character and compassion.' },
        { title: 'Curated Selection', description: 'Handpicked books on philosophy, self-growth, indian thought and mindful living.' },
      ],
    },
    quote_banner: {
      lines: [
        'Books open minds.',
        'Dialogues open possibilities.',
        'Together, we create change.',
      ],
    },
    invite_banner: {
      tagline: 'Be a part of the movement',
      heading: 'Invite a Bookstall to Your Institution',
      subtext: "Let's bring meaningful books and conversations to your campus, event, or community.",
      ctaText: 'Invite Now',
      image: '/assets/cgc2.jpg',
    },
    footer: {
      tagline: 'Clarity of Mind • Freedom of Being',
      description: 'Bringing timeless wisdom literature to campuses, communities, and youth across the Tri-City region.',
      copyright: '© 2026 Ekatva Foundation Bookstall Initiative. All rights reserved.',
    },
  });
  const [cmsSaving, setCmsSaving] = useState('');
  const [cmsSuccess, setCmsSuccess] = useState('');

  // Users state
  const [usersList, setUsersList] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [userForm, setUserForm] = useState({ username: '', password: '', full_name: '', role: 'Volunteer', is_active: true });
  const [userActionError, setUserActionError] = useState('');

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

  // Hidden File Inputs
  const logoFileInputRef = useRef(null);
  const bannerFileInputRef = useRef(null);
  const slideshowFileInputRef = useRef(null);
  const eventImageInputRef = useRef(null);
  const galleryImageInputRef = useRef(null);
  const mediaManagerInputRef = useRef(null);

  // Loaders
  useEffect(() => {
    if (isOpen) {
      if (isAdmin) {
        loadSalesLogs();
        loadEvents();
        loadGallery();
        loadCmsBlocks();
        loadMediaAssets();
        loadUsers();
      }
      fetchSettingsApi().then((data) => {
        if (data) {
          setLocalSettings(data);
          if (data.homeBanner?.bannerImages) {
            setSlideshowText(data.homeBanner.bannerImages.join('\n'));
          }
          if (setSiteSettings) setSiteSettings(data);
        }
      });
    }
  }, [isOpen, isAdmin, userRole]);

  const loadSalesLogs = async () => {
    const logs = await fetchSalesLogsApi();
    if (logs && Array.isArray(logs)) setSalesLogs(logs);
  };

  const loadEvents = async () => {
    const evts = await fetchEvents();
    if (evts && Array.isArray(evts)) {
      setAdminEvents(evts);
      if (setEvents) setEvents(evts);
    }
  };

  const loadGallery = async () => {
    const imgs = await fetchGalleryApi();
    if (imgs && Array.isArray(imgs)) setGalleryImages(imgs);
  };

  const loadCmsBlocks = async () => {
    const blocks = await fetchCmsBlocksApi();
    if (blocks && typeof blocks === 'object') setCmsBlocks(blocks);
  };

  const loadUsers = async () => {
    const u = await fetchUsersApi();
    if (u && Array.isArray(u)) setUsersList(u);
  };

  const loadMediaAssets = async () => {
    setMediaLoading(true);
    try {
      const assets = await fetchMediaAssetsApi();
      if (assets && Array.isArray(assets)) setMediaAssets(assets);
    } finally {
      setMediaLoading(false);
    }
  };

  const isAdminPlus = userRole === 'Superadmin' || userRole === 'Admin';
  const isSuperadmin = userRole === 'Superadmin';
  const isV2 = siteVersion === 'v2';

  if (!isOpen) return null;

  // ───── FILE CONVERTER HELPER ─────
  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // ───── UPLOAD LOGO HANDLER ─────
  const handleUploadLogoFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await readFileAsBase64(file);
      const res = await uploadMediaAssetApi(file.name, base64);
      if (res && res.url) {
        setLocalSettings((prev) => ({
          ...prev,
          logoConfig: { ...prev.logoConfig, logoUrl: res.url },
        }));
        await loadMediaAssets();
      }
    } catch (err) {
      alert('Failed to upload logo: ' + (err.message || 'Unknown error'));
    }
  };

  // ───── UPLOAD BANNER COVER HANDLER ─────
  const handleUploadBannerFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await readFileAsBase64(file);
      const res = await uploadMediaAssetApi(file.name, base64);
      if (res && res.url) {
        setLocalSettings((prev) => ({
          ...prev,
          homeBanner: { ...prev.homeBanner, imageUrl: res.url },
        }));
        await loadMediaAssets();
      }
    } catch (err) {
      alert('Failed to upload banner: ' + (err.message || 'Unknown error'));
    }
  };

  // ───── UPLOAD SLIDESHOW IMAGE HANDLER ─────
  const handleUploadSlideshowImage = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    for (const file of files) {
      try {
        const base64 = await readFileAsBase64(file);
        const res = await uploadMediaAssetApi(file.name, base64);
        if (res && res.url) {
          setSlideshowText((prev) => (prev ? `${prev.trim()}\n${res.url}` : res.url));
          setLocalSettings((prev) => {
            const currentList = prev.homeBanner?.bannerImages || [];
            return {
              ...prev,
              homeBanner: {
                ...prev.homeBanner,
                bannerImages: [...currentList, res.url],
              },
            };
          });
        }
      } catch (err) {
        console.error('Failed uploading slideshow image:', err);
      }
    }
    await loadMediaAssets();
  };

  // ───── UPLOAD EVENT IMAGE HANDLER ─────
  const handleUploadEventImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEventUploading(true);
    try {
      const base64 = await readFileAsBase64(file);
      const res = await uploadMediaAssetApi(file.name, base64);
      if (res && res.url) {
        setEventForm((prev) => {
          const current = prev.imagesText.trim();
          const nextText = current ? `${current}\n${res.url}` : res.url;
          return { ...prev, imagesText: nextText };
        });
        await loadMediaAssets();
      }
    } catch (err) {
      alert('Failed to upload event image: ' + (err.message || 'Unknown error'));
    } finally {
      setEventUploading(false);
    }
  };

  // ───── UPLOAD GALLERY IMAGE HANDLER ─────
  const handleUploadGalleryImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setGalleryUploading(true);
    try {
      const base64 = await readFileAsBase64(file);
      const res = await uploadMediaAssetApi(file.name, base64);
      if (res && res.url) {
        setGalleryForm((prev) => ({ ...prev, image_url: res.url }));
        await loadMediaAssets();
      }
    } catch (err) {
      alert('Failed to upload gallery image: ' + (err.message || 'Unknown error'));
    } finally {
      setGalleryUploading(false);
    }
  };

  // ───── UPLOAD TO MEDIA LIBRARY HANDLER ─────
  const handleUploadToMediaLibrary = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setMediaUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const base64 = await readFileAsBase64(file);
        await uploadMediaAssetApi(file.name, base64);
      }
      await loadMediaAssets();
    } catch (err) {
      alert('Failed to upload media asset: ' + (err.message || 'Unknown error'));
    } finally {
      setMediaUploading(false);
    }
  };

  // ───── RENAME ASSET HANDLER ─────
  const handleOpenRename = (asset) => {
    setRenameTarget(asset);
    setNewAssetName(asset.name);
    setRenameError('');
    setShowRenameModal(true);
  };

  const handleExecuteRename = async (e) => {
    e.preventDefault();
    if (!renameTarget || !newAssetName.trim()) return;
    setRenameLoading(true);
    setRenameError('');
    try {
      await renameMediaAssetApi(renameTarget.name, newAssetName.trim(), renameAutoUpdateRefs);
      await loadMediaAssets();
      await loadEvents();
      await loadGallery();
      await loadCmsBlocks();
      setShowRenameModal(false);
    } catch (err) {
      setRenameError(err.response?.data?.message || err.message || 'Failed to rename asset');
    } finally {
      setRenameLoading(false);
    }
  };

  // ───── DELETE ASSET HANDLER ─────
  const handlePromptDeleteAsset = (asset) => {
    setDeleteTarget(asset);
    setShowDeleteWarningModal(true);
  };

  const handleExecuteDeleteAsset = async (force = false) => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteMediaAssetApi(deleteTarget.name, force);
      await loadMediaAssets();
      setShowDeleteWarningModal(false);
    } catch (err) {
      alert('Cannot delete: ' + (err.response?.data?.message || err.message));
    } finally {
      setDeleteLoading(false);
    }
  };

  // ───── COPY URL TO CLIPBOARD ─────
  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(''), 2500);
  };

  // ───── LOGIN HANDLER ─────
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

  // ───── SETTINGS HANDLERS ─────
  const handleSaveSettingsSubmit = async (e) => {
    e.preventDefault();
    setSettingsSaving(true);
    setSettingsSuccess('');

    const parsedImages = slideshowText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const updatedSettings = {
      ...localSettings,
      homeBanner: {
        ...localSettings.homeBanner,
        bannerImages: parsedImages.length > 0 ? parsedImages : localSettings.homeBanner.bannerImages,
      },
    };

    try {
      const updated = await updateSettingsApi(updatedSettings);
      if (updated) {
        setLocalSettings(updated);
        if (setSiteSettings) setSiteSettings(updated);
        if (onSettingsUpdated) onSettingsUpdated(updated);
        
        if (updated.logoConfig?.faviconUrl) {
          const link = document.querySelector("link[rel*='icon']");
          if (link) link.href = updated.logoConfig.faviconUrl;
        }

        setSettingsSuccess('✅ Global site settings, logo branding & text below logo saved successfully!');
        setTimeout(() => setSettingsSuccess(''), 4000);
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

  const handleToggleShowVersion = async () => {
    const nextState = !localSettings.showVersionToggle;
    const updatedLocal = { ...localSettings, showVersionToggle: nextState };
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

  // ───── BOOKS CRUD ─────
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
    if (window.confirm('Are you sure you want to delete this book from inventory?')) {
      await deleteBookApi(id);
      setBooks((prev) => prev.filter((b) => b.id !== id));
    }
  };

  // ───── EVENTS CRUD ─────
  const handleOpenAddEvent = () => {
    setEditingEventId(null);
    setEventForm({
      title: '',
      location: '',
      city: 'Mohali',
      date: 'Feb 2026',
      description: '',
      category: 'University Fest',
      imagesText: '/assets/cgc1.jpg\n/assets/cgc2.jpg',
    });
    setShowEventModal(true);
  };

  const handleOpenEditEvent = (ev) => {
    setEditingEventId(ev.id);
    setEventForm({
      title: ev.title || '',
      location: ev.location || '',
      city: ev.city || '',
      date: ev.date || '',
      description: ev.description || '',
      category: ev.category || 'University Fest',
      imagesText: Array.isArray(ev.images) ? ev.images.join('\n') : (ev.image || '/assets/cgc1.jpg'),
    });
    setShowEventModal(true);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    setEventActionLoading(true);
    const parsedImages = eventForm.imagesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      title: eventForm.title,
      location: eventForm.location,
      city: eventForm.city,
      date: eventForm.date,
      description: eventForm.description,
      category: eventForm.category,
      images: parsedImages.length > 0 ? parsedImages : ['/assets/cgc1.jpg'],
    };

    try {
      let updatedList;
      if (editingEventId) {
        updatedList = await updateEventApi(editingEventId, payload);
      } else {
        updatedList = await createEventApi(payload);
      }
      if (updatedList && Array.isArray(updatedList)) {
        setAdminEvents(updatedList);
        if (setEvents) setEvents(updatedList);
      } else {
        await loadEvents();
      }
      setShowEventModal(false);
    } catch (err) {
      console.error('Failed to save event:', err);
    } finally {
      setEventActionLoading(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this campus event and its images?')) {
      const updatedList = await deleteEventApi(id);
      if (updatedList && Array.isArray(updatedList)) {
        setAdminEvents(updatedList);
        if (setEvents) setEvents(updatedList);
      } else {
        await loadEvents();
      }
    }
  };

  // ───── GALLERY CRUD ─────
  const handleOpenAddGallery = () => {
    setEditingGalleryId(null);
    setGalleryForm({
      image_url: '/assets/cgc1.jpg',
      caption: '',
      category: 'Campus',
      display_order: galleryImages.length,
      is_active: true,
    });
    setShowGalleryModal(true);
  };

  const handleOpenEditGallery = (item) => {
    setEditingGalleryId(item.id);
    setGalleryForm({
      image_url: item.image_url || '',
      caption: item.caption || '',
      category: item.category || 'Campus Events',
      display_order: item.display_order || 0,
      is_active: !!item.is_active,
    });
    setShowGalleryModal(true);
  };

  const handleSaveGallery = async (e) => {
    e.preventDefault();
    setGalleryActionLoading(true);
    try {
      let updatedList;
      if (editingGalleryId) {
        updatedList = await updateGalleryApi(editingGalleryId, galleryForm);
      } else {
        updatedList = await createGalleryApi(galleryForm);
      }
      if (updatedList && Array.isArray(updatedList)) {
        setGalleryImages(updatedList);
      } else {
        await loadGallery();
      }
      setShowGalleryModal(false);
    } catch (err) {
      console.error('Failed to save gallery item:', err);
    } finally {
      setGalleryActionLoading(false);
    }
  };

  const handleDeleteGallery = async (id) => {
    if (window.confirm('Are you sure you want to delete this gallery photo?')) {
      const updatedList = await deleteGalleryApi(id);
      if (updatedList && Array.isArray(updatedList)) {
        setGalleryImages(updatedList);
      } else {
        await loadGallery();
      }
    }
  };

  // ───── CMS BLOCKS CRUD ─────
  const handleSaveCmsBlock = async (key, content) => {
    setCmsSaving(key);
    setCmsSuccess('');
    try {
      const updated = await updateCmsBlockApi(key, content);
      if (updated) {
        setCmsBlocks(updated);
        setCmsSuccess(`✅ "${key.replace('_', ' ').toUpperCase()}" updated successfully!`);
        setTimeout(() => setCmsSuccess(''), 3500);
      }
    } catch (err) {
      console.error('Failed to save CMS block:', err);
    } finally {
      setCmsSaving('');
    }
  };

  // ───── USERS CRUD ─────
  const handleOpenAddUser = () => {
    setEditingUserId(null);
    setUserForm({ username: '', password: '', full_name: '', role: 'Volunteer', is_active: true });
    setUserActionError('');
    setShowUserModal(true);
  };

  const handleOpenEditUser = (u) => {
    setEditingUserId(u.id);
    setUserForm({ username: u.username, password: '', full_name: u.full_name, role: u.role, is_active: u.is_active });
    setUserActionError('');
    setShowUserModal(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setUserActionError('');
    try {
      let updated;
      if (editingUserId) {
        const payload = { full_name: userForm.full_name, role: userForm.role, is_active: userForm.is_active };
        if (userForm.password) payload.password = userForm.password;
        updated = await updateUserApi(editingUserId, payload);
      } else {
        if (!userForm.password) {
          setUserActionError('Password is required for new users');
          return;
        }
        updated = await createUserApi(userForm);
      }
      if (updated && Array.isArray(updated)) {
        setUsersList(updated);
        setShowUserModal(false);
      }
    } catch (err) {
      setUserActionError(err.response?.data?.message || err.message || 'Failed to save user');
    }
  };

  const handleDeleteUser = async (u) => {
    if (currentUser?.username === u.username) {
      alert('You cannot delete your own logged-in account!');
      return;
    }
    if (window.confirm(`Are you sure you want to permanently delete user "${u.username}"?`)) {
      const updated = await deleteUserApi(u.id);
      if (updated && Array.isArray(updated)) setUsersList(updated);
    }
  };

  // ───── SALES ENTRY HANDLERS ─────
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

  // ───── CSV IMPORT HANDLERS ─────
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

  const filteredMedia = mediaAssets.filter((asset) => {
    const matchesSearch = asset.name.toLowerCase().includes(mediaSearch.toLowerCase());
    if (!matchesSearch) return false;
    if (mediaFilter === 'used') return asset.usageCount > 0;
    if (mediaFilter === 'unused') return asset.usageCount === 0;
    return true;
  });

  // ══════════════════════════════════════════════════════════════════════
  // RENDER: FULL PAGE VIEW
  // ══════════════════════════════════════════════════════════════════════
  return (
    <div className={`fixed inset-0 z-50 flex flex-col w-full h-full overflow-y-auto ${
      isV2 ? 'bg-[#F7F4EE] text-[#242220]' : 'bg-slate-900 text-white'
    }`}>
      
      {/* ── Hidden File Inputs ── */}
      <input type="file" ref={logoFileInputRef} onChange={handleUploadLogoFile} accept="image/*" className="hidden" />
      <input type="file" ref={bannerFileInputRef} onChange={handleUploadBannerFile} accept="image/*" className="hidden" />
      <input type="file" ref={slideshowFileInputRef} onChange={handleUploadSlideshowImage} accept="image/*" multiple className="hidden" />
      <input type="file" ref={eventImageInputRef} onChange={handleUploadEventImage} accept="image/*" className="hidden" />
      <input type="file" ref={galleryImageInputRef} onChange={handleUploadGalleryImage} accept="image/*" className="hidden" />
      <input type="file" ref={mediaManagerInputRef} onChange={handleUploadToMediaLibrary} accept="image/*" multiple className="hidden" />

      {/* ── Top Bar Header ── */}
      <header className={`sticky top-0 z-40 border-b px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm ${
        isV2 ? 'bg-[#EFEBE2]/95 backdrop-blur-md border-[#A36B42]/20' : 'bg-slate-950/95 backdrop-blur-md border-slate-800'
      }`}>
        
        {/* Brand Left */}
        <div className="flex items-center space-x-3.5">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-md ${
            isV2 ? 'bg-[#242220] text-[#A36B42] border border-[#A36B42]/30' : 'bg-gradient-to-tr from-orange-500 to-amber-400 text-slate-950'
          }`}>
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className={`text-base sm:text-lg font-extrabold leading-tight ${isV2 ? 'font-serif-editorial text-[#242220]' : 'text-white'}`}>
                {localSettings?.logoConfig?.title || 'Ekatva Foundation'} • Admin Portal
              </h1>
              {isAdmin && (
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  userRole === 'Superadmin'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : userRole === 'Admin'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-blue-600 text-white shadow-sm'
                }`}>
                  {userRole}
                </span>
              )}
            </div>
            <p className={`text-xs ${isV2 ? 'text-[#5C554E]' : 'text-slate-400'}`}>
              Full-Suite Content Management, Inventory, Events, Gallery & Assets Library
            </p>
          </div>
        </div>

        {/* Actions Right */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Direct Switch Theme */}
          {setSiteVersion && (
            <button
              type="button"
              onClick={() => setSiteVersion(siteVersion === 'v2' ? 'v1' : 'v2')}
              className={`hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                isV2 ? 'bg-[#242220] text-white border-[#A36B42]/40 hover:bg-[#3D3834]' : 'bg-orange-500 text-slate-950 border-orange-400'
              }`}
              title="Switch Site Design Theme"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Theme: <strong>{siteVersion === 'v2' ? 'v2 Editorial' : 'v1 Modern'}</strong></span>
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => {
                setIsAdmin(false);
                setCurrentUser(null);
              }}
              className={`flex items-center space-x-1.5 text-xs font-bold px-3.5 py-2 rounded-xl border transition-all ${
                isV2 ? 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              }`}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          )}

          {/* Close / Return to Website */}
          <button
            onClick={onClose}
            className={`flex items-center space-x-1.5 text-xs font-bold px-4 py-2 rounded-xl border shadow-sm transition-all cursor-pointer ${
              isV2
                ? 'bg-[#242220] hover:bg-[#3D3834] text-white border-[#242220]'
                : 'bg-slate-800 text-slate-200 hover:text-white border-slate-700'
            }`}
            title="Exit Admin Panel and view live website"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>View Public Website</span>
          </button>
        </div>
      </header>

      {/* ── Main Content Area ── */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
        
        {!isAdmin ? (
          /* ── Login Form Screen ── */
          <div className="max-w-md mx-auto py-16 space-y-6">
            <div className="text-center space-y-2">
              <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto shadow-xl ${
                isV2 ? 'bg-[#242220] text-[#A36B42] border border-[#A36B42]/30' : 'bg-gradient-to-tr from-orange-500 to-amber-400 text-slate-950'
              }`}>
                <ShieldCheck className="w-9 h-9" />
              </div>
              <h2 className={`text-2xl font-bold ${isV2 ? 'font-serif-editorial text-[#242220]' : 'text-white'}`}>
                Staff & Admin Portal Login
              </h2>
              <p className={`text-xs ${isV2 ? 'text-[#5C554E]' : 'text-slate-400'}`}>
                Enter authorized credentials to manage books, campus events, gallery, and site content.
              </p>
            </div>

            {loginError && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs p-3.5 rounded-2xl text-center font-bold flex items-center justify-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className={`p-6 rounded-3xl border shadow-xl space-y-4 ${
              isV2 ? 'bg-[#EFEBE2] border-[#A36B42]/25' : 'bg-slate-950 border-slate-800'
            }`}>
              <div>
                <label className={`block text-xs font-bold mb-1.5 ${isV2 ? 'text-[#4A443E]' : 'text-slate-300'}`}>Username</label>
                <input
                  type="text"
                  required
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  placeholder="e.g. ekatva, prabodhanam, or stall"
                  className={`w-full rounded-xl px-4 py-3 text-xs outline-none transition-all ${
                    isV2 
                      ? 'bg-[#F7F4EE] border border-[#A36B42]/30 text-[#242220] placeholder-[#8C847B] focus:border-[#A36B42]' 
                      : 'bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:border-orange-500'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold mb-1.5 ${isV2 ? 'text-[#4A443E]' : 'text-slate-300'}`}>Password</label>
                <input
                  type="password"
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="Enter Password"
                  className={`w-full rounded-xl px-4 py-3 text-xs outline-none transition-all ${
                    isV2 
                      ? 'bg-[#F7F4EE] border border-[#A36B42]/30 text-[#242220] placeholder-[#8C847B] focus:border-[#A36B42]'
                      : 'bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:border-orange-500'
                  }`}
                />
              </div>

              <button
                type="submit"
                className={`w-full font-bold text-sm py-3.5 rounded-full shadow-lg transition-all ${
                  isV2
                    ? 'bg-[#242220] hover:bg-[#3D3834] text-white hover:scale-102 cursor-pointer'
                    : 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 cursor-pointer'
                }`}
              >
                Log In to Admin Portal
              </button>
            </form>
          </div>
        ) : (
          /* ── Authenticated Admin Portal View ── */
          <div className="space-y-6">
            
            {/* ── Navigation Tab Bar ── */}
            <div className={`flex items-center justify-between border-b pb-4 flex-wrap gap-3 ${isV2 ? 'border-[#A36B42]/20' : 'border-slate-800'}`}>
              <div className="flex space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                
                {/* Books Tab */}
                <button
                  onClick={() => setActiveTab('books')}
                  className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'books'
                      ? isV2 ? 'bg-[#242220] text-white shadow-md' : 'bg-orange-500 text-slate-950 shadow-md'
                      : isV2 ? 'bg-[#EFEBE2] text-[#5C554E] hover:text-[#242220] border border-[#A36B42]/20' : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Books Inventory ({books.length})</span>
                </button>

                {/* Events Tab */}
                {isAdminPlus && (
                  <button
                    onClick={() => setActiveTab('events')}
                    className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === 'events'
                        ? isV2 ? 'bg-[#242220] text-white shadow-md' : 'bg-orange-500 text-slate-950 shadow-md'
                        : isV2 ? 'bg-[#EFEBE2] text-[#5C554E] hover:text-[#242220] border border-[#A36B42]/20' : 'bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>📅 Campus Events ({adminEvents.length})</span>
                  </button>
                )}

                {/* Gallery Tab */}
                {isAdminPlus && (
                  <button
                    onClick={() => setActiveTab('gallery')}
                    className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === 'gallery'
                        ? isV2 ? 'bg-[#242220] text-white shadow-md' : 'bg-orange-500 text-slate-950 shadow-md'
                        : isV2 ? 'bg-[#EFEBE2] text-[#5C554E] hover:text-[#242220] border border-[#A36B42]/20' : 'bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>🖼️ Gallery ({galleryImages.length})</span>
                  </button>
                )}

                {/* Assets / Media Manager Tab */}
                {isAdminPlus && (
                  <button
                    onClick={() => {
                      setActiveTab('assets');
                      loadMediaAssets();
                    }}
                    className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === 'assets'
                        ? isV2 ? 'bg-[#242220] text-white shadow-md' : 'bg-orange-500 text-slate-950 shadow-md'
                        : isV2 ? 'bg-[#EFEBE2] text-[#5C554E] hover:text-[#242220] border border-[#A36B42]/20' : 'bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    <FolderOpen className="w-4 h-4" />
                    <span>📁 Image Assets ({mediaAssets.length})</span>
                  </button>
                )}

                {/* CMS Content Editor Tab */}
                {isAdminPlus && (
                  <button
                    onClick={() => setActiveTab('cms')}
                    className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === 'cms'
                        ? isV2 ? 'bg-[#242220] text-white shadow-md' : 'bg-orange-500 text-slate-950 shadow-md'
                        : isV2 ? 'bg-[#EFEBE2] text-[#5C554E] hover:text-[#242220] border border-[#A36B42]/20' : 'bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>✏️ CMS Content</span>
                  </button>
                )}

                {/* Site Settings Tab */}
                {isAdminPlus && (
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === 'settings'
                        ? isV2 ? 'bg-[#242220] text-white shadow-md' : 'bg-orange-500 text-slate-950 shadow-md'
                        : isV2 ? 'bg-[#EFEBE2] text-[#5C554E] hover:text-[#242220] border border-[#A36B42]/20' : 'bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    <span>⚙️ Site Settings & Logo</span>
                  </button>
                )}

                {/* Users Management Tab */}
                {isAdminPlus && (
                  <button
                    onClick={() => setActiveTab('users')}
                    className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === 'users'
                        ? isV2 ? 'bg-[#242220] text-white shadow-md' : 'bg-orange-500 text-slate-950 shadow-md'
                        : isV2 ? 'bg-[#EFEBE2] text-[#5C554E] hover:text-[#242220] border border-[#A36B42]/20' : 'bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>👥 Users ({usersList.length})</span>
                  </button>
                )}

                {/* Sales Tab */}
                <button
                  onClick={() => setActiveTab('sales')}
                  className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'sales'
                      ? isV2 ? 'bg-[#242220] text-white shadow-md' : 'bg-orange-500 text-slate-950 shadow-md'
                      : isV2 ? 'bg-[#EFEBE2] text-[#5C554E] hover:text-[#242220] border border-[#A36B42]/20' : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Sales Entry</span>
                </button>

                {/* CSV Import */}
                {isAdminPlus && (
                  <button
                    onClick={() => setActiveTab('csv')}
                    className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === 'csv'
                        ? isV2 ? 'bg-[#242220] text-white shadow-md' : 'bg-orange-500 text-slate-950 shadow-md'
                        : isV2 ? 'bg-[#EFEBE2] text-[#5C554E] hover:text-[#242220] border border-[#A36B42]/20' : 'bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    <span>CSV Import</span>
                  </button>
                )}

                {/* Stall Requests */}
                <button
                  onClick={() => setActiveTab('requests')}
                  className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'requests'
                      ? isV2 ? 'bg-[#242220] text-white shadow-md' : 'bg-orange-500 text-slate-950 shadow-md'
                      : isV2 ? 'bg-[#EFEBE2] text-[#5C554E] hover:text-[#242220] border border-[#A36B42]/20' : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Stall Requests ({bookings.length})</span>
                </button>

              </div>

              {/* Action Buttons Top-Right */}
              {activeTab === 'books' && isAdminPlus && (
                <button
                  onClick={handleOpenAddModal}
                  className={`flex items-center space-x-1.5 text-xs font-extrabold px-4 py-2.5 rounded-full transition-all shadow-md ml-auto cursor-pointer ${
                    isV2 ? 'bg-[#242220] hover:bg-[#3D3834] text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Book</span>
                </button>
              )}

              {activeTab === 'events' && isAdminPlus && (
                <button
                  onClick={handleOpenAddEvent}
                  className={`flex items-center space-x-1.5 text-xs font-extrabold px-4 py-2.5 rounded-full transition-all shadow-md ml-auto cursor-pointer ${
                    isV2 ? 'bg-[#242220] hover:bg-[#3D3834] text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Campus Event</span>
                </button>
              )}

              {activeTab === 'gallery' && isAdminPlus && (
                <button
                  onClick={handleOpenAddGallery}
                  className={`flex items-center space-x-1.5 text-xs font-extrabold px-4 py-2.5 rounded-full transition-all shadow-md ml-auto cursor-pointer ${
                    isV2 ? 'bg-[#242220] hover:bg-[#3D3834] text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Gallery Photo</span>
                </button>
              )}

              {activeTab === 'assets' && isAdminPlus && (
                <button
                  onClick={() => mediaManagerInputRef.current?.click()}
                  disabled={mediaUploading}
                  className={`flex items-center space-x-1.5 text-xs font-extrabold px-4 py-2.5 rounded-full transition-all shadow-md ml-auto cursor-pointer ${
                    isV2 ? 'bg-[#242220] hover:bg-[#3D3834] text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>{mediaUploading ? 'Uploading...' : 'Upload Image to Assets'}</span>
                </button>
              )}

              {activeTab === 'users' && isAdminPlus && (
                <button
                  onClick={handleOpenAddUser}
                  className={`flex items-center space-x-1.5 text-xs font-extrabold px-4 py-2.5 rounded-full transition-all shadow-md ml-auto cursor-pointer ${
                    isV2 ? 'bg-[#242220] hover:bg-[#3D3834] text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New User</span>
                </button>
              )}
            </div>

            {/* ══════════════════════════════════════════════════════════════
                TAB 1: ASSETS & MEDIA MANAGER (NEW FEATURE)
                ══════════════════════════════════════════════════════════════ */}
            {activeTab === 'assets' && (
              <div className="space-y-6">
                
                {/* Header controls */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold flex items-center space-x-2">
                      <FolderOpen className="w-5 h-5 text-[#A36B42]" />
                      <span>Static Image Assets & Media Manager</span>
                    </h3>
                    <p className={`text-xs ${isV2 ? 'text-[#5C554E]' : 'text-slate-400'}`}>
                      View, upload, rename, and manage all images in <code>/assets/</code>. Deletion checks active usage across the site.
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 w-full sm:w-auto">
                    <button
                      onClick={() => mediaManagerInputRef.current?.click()}
                      disabled={mediaUploading}
                      className="bg-[#242220] hover:bg-[#3D3834] text-white text-xs font-extrabold px-4 py-2.5 rounded-full shadow flex items-center space-x-1.5 whitespace-nowrap cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{mediaUploading ? 'Uploading...' : 'Upload Image'}</span>
                    </button>

                    <button
                      onClick={loadMediaAssets}
                      disabled={mediaLoading}
                      className="p-2 rounded-xl border border-[#A36B42]/30 hover:bg-black/5 transition-colors"
                      title="Refresh Assets"
                    >
                      <RefreshCw className={`w-4 h-4 ${mediaLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
                  isV2 ? 'bg-[#EFEBE2] border-[#A36B42]/25' : 'bg-slate-950 border-slate-800'
                }`}>
                  {/* Search input */}
                  <input
                    type="text"
                    value={mediaSearch}
                    onChange={(e) => setMediaSearch(e.target.value)}
                    placeholder="Search images by name (e.g. cgc, logo, bal_gita)..."
                    className={`w-full sm:w-72 rounded-xl px-3 py-2 text-xs outline-none ${
                      isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30' : 'bg-slate-900 border-slate-700'
                    }`}
                  />

                  {/* Filter pills */}
                  <div className="flex items-center space-x-2 text-xs font-bold w-full sm:w-auto overflow-x-auto">
                    <button
                      onClick={() => setMediaFilter('all')}
                      className={`px-3 py-1.5 rounded-full transition-all ${
                        mediaFilter === 'all'
                          ? isV2 ? 'bg-[#242220] text-white' : 'bg-orange-500 text-slate-950'
                          : 'bg-transparent text-slate-500 hover:text-black'
                      }`}
                    >
                      All ({mediaAssets.length})
                    </button>

                    <button
                      onClick={() => setMediaFilter('used')}
                      className={`px-3 py-1.5 rounded-full transition-all ${
                        mediaFilter === 'used'
                          ? isV2 ? 'bg-[#242220] text-white' : 'bg-orange-500 text-slate-950'
                          : 'bg-transparent text-slate-500 hover:text-black'
                      }`}
                    >
                      🟢 In Use ({mediaAssets.filter((a) => a.usageCount > 0).length})
                    </button>

                    <button
                      onClick={() => setMediaFilter('unused')}
                      className={`px-3 py-1.5 rounded-full transition-all ${
                        mediaFilter === 'unused'
                          ? isV2 ? 'bg-[#242220] text-white' : 'bg-orange-500 text-slate-950'
                          : 'bg-transparent text-slate-500 hover:text-black'
                      }`}
                    >
                      ⚪ Unused ({mediaAssets.filter((a) => a.usageCount === 0).length})
                    </button>
                  </div>
                </div>

                {/* Copied Alert Toast */}
                {copiedUrl && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs p-3 rounded-xl font-bold flex items-center space-x-2">
                    <Check className="w-4 h-4" />
                    <span>Copied "{copiedUrl}" to clipboard!</span>
                  </div>
                )}

                {/* Media Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {filteredMedia.map((asset) => (
                    <div
                      key={asset.name}
                      className={`rounded-2xl border overflow-hidden flex flex-col justify-between shadow-xs transition-all hover:shadow-md ${
                        isV2 ? 'bg-[#EFEBE2] border-[#A36B42]/25' : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      {/* Image Frame */}
                      <div className="relative h-32 bg-slate-900 overflow-hidden flex items-center justify-center group">
                        <img
                          src={asset.url}
                          alt={asset.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200';
                          }}
                        />

                        {/* Usage Pill Badge */}
                        <div className="absolute top-2 left-2">
                          {asset.usageCount > 0 ? (
                            <span className="bg-emerald-600/90 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow" title={asset.usedIn.join('\n')}>
                              🟢 {asset.usageCount} Used
                            </span>
                          ) : (
                            <span className="bg-slate-700/80 backdrop-blur-xs text-slate-200 text-[9px] font-bold px-2 py-0.5 rounded-full shadow">
                              Unused
                            </span>
                          )}
                        </div>

                        {/* Quick Copy Overlay on Hover */}
                        <button
                          onClick={() => handleCopyUrl(asset.url)}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold space-x-1"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy URL</span>
                        </button>
                      </div>

                      {/* Info & Action bar */}
                      <div className="p-2.5 space-y-1.5 text-xs">
                        <div className="font-bold text-[11px] truncate" title={asset.name}>
                          {asset.name}
                        </div>
                        
                        <div className="flex items-center justify-between text-[10px] text-slate-500">
                          <span>{(asset.sizeBytes / 1024).toFixed(0)} KB</span>
                          <span className="truncate">{asset.name.split('.').pop()?.toUpperCase()}</span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-between pt-1.5 border-t border-[#A36B42]/15">
                          <button
                            onClick={() => handleOpenRename(asset)}
                            className="p-1 text-slate-600 hover:text-black dark:text-slate-300"
                            title="Rename Image Asset"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleCopyUrl(asset.url)}
                            className="p-1 text-slate-600 hover:text-black dark:text-slate-300"
                            title="Copy Path URL"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handlePromptDeleteAsset(asset)}
                            className="p-1 text-rose-600 hover:text-rose-700"
                            title="Delete Asset"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                TAB 2: EVENTS MANAGEMENT CRUD
                ══════════════════════════════════════════════════════════════ */}
            {activeTab === 'events' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold">Campus Events & Bookstall Gallery Management</h3>
                    <p className={`text-xs ${isV2 ? 'text-[#5C554E]' : 'text-slate-400'}`}>
                      Events created here immediately appear on the public homepage and events gallery section.
                    </p>
                  </div>
                  <button
                    onClick={handleOpenAddEvent}
                    className="bg-[#242220] hover:bg-[#3D3834] text-white text-xs font-extrabold px-4 py-2 rounded-full shadow flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New Event</span>
                  </button>
                </div>

                {/* Events Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {adminEvents.map((ev) => {
                    const primaryImg = (Array.isArray(ev.images) && ev.images[0]) || ev.image || '/assets/cgc1.jpg';
                    const imgCount = Array.isArray(ev.images) ? ev.images.length : 1;

                    return (
                      <div
                        key={ev.id}
                        className={`rounded-3xl border overflow-hidden flex flex-col shadow-md transition-all hover:shadow-xl ${
                          isV2 ? 'bg-[#EFEBE2] border-[#A36B42]/30' : 'bg-slate-950 border-slate-800'
                        }`}
                      >
                        {/* Event Photo Preview */}
                        <div className="relative h-48 bg-slate-800 overflow-hidden">
                          <img
                            src={primaryImg}
                            alt={ev.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
                            }}
                          />
                          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                            {ev.category || 'University Fest'}
                          </div>
                          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                            <ImageIcon className="w-3 h-3" />
                            <span>{imgCount} Photos</span>
                          </div>
                        </div>

                        {/* Event Details */}
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div>
                            <div className="flex items-center justify-between text-[11px] text-[#A36B42] font-bold mb-1">
                              <span>📍 {ev.city || 'Tricity'} • {ev.location}</span>
                              <span>📅 {ev.date}</span>
                            </div>
                            <h4 className="font-serif-editorial text-lg font-bold leading-snug line-clamp-2">
                              {ev.title}
                            </h4>
                            <p className={`text-xs mt-2 line-clamp-3 ${isV2 ? 'text-[#5C554E]' : 'text-slate-400'}`}>
                              {ev.description}
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center space-x-2 pt-3 border-t border-[#A36B42]/20">
                            <button
                              onClick={() => handleOpenEditEvent(ev)}
                              className={`flex-1 flex items-center justify-center space-x-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                                isV2 ? 'bg-[#F7F4EE] hover:bg-[#E5DFD3] text-[#242220] border-[#A36B42]/30' : 'bg-slate-900 hover:bg-slate-800 text-white'
                              }`}
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit Event</span>
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(ev.id)}
                              className="p-2 rounded-xl text-rose-600 hover:bg-rose-500/10 border border-rose-400/30 transition-all"
                              title="Delete Event"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                TAB 3: GALLERY PHOTOS CRUD
                ══════════════════════════════════════════════════════════════ */}
            {activeTab === 'gallery' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold">Standalone Gallery Photos Management</h3>
                    <p className={`text-xs ${isV2 ? 'text-[#5C554E]' : 'text-slate-400'}`}>
                      Manage photos shown across site carousels, photo grids, and gallery pages.
                    </p>
                  </div>
                  <button
                    onClick={handleOpenAddGallery}
                    className="bg-[#242220] hover:bg-[#3D3834] text-white text-xs font-extrabold px-4 py-2 rounded-full shadow flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Photo</span>
                  </button>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {galleryImages.map((img) => (
                    <div
                      key={img.id}
                      className={`rounded-2xl border overflow-hidden group shadow-sm flex flex-col ${
                        isV2 ? 'bg-[#EFEBE2] border-[#A36B42]/30' : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      <div className="relative h-40 bg-slate-900 overflow-hidden">
                        <img
                          src={img.image_url}
                          alt={img.caption || 'Gallery image'}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                        <div className="absolute top-2 left-2 bg-black/60 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                          {img.category || 'General'}
                        </div>
                      </div>
                      <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                        <p className="text-xs font-bold line-clamp-1">{img.caption || 'No caption'}</p>
                        <div className="flex items-center justify-between pt-1 border-t border-[#A36B42]/15 text-[10px]">
                          <span className="text-slate-500">Order: {img.display_order}</span>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleOpenEditGallery(img)}
                              className="p-1 text-slate-700 hover:text-black dark:text-slate-300"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteGallery(img.id)}
                              className="p-1 text-rose-600 hover:text-rose-700"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                TAB 4: CMS CONTENT EDITOR
                ══════════════════════════════════════════════════════════════ */}
            {activeTab === 'cms' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold">CMS Content Blocks Editor</h3>
                    <p className={`text-xs ${isV2 ? 'text-[#5C554E]' : 'text-slate-400'}`}>
                      Edit text and headlines across the homepage directly — changes reflect instantly on the live site!
                    </p>
                  </div>
                </div>

                {cmsSuccess && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs p-3.5 rounded-xl font-bold flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>{cmsSuccess}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-6">
                  
                  {/* Hero Section Block */}
                  <div className={`p-6 rounded-3xl border space-y-4 ${isV2 ? 'bg-[#EFEBE2] border-[#A36B42]/30' : 'bg-slate-950 border-slate-800'}`}>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm flex items-center space-x-2">
                        <Type className="w-4 h-4 text-[#A36B42]" />
                        <span>1. Home Hero Headline & Tagline Block</span>
                      </h4>
                      <button
                        onClick={() => handleSaveCmsBlock('hero_section', cmsBlocks.hero_section)}
                        disabled={cmsSaving === 'hero_section'}
                        className="bg-[#242220] hover:bg-[#3D3834] text-white text-xs font-bold px-4 py-2 rounded-full shadow"
                      >
                        {cmsSaving === 'hero_section' ? 'Saving...' : 'Save Hero Block'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="md:col-span-2">
                        <label className="block font-bold mb-1">Badge Text</label>
                        <input
                          type="text"
                          value={cmsBlocks.hero_section?.badge || ''}
                          onChange={(e) => setCmsBlocks({
                            ...cmsBlocks,
                            hero_section: { ...cmsBlocks.hero_section, badge: e.target.value }
                          })}
                          className={`w-full rounded-xl px-3 py-2.5 outline-none ${isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30' : 'bg-slate-900'}`}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block font-bold mb-1">Main Heading</label>
                        <input
                          type="text"
                          value={cmsBlocks.hero_section?.title || ''}
                          onChange={(e) => setCmsBlocks({
                            ...cmsBlocks,
                            hero_section: { ...cmsBlocks.hero_section, title: e.target.value }
                          })}
                          className={`w-full rounded-xl px-3 py-2.5 outline-none ${isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30' : 'bg-slate-900'}`}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block font-bold mb-1">Subtitle / Paragraph</label>
                        <textarea
                          rows={2}
                          value={cmsBlocks.hero_section?.subtitle || ''}
                          onChange={(e) => setCmsBlocks({
                            ...cmsBlocks,
                            hero_section: { ...cmsBlocks.hero_section, subtitle: e.target.value }
                          })}
                          className={`w-full rounded-xl p-2.5 outline-none resize-none ${isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30' : 'bg-slate-900'}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Impact Stats Block */}
                  <div className={`p-6 rounded-3xl border space-y-4 ${isV2 ? 'bg-[#EFEBE2] border-[#A36B42]/30' : 'bg-slate-950 border-slate-800'}`}>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-[#A36B42]" />
                        <span>2. Impact Statistics (4 Counters)</span>
                      </h4>
                      <button
                        onClick={() => handleSaveCmsBlock('impact_stats', cmsBlocks.impact_stats)}
                        disabled={cmsSaving === 'impact_stats'}
                        className="bg-[#242220] hover:bg-[#3D3834] text-white text-xs font-bold px-4 py-2 rounded-full shadow"
                      >
                        {cmsSaving === 'impact_stats' ? 'Saving...' : 'Save Stats Block'}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      {(cmsBlocks.impact_stats?.stats || []).map((st, idx) => (
                        <div key={idx} className={`p-3 rounded-2xl border space-y-2 ${isV2 ? 'bg-[#F7F4EE] border-[#A36B42]/20' : 'bg-slate-900'}`}>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500">Value</label>
                            <input
                              type="text"
                              value={st.value}
                              onChange={(e) => {
                                const newStats = [...cmsBlocks.impact_stats.stats];
                                newStats[idx].value = e.target.value;
                                setCmsBlocks({ ...cmsBlocks, impact_stats: { stats: newStats } });
                              }}
                              className="w-full font-bold px-2 py-1 rounded bg-transparent border-b border-[#A36B42]/30 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500">Label</label>
                            <input
                              type="text"
                              value={st.label}
                              onChange={(e) => {
                                const newStats = [...cmsBlocks.impact_stats.stats];
                                newStats[idx].label = e.target.value;
                                setCmsBlocks({ ...cmsBlocks, impact_stats: { stats: newStats } });
                              }}
                              className="w-full text-xs px-2 py-1 rounded bg-transparent border-b border-[#A36B42]/30 outline-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quote Banner Block */}
                  <div className={`p-6 rounded-3xl border space-y-4 ${isV2 ? 'bg-[#EFEBE2] border-[#A36B42]/30' : 'bg-slate-950 border-slate-800'}`}>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm flex items-center space-x-2">
                        <Type className="w-4 h-4 text-[#A36B42]" />
                        <span>3. Editorial Quote Banner</span>
                      </h4>
                      <button
                        onClick={() => handleSaveCmsBlock('quote_banner', cmsBlocks.quote_banner)}
                        disabled={cmsSaving === 'quote_banner'}
                        className="bg-[#242220] hover:bg-[#3D3834] text-white text-xs font-bold px-4 py-2 rounded-full shadow"
                      >
                        {cmsSaving === 'quote_banner' ? 'Saving...' : 'Save Quote Block'}
                      </button>
                    </div>

                    <div className="space-y-2 text-xs">
                      {(cmsBlocks.quote_banner?.lines || []).map((line, idx) => (
                        <input
                          key={idx}
                          type="text"
                          value={line}
                          onChange={(e) => {
                            const newLines = [...cmsBlocks.quote_banner.lines];
                            newLines[idx] = e.target.value;
                            setCmsBlocks({ ...cmsBlocks, quote_banner: { lines: newLines } });
                          }}
                          className={`w-full rounded-xl px-3 py-2 outline-none ${isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30' : 'bg-slate-900'}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Invite Stall Banner Block */}
                  <div className={`p-6 rounded-3xl border space-y-4 ${isV2 ? 'bg-[#EFEBE2] border-[#A36B42]/30' : 'bg-slate-950 border-slate-800'}`}>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm flex items-center space-x-2">
                        <Building2 className="w-4 h-4 text-[#A36B42]" />
                        <span>4. "Invite a Bookstall" Banner Block</span>
                      </h4>
                      <button
                        onClick={() => handleSaveCmsBlock('invite_banner', cmsBlocks.invite_banner)}
                        disabled={cmsSaving === 'invite_banner'}
                        className="bg-[#242220] hover:bg-[#3D3834] text-white text-xs font-bold px-4 py-2 rounded-full shadow"
                      >
                        {cmsSaving === 'invite_banner' ? 'Saving...' : 'Save Invite Block'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block font-bold mb-1">Tagline</label>
                        <input
                          type="text"
                          value={cmsBlocks.invite_banner?.tagline || ''}
                          onChange={(e) => setCmsBlocks({
                            ...cmsBlocks,
                            invite_banner: { ...cmsBlocks.invite_banner, tagline: e.target.value }
                          })}
                          className={`w-full rounded-xl px-3 py-2.5 outline-none ${isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30' : 'bg-slate-900'}`}
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Heading</label>
                        <input
                          type="text"
                          value={cmsBlocks.invite_banner?.heading || ''}
                          onChange={(e) => setCmsBlocks({
                            ...cmsBlocks,
                            invite_banner: { ...cmsBlocks.invite_banner, heading: e.target.value }
                          })}
                          className={`w-full rounded-xl px-3 py-2.5 outline-none ${isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30' : 'bg-slate-900'}`}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block font-bold mb-1">Subtext</label>
                        <input
                          type="text"
                          value={cmsBlocks.invite_banner?.subtext || ''}
                          onChange={(e) => setCmsBlocks({
                            ...cmsBlocks,
                            invite_banner: { ...cmsBlocks.invite_banner, subtext: e.target.value }
                          })}
                          className={`w-full rounded-xl px-3 py-2.5 outline-none ${isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30' : 'bg-slate-900'}`}
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                TAB 5: SITE SETTINGS & DYNAMIC LOGO BRANDING
                ══════════════════════════════════════════════════════════════ */}
            {activeTab === 'settings' && isAdminPlus && (
              <div className="space-y-6">
                {settingsSuccess && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs p-3.5 rounded-xl font-bold flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>{settingsSuccess}</span>
                  </div>
                )}

                {/* 1. Feature Controls */}
                <div className={`p-6 rounded-3xl border space-y-4 ${isV2 ? 'bg-[#EFEBE2] border-[#A36B42]/30' : 'bg-slate-950 border-slate-800'}`}>
                  <h4 className="text-base font-extrabold flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-[#A36B42]" />
                    <span>Feature Toggles & Public Controls</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Catalog Toggle */}
                    <div className={`p-4 rounded-2xl border flex items-center justify-between ${isV2 ? 'bg-[#F7F4EE] border-[#A36B42]/20' : 'bg-slate-900 border-slate-800'}`}>
                      <div>
                        <span className="font-bold block text-xs">Public Books Catalog</span>
                        <span className="text-[11px] text-slate-500">
                          {localSettings.catalogEnabled ? '🟢 Visible on website' : '🔴 Hidden ("Updating Soon" active)'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleToggleCatalog}
                        className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-full font-bold text-xs shadow-sm transition-all ${
                          localSettings.catalogEnabled ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                        }`}
                      >
                        {localSettings.catalogEnabled ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                        <span>{localSettings.catalogEnabled ? 'Catalog ON' : 'Catalog OFF'}</span>
                      </button>
                    </div>

                    {/* Version Toggle */}
                    <div className={`p-4 rounded-2xl border flex items-center justify-between ${isV2 ? 'bg-[#F7F4EE] border-[#A36B42]/20' : 'bg-slate-900 border-slate-800'}`}>
                      <div>
                        <span className="font-bold block text-xs">Show Version Button on Header</span>
                        <span className="text-[11px] text-slate-500">
                          {localSettings.showVersionToggle ? '🟢 Shown to public' : '🔴 Hidden from public visitors'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleToggleShowVersion}
                        className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-full font-bold text-xs shadow-sm transition-all ${
                          localSettings.showVersionToggle ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-white'
                        }`}
                      >
                        {localSettings.showVersionToggle ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                        <span>{localSettings.showVersionToggle ? 'Button Visible' : 'Button Hidden'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSaveSettingsSubmit} className="space-y-6">
                  
                  {/* 2. DYNAMIC ORGANIZATION NAME, LOGO & PUNCHLINE BRANDING CONFIG CARD */}
                  <div className={`p-6 rounded-3xl border space-y-5 ${isV2 ? 'bg-[#EFEBE2] border-[#A36B42]/30' : 'bg-slate-950 border-slate-800'}`}>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-extrabold flex items-center space-x-2">
                        <Type className="w-4 h-4 text-[#A36B42]" />
                        <span>1. Organization Name, Logo & Punchline Branding</span>
                      </h4>
                      <button
                        type="button"
                        onClick={() => logoFileInputRef.current?.click()}
                        className="bg-[#242220] hover:bg-[#3D3834] text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow flex items-center space-x-1.5 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload New Logo</span>
                      </button>
                    </div>

                    {/* Pixel-Perfect Live Navbar Header Preview Matching Public Header */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block">
                        ★ Live Header Preview (Exactly how visitors see it at top of website):
                      </span>
                      <div className="p-4 sm:p-5 rounded-2xl border bg-[#F7F4EE] border-[#A36B42]/30 shadow-xs flex items-center space-x-4">
                        {/* Circular Logo Frame */}
                        <div className="w-14 h-14 rounded-full bg-[#EFEBE2] border-2 border-[#A36B42]/40 p-1 shadow-md overflow-hidden flex items-center justify-center shrink-0">
                          <img
                            src={localSettings.logoConfig?.logoUrl || '/assets/ekatva_v3_logo_1.jpg'}
                            alt="Current Logo"
                            className="w-full h-full object-cover rounded-full"
                            onError={(e) => { e.target.src = '/assets/ekatva_logo_1.jpg'; }}
                          />
                        </div>
                        {/* Organization Name & Punch Line */}
                        <div>
                          <div className="font-serif-editorial font-bold text-2xl text-[#242220] tracking-tight leading-none">
                            {localSettings.logoConfig?.title || 'Ekatva Foundation'}
                          </div>
                          <div className="text-xs font-bold tracking-wider text-[#A36B42] mt-1">
                            {localSettings.logoConfig?.subtitle || 'Clarity of Mind • Freedom of Being'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Logo Path & Presets */}
                    <div className="space-y-3 text-xs pt-1">
                      <div>
                        <label className="block font-bold mb-1">Logo Image File Path / URL</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={localSettings.logoConfig?.logoUrl || '/assets/ekatva_v3_logo_1.jpg'}
                            onChange={(e) => setLocalSettings({
                              ...localSettings,
                              logoConfig: { ...localSettings.logoConfig, logoUrl: e.target.value }
                            })}
                            className={`flex-1 rounded-xl px-3 py-2.5 outline-none font-mono ${isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30' : 'bg-slate-900'}`}
                            placeholder="/assets/ekatva_v3_logo_1.jpg"
                          />
                          <button
                            type="button"
                            onClick={() => logoFileInputRef.current?.click()}
                            className="px-4 py-2.5 rounded-xl border border-[#A36B42]/30 font-bold bg-[#F7F4EE] hover:bg-[#E5DFD3] transition-colors cursor-pointer"
                          >
                            Browse...
                          </button>
                        </div>
                      </div>

                      {/* Quick Presets */}
                      <div>
                        <span className="block text-[11px] font-bold text-slate-500 mb-1.5">Quick Presets:</span>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { label: 'Ekatva Gold V3 Logo', url: '/assets/ekatva_v3_logo_1.jpg' },
                            { label: 'Ekatva Foundation Logo 1', url: '/assets/ekatva_logo_1.jpg' },
                            { label: 'Ekatva Seal Logo', url: '/assets/cropped-IMG-20260203-WA0031.jpg' },
                            { label: 'Ekatva Logo 3', url: '/assets/ekatva_logo_3.jpg' },
                          ].map((preset) => (
                            <button
                              key={preset.url}
                              type="button"
                              onClick={() => setLocalSettings({
                                ...localSettings,
                                logoConfig: { ...localSettings.logoConfig, logoUrl: preset.url }
                              })}
                              className="px-2.5 py-1 text-[10px] font-bold rounded-lg border bg-[#F7F4EE] hover:bg-[#E5DFD3] border-[#A36B42]/30 transition-all cursor-pointer"
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Logo Title & Text Just Below Logo Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                      <div>
                        <label className="block font-bold mb-1">🏛️ Organization Name (Main Title) *</label>
                        <input
                          type="text"
                          required
                          value={localSettings.logoConfig?.title || ''}
                          onChange={(e) => setLocalSettings({
                            ...localSettings,
                            logoConfig: { ...localSettings.logoConfig, title: e.target.value }
                          })}
                          className={`w-full rounded-xl px-3 py-2.5 outline-none font-bold ${isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30' : 'bg-slate-900'}`}
                          placeholder="e.g. Ekatva Foundation"
                        />
                        <p className="text-[11px] text-slate-500 mt-1">
                          Primary organization title shown on navbar, footers, and page headers.
                        </p>
                      </div>

                      <div>
                        <label className="block font-bold mb-1">⚡ Punch Line / Subtitle (Text Just Below Logo) *</label>
                        <input
                          type="text"
                          required
                          value={localSettings.logoConfig?.subtitle || ''}
                          onChange={(e) => setLocalSettings({
                            ...localSettings,
                            logoConfig: { ...localSettings.logoConfig, subtitle: e.target.value }
                          })}
                          className={`w-full rounded-xl px-3 py-2.5 outline-none font-bold ${isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30' : 'bg-slate-900'}`}
                          placeholder="e.g. Clarity of Mind • Freedom of Being"
                        />
                        <p className="text-[11px] text-[#A36B42] font-semibold mt-1">
                          ★ Tagline rendered directly beneath the organization logo.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 3. EDITORIAL QUOTES & SLOGANS CONFIG CARD */}
                  <div className={`p-6 rounded-3xl border space-y-4 ${isV2 ? 'bg-[#EFEBE2] border-[#A36B42]/30' : 'bg-slate-950 border-slate-800'}`}>
                    <h4 className="text-sm font-extrabold flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-[#A36B42]" />
                      <span>2. Editorial Quote & Slogans Banner</span>
                    </h4>

                    {/* Live Quote Banner Preview */}
                    <div className="p-6 rounded-2xl bg-[#242220] text-white border border-[#A36B42]/30 space-y-2 shadow-md">
                      <div className="text-[10px] uppercase tracking-wider font-bold text-[#A36B42]">Live Quote Banner Preview</div>
                      <blockquote className="font-serif-editorial text-lg sm:text-xl text-[#F7F4EE] leading-snug">
                        “{localSettings.quoteConfig?.line1 || 'Books open minds.'} <br className="hidden sm:inline" />
                        {localSettings.quoteConfig?.line2 || 'Dialogues open possibilities.'} <br className="hidden sm:inline" />
                        <span className="text-[#A36B42] italic">
                          {localSettings.quoteConfig?.line3 || 'Together, we create change.'}”
                        </span>
                      </blockquote>
                      <div className="text-[11px] text-slate-400 font-bold text-right pt-1">
                        — {localSettings.quoteConfig?.author || 'Ekatva Movement'}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                      <div>
                        <label className="block font-bold mb-1">Quote Line 1</label>
                        <input
                          type="text"
                          value={localSettings.quoteConfig?.line1 || ''}
                          onChange={(e) => setLocalSettings({
                            ...localSettings,
                            quoteConfig: { ...localSettings.quoteConfig, line1: e.target.value }
                          })}
                          placeholder="e.g. Books open minds."
                          className={`w-full rounded-xl px-3 py-2.5 outline-none ${isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30' : 'bg-slate-900'}`}
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1">Quote Line 2</label>
                        <input
                          type="text"
                          value={localSettings.quoteConfig?.line2 || ''}
                          onChange={(e) => setLocalSettings({
                            ...localSettings,
                            quoteConfig: { ...localSettings.quoteConfig, line2: e.target.value }
                          })}
                          placeholder="e.g. Dialogues open possibilities."
                          className={`w-full rounded-xl px-3 py-2.5 outline-none ${isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30' : 'bg-slate-900'}`}
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1">Quote Line 3 (Accent Line)</label>
                        <input
                          type="text"
                          value={localSettings.quoteConfig?.line3 || ''}
                          onChange={(e) => setLocalSettings({
                            ...localSettings,
                            quoteConfig: { ...localSettings.quoteConfig, line3: e.target.value }
                          })}
                          placeholder="e.g. Together, we create change."
                          className={`w-full rounded-xl px-3 py-2.5 outline-none font-bold text-[#A36B42] ${isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30' : 'bg-slate-900'}`}
                        />
                      </div>

                      <div className="md:col-span-3">
                        <label className="block font-bold mb-1">Quote Attribution / Author</label>
                        <input
                          type="text"
                          value={localSettings.quoteConfig?.author || ''}
                          onChange={(e) => setLocalSettings({
                            ...localSettings,
                            quoteConfig: { ...localSettings.quoteConfig, author: e.target.value }
                          })}
                          placeholder="e.g. Ekatva Foundation Movement"
                          className={`w-full rounded-xl px-3 py-2.5 outline-none ${isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30' : 'bg-slate-900'}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. HOME HERO BANNER & CIRCULAR ANIMATED SLIDESHOW CONFIG CARD */}
                  <div className={`p-6 rounded-3xl border space-y-5 ${isV2 ? 'bg-[#EFEBE2] border-[#A36B42]/30' : 'bg-slate-950 border-slate-800'}`}>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-extrabold flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-[#A36B42]" />
                        <span>3. Home Page Circular Slideshow & Hero Banner Images</span>
                      </h4>
                      <button
                        type="button"
                        onClick={() => slideshowFileInputRef.current?.click()}
                        className="bg-[#242220] hover:bg-[#3D3834] text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow flex items-center space-x-1.5 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload & Add Photos to Slideshow</span>
                      </button>
                    </div>

                    {/* Live Circular Slideshow Preview Matching Home Page Hero Circle */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block">
                        ★ Live Home Hero Circular Frame Preview (Exactly as visitors see on Home Page):
                      </span>
                      <div className="p-4 sm:p-6 rounded-2xl border bg-[#F7F4EE] border-[#A36B42]/30 flex flex-col sm:flex-row items-center gap-6">
                        
                        {/* Circular Image Container with cycling preview */}
                        <div className="relative w-44 h-44 rounded-full border-4 border-[#A36B42]/40 p-1.5 shadow-xl bg-[#EFEBE2] overflow-hidden shrink-0">
                          {slideshowText.split('\n').filter(Boolean).length > 0 ? (
                            <img
                              src={slideshowText.split('\n').filter(Boolean)[0]}
                              alt="Home Slideshow Preview"
                              className="w-full h-full object-cover rounded-full"
                              onError={(e) => { e.target.src = '/assets/cgc1.jpg'; }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 font-bold text-center p-2">
                              No Images Added
                            </div>
                          )}
                          {/* Bottom Dots Indicator */}
                          <div className="absolute bottom-2.5 inset-x-0 flex justify-center space-x-1">
                            {slideshowText.split('\n').filter(Boolean).slice(0, 5).map((_, i) => (
                              <div key={i} className={`h-1.5 rounded-full ${i === 0 ? 'w-4 bg-[#A36B42]' : 'w-1.5 bg-white/70 shadow'}`} />
                            ))}
                          </div>
                        </div>

                        {/* Summary & Live Stats */}
                        <div className="flex-1 space-y-2 text-center sm:text-left">
                          <div className="font-serif-editorial font-bold text-xl text-[#242220]">
                            {localSettings.homeBanner.title || 'Transforming Lives Through Higher Wisdom Literature'}
                          </div>
                          <p className="text-xs text-[#5C554E] line-clamp-2">
                            {localSettings.homeBanner.subtitle || 'Bringing timeless clarity, Vedanta, and youth character-building literature...'}
                          </p>
                          <div className="text-[11px] font-bold text-[#A36B42] flex items-center justify-center sm:justify-start space-x-2 pt-1">
                            <span className="bg-[#EFEBE2] px-2.5 py-1 rounded-full border border-[#A36B42]/30">
                              📷 {slideshowText.split('\n').filter(Boolean).length} Photos in Slideshow
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Visual Photos Badges with 1-Click Remove (X) */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold">Current Photos in Home Circular Slideshow:</label>
                        <span className="text-[11px] text-slate-500">Click ✕ to remove any image</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {slideshowText.split('\n').filter(Boolean).map((imgUrl, idx) => (
                          <div key={idx} className="relative group rounded-2xl overflow-hidden border border-[#A36B42]/30 bg-[#242220] aspect-square shadow-sm">
                            <img
                              src={imgUrl}
                              alt={`Slideshow image ${idx + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.src = '/assets/cgc1.jpg'; }}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedLines = slideshowText.split('\n').filter(Boolean).filter((_, i) => i !== idx);
                                  setSlideshowText(updatedLines.join('\n'));
                                  setLocalSettings({
                                    ...localSettings,
                                    homeBanner: {
                                      ...localSettings.homeBanner,
                                      bannerImages: updatedLines,
                                    },
                                  });
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-full shadow flex items-center space-x-1 cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Remove</span>
                              </button>
                            </div>
                            <span className="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                              #{idx + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Asset Presets to Add with One Click */}
                    <div className="space-y-1.5 pt-1 text-xs">
                      <span className="block text-[11px] font-bold text-slate-500">Quick Add from Uploaded Assets:</span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { label: '+ CGC Bookstall 1', url: '/assets/cgc1.jpg' },
                          { label: '+ CGC Bookstall 2', url: '/assets/cgc2.jpg' },
                          { label: '+ Chandigarh University', url: '/assets/cu1.jpg' },
                          { label: '+ Ekatva Gold Logo', url: '/assets/ekatva_v3_logo_1.jpg' },
                        ].map((preset) => (
                          <button
                            key={preset.url}
                            type="button"
                            onClick={() => {
                              const lines = slideshowText.split('\n').filter(Boolean);
                              if (!lines.includes(preset.url)) {
                                const newLines = [...lines, preset.url];
                                setSlideshowText(newLines.join('\n'));
                                setLocalSettings({
                                  ...localSettings,
                                  homeBanner: {
                                    ...localSettings.homeBanner,
                                    bannerImages: newLines,
                                  },
                                });
                              }
                            }}
                            className="px-2.5 py-1 text-[10px] font-bold rounded-lg border bg-[#F7F4EE] hover:bg-[#E5DFD3] border-[#A36B42]/30 transition-all cursor-pointer"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Multiline Textarea for Precise URL Editing */}
                    <div className="space-y-1 pt-2">
                      <label className="block text-xs font-bold">🖼️ Slideshow Image URLs (One URL per line)</label>
                      <textarea
                        rows={3}
                        value={slideshowText}
                        onChange={(e) => {
                          setSlideshowText(e.target.value);
                          setLocalSettings({
                            ...localSettings,
                            homeBanner: {
                              ...localSettings.homeBanner,
                              bannerImages: e.target.value.split('\n').filter(Boolean),
                            },
                          });
                        }}
                        placeholder="/assets/cgc1.jpg&#10;/assets/cgc2.jpg&#10;/assets/cu1.jpg"
                        className={`w-full rounded-xl p-3 font-mono text-xs outline-none ${isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30' : 'bg-slate-900'}`}
                      />
                    </div>

                    {/* Hero Texts Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                      <div>
                        <label className="block font-bold mb-1">Hero Badge Text</label>
                        <input
                          type="text"
                          value={localSettings.homeBanner.badge}
                          onChange={(e) => setLocalSettings({
                            ...localSettings,
                            homeBanner: { ...localSettings.homeBanner, badge: e.target.value }
                          })}
                          className={`w-full rounded-xl px-3 py-2.5 outline-none font-bold ${isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30' : 'bg-slate-900'}`}
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1">Primary Banner Cover Image URL</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={localSettings.homeBanner.imageUrl}
                            onChange={(e) => setLocalSettings({
                              ...localSettings,
                              homeBanner: { ...localSettings.homeBanner, imageUrl: e.target.value }
                            })}
                            className={`flex-1 rounded-xl px-3 py-2.5 outline-none font-mono ${isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30' : 'bg-slate-900'}`}
                          />
                          <button
                            type="button"
                            onClick={() => bannerFileInputRef.current?.click()}
                            className="px-3.5 py-2.5 rounded-xl border border-[#A36B42]/30 font-bold bg-[#F7F4EE] hover:bg-[#E5DFD3] transition-colors cursor-pointer"
                          >
                            Upload...
                          </button>
                        </div>
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
                          className={`w-full rounded-xl px-3 py-2.5 outline-none font-bold ${isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30' : 'bg-slate-900'}`}
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
                          className={`w-full rounded-xl p-2.5 outline-none resize-none ${isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30' : 'bg-slate-900'}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 5. CONTACT & SOCIAL MEDIA LINKS CARD */}
                  <div className={`p-6 rounded-3xl border space-y-4 ${isV2 ? 'bg-[#EFEBE2] border-[#A36B42]/30' : 'bg-slate-950 border-slate-800'}`}>
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
                          className={`w-full rounded-xl px-3 py-2.5 outline-none ${isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30' : 'bg-slate-900'}`}
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
                          className={`w-full rounded-xl px-3 py-2.5 outline-none ${isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30' : 'bg-slate-900'}`}
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
                          className={`w-full rounded-xl px-3 py-2.5 outline-none ${isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30' : 'bg-slate-900'}`}
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
                          className={`w-full rounded-xl px-3 py-2.5 outline-none ${isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30' : 'bg-slate-900'}`}
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
                          className={`w-full rounded-xl px-3 py-2.5 outline-none ${isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30' : 'bg-slate-900'}`}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={settingsSaving}
                    className={`w-full font-extrabold text-sm py-4 rounded-full shadow-xl transition-all cursor-pointer ${
                      isV2 ? 'bg-[#242220] hover:bg-[#3D3834] text-white' : 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950'
                    }`}
                  >
                    {settingsSaving ? 'Saving Settings...' : 'Save All Settings, Logo & Text Below Logo'}
                  </button>
                </form>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                TAB 6: USER MANAGEMENT (SUPERADMIN & ADMIN)
                ══════════════════════════════════════════════════════════════ */}
            {activeTab === 'users' && isAdminPlus && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold">Role-Based User Accounts Management</h3>
                    <p className={`text-xs ${isV2 ? 'text-[#5C554E]' : 'text-slate-400'}`}>
                      Create and manage credentials for Superadmins, Admins, and Stall Volunteers.
                    </p>
                  </div>
                  <button
                    onClick={handleOpenAddUser}
                    className="bg-[#242220] hover:bg-[#3D3834] text-white text-xs font-extrabold px-4 py-2 rounded-full shadow flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create User</span>
                  </button>
                </div>

                <div className={`rounded-3xl border overflow-hidden shadow-sm ${
                  isV2 ? 'bg-[#EFEBE2] border-[#A36B42]/25' : 'bg-slate-950 border-slate-800'
                }`}>
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className={`border-b ${isV2 ? 'border-[#A36B42]/20 bg-[#E5DFD3]/60' : 'border-slate-800 bg-slate-900'}`}>
                        <th className="p-4">User</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Created</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#A36B42]/10">
                      {usersList.map((u) => (
                        <tr key={u.id} className="hover:bg-black/5 transition-colors">
                          <td className="p-4">
                            <div className="font-bold">{u.full_name || u.username}</div>
                            <div className="text-[11px] text-slate-500">@{u.username}</div>
                          </td>
                          <td className="p-4">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                              u.role === 'Superadmin'
                                ? 'bg-purple-600 text-white'
                                : u.role === 'Admin'
                                ? 'bg-amber-600 text-white'
                                : 'bg-blue-600 text-white'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              u.is_active ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-rose-500/20 text-rose-700'
                            }`}>
                              {u.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="p-4 text-slate-500 text-[11px]">
                            {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'System'}
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => handleOpenEditUser(u)}
                              className="p-1.5 text-slate-700 hover:text-black dark:text-slate-300"
                              title="Edit user"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u)}
                              className="p-1.5 text-rose-600 hover:text-rose-700"
                              title="Delete user"
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

            {/* ══════════════════════════════════════════════════════════════
                TAB 7: BOOKS INVENTORY
                ══════════════════════════════════════════════════════════════ */}
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
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                        selectedMainCatFilter === cat
                          ? isV2 ? 'bg-[#242220] text-white shadow-sm' : 'bg-orange-500 text-slate-950 shadow-sm'
                          : isV2 ? 'bg-[#EFEBE2] text-[#5C554E] hover:text-[#242220] border border-[#A36B42]/20' : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Books Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredBooks.map((book) => (
                    <div
                      key={book.id}
                      className={`p-4 rounded-3xl border flex flex-col justify-between space-y-3 transition-all hover:shadow-lg ${
                        isV2 ? 'bg-[#EFEBE2] border-[#A36B42]/30' : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="relative h-44 rounded-2xl bg-slate-800 overflow-hidden shadow-inner flex items-center justify-center">
                          {book.coverImage ? (
                            <img
                              src={book.coverImage}
                              alt={book.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80';
                              }}
                            />
                          ) : (
                            <BookOpen className="w-12 h-12 text-slate-600" />
                          )}
                          {book.isKidsSection && (
                            <span className="absolute top-2 right-2 bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                              Kids 🎈
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="text-[10px] font-extrabold text-[#A36B42] uppercase tracking-wider block">
                            {book.mainCategory}
                          </span>
                          <h4 className="font-bold text-sm line-clamp-1">{book.title}</h4>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{book.author}</p>
                        </div>
                        <div className="flex items-center justify-between text-xs font-bold pt-1">
                          <span className="text-emerald-700 dark:text-emerald-400">₹{book.sellingPrice || book.mrp}</span>
                          <span className="text-[11px] text-slate-500">Stock: {book.availableStock}</span>
                        </div>
                      </div>

                      {isAdminPlus && (
                        <div className="flex items-center space-x-2 pt-2 border-t border-[#A36B42]/20">
                          <button
                            onClick={() => handleOpenEditModal(book)}
                            className="flex-1 py-1.5 text-xs font-bold rounded-xl bg-black/5 hover:bg-black/10 transition-colors flex items-center justify-center space-x-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteBook(book.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-500/10 rounded-xl transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                TAB 8: DATE-WISE SALES ENTRY
                ══════════════════════════════════════════════════════════════ */}
            {activeTab === 'sales' && (
              <div className="space-y-6">
                {salesSuccess && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs p-3.5 rounded-xl font-bold flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>{salesSuccess}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Sales Entry Form */}
                  <form
                    onSubmit={handleRecordSalesSubmit}
                    className={`lg:col-span-5 p-6 rounded-3xl border space-y-4 shadow-sm ${
                      isV2 ? 'bg-[#EFEBE2] border-[#A36B42]/30' : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <h4 className="font-bold text-sm flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      <span>Record Date-Wise Sales Transaction</span>
                    </h4>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block font-bold mb-1">Date</label>
                        <input
                          type="date"
                          required
                          value={salesForm.date}
                          onChange={(e) => setSalesForm({ ...salesForm, date: e.target.value })}
                          className={`w-full rounded-xl px-3 py-2.5 outline-none ${isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30' : 'bg-slate-900'}`}
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1">Select Book Sold</label>
                        <select
                          required
                          value={salesForm.bookId}
                          onChange={(e) => handleBookSelectForSales(e.target.value)}
                          className={`w-full rounded-xl px-3 py-2.5 outline-none ${isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30' : 'bg-slate-900'}`}
                        >
                          <option value="">-- Choose Book --</option>
                          {books.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.title} (Stock: {b.availableStock} | ₹{b.sellingPrice || b.mrp})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold mb-1">Qty Sold</label>
                          <input
                            type="number"
                            min="1"
                            required
                            value={salesForm.quantitySold}
                            onChange={(e) => setSalesForm({ ...salesForm, quantitySold: parseInt(e.target.value) || 1 })}
                            className={`w-full rounded-xl px-3 py-2.5 outline-none font-bold ${isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30' : 'bg-slate-900'}`}
                          />
                        </div>

                        <div>
                          <label className="block font-bold mb-1">Selling Price (₹)</label>
                          <input
                            type="number"
                            min="0"
                            required
                            value={salesForm.sellingPriceOnDate}
                            onChange={(e) => setSalesForm({ ...salesForm, sellingPriceOnDate: parseFloat(e.target.value) || 0 })}
                            className={`w-full rounded-xl px-3 py-2.5 outline-none font-bold ${isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30' : 'bg-slate-900'}`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold mb-1">Volunteer / Staff Name</label>
                        <input
                          type="text"
                          required
                          value={salesForm.recordedBy}
                          onChange={(e) => setSalesForm({ ...salesForm, recordedBy: e.target.value })}
                          placeholder="e.g. Rahul Sharma"
                          className={`w-full rounded-xl px-3 py-2.5 outline-none ${isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30' : 'bg-slate-900'}`}
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1">Stall Location</label>
                        <input
                          type="text"
                          value={salesForm.location}
                          onChange={(e) => setSalesForm({ ...salesForm, location: e.target.value })}
                          className={`w-full rounded-xl px-3 py-2.5 outline-none ${isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30' : 'bg-slate-900'}`}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3.5 rounded-full shadow-md"
                    >
                      Record Sale Entry
                    </button>
                  </form>

                  {/* Sales Logs Table */}
                  <div className={`lg:col-span-7 p-6 rounded-3xl border space-y-4 shadow-sm ${
                    isV2 ? 'bg-[#EFEBE2] border-[#A36B42]/30' : 'bg-slate-950 border-slate-800'
                  }`}>
                    <h4 className="font-bold text-sm flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-[#A36B42]" />
                      <span>Recent Sales Transactions</span>
                    </h4>

                    <div className="max-h-96 overflow-y-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className={`border-b ${isV2 ? 'border-[#A36B42]/20' : 'border-slate-800'}`}>
                            <th className="pb-2">Date</th>
                            <th className="pb-2">Book</th>
                            <th className="pb-2">Qty</th>
                            <th className="pb-2">Total</th>
                            <th className="pb-2">By</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#A36B42]/10">
                          {salesLogs.map((log) => {
                            const b = books.find((x) => x.id === log.bookId);
                            return (
                              <tr key={log.id} className="py-2">
                                <td className="py-2.5">{log.date}</td>
                                <td className="py-2.5 font-bold line-clamp-1">{b?.title || log.bookId}</td>
                                <td className="py-2.5">{log.quantitySold}</td>
                                <td className="py-2.5 font-bold text-emerald-600">₹{log.totalAmount || (log.quantitySold * log.sellingPriceOnDate)}</td>
                                <td className="py-2.5 text-slate-500">{log.recordedBy}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                TAB 9: CSV BULK IMPORT
                ══════════════════════════════════════════════════════════════ */}
            {activeTab === 'csv' && isAdminPlus && (
              <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 max-w-2xl mx-auto ${
                isV2 ? 'bg-[#EFEBE2] border-[#A36B42]/30' : 'bg-slate-950 border-slate-800'
              }`}>
                <div>
                  <h4 className="font-bold text-base flex items-center space-x-2">
                    <Upload className="w-5 h-5 text-[#A36B42]" />
                    <span>Bulk Import Books via CSV</span>
                  </h4>
                  <p className={`text-xs mt-1 ${isV2 ? 'text-[#5C554E]' : 'text-slate-400'}`}>
                    Upload or paste inventory rows in CSV format (Title, Author, MRP, BuyingCost, SellingPrice, Stock, Language).
                  </p>
                </div>

                {csvMessage && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs p-3.5 rounded-xl font-bold flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>{csvMessage}</span>
                  </div>
                )}

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold mb-1">Target Category for Imported Books</label>
                    <select
                      value={csvTargetCat}
                      onChange={(e) => setCsvTargetCat(e.target.value)}
                      className={`w-full rounded-xl px-3 py-2.5 outline-none font-bold ${isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30' : 'bg-slate-900'}`}
                    >
                      <option value="Acharya Prashant Foundation">Acharya Prashant Foundation</option>
                      <option value="Other Author">Other Author / General Literature</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Choose CSV File</label>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleCsvFileUpload}
                      className="w-full text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Or Paste CSV Text</label>
                    <textarea
                      rows={6}
                      value={csvText}
                      onChange={(e) => setCsvText(e.target.value)}
                      placeholder='Title, Author, MRP, BuyingCost, SellingPrice, Stock, Language&#10;"Sankalp", "Acharya Prashant", 280, 100, 150, 20, "Hindi"'
                      className={`w-full rounded-2xl p-3 font-mono text-xs outline-none ${isV2 ? 'bg-[#F7F4EE] border border-[#A36B42]/30' : 'bg-slate-900'}`}
                    />
                  </div>

                  <div className="flex items-center space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={handleCsvImportSubmit}
                      className="flex-1 bg-[#242220] hover:bg-[#3D3834] text-white font-bold py-3 rounded-full shadow"
                    >
                      Import Books Into Inventory
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadSampleCsv}
                      className="px-4 py-3 rounded-full border border-[#A36B42]/30 text-xs font-bold hover:bg-black/5"
                    >
                      Download Sample CSV
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                TAB 10: STALL REQUESTS
                ══════════════════════════════════════════════════════════════ */}
            {activeTab === 'requests' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold">Institution & Campus Stall Invitations</h3>
                
                {bookings.length === 0 ? (
                  <div className={`p-12 text-center rounded-3xl border ${isV2 ? 'bg-[#EFEBE2] border-[#A36B42]/20' : 'bg-slate-950'}`}>
                    <Building2 className="w-12 h-12 mx-auto text-slate-400 mb-2" />
                    <p className="text-sm font-bold">No Stall Booking Requests Yet</p>
                    <p className="text-xs text-slate-500">Submissions from the "Invite a Bookstall" form will appear here.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bookings.map((req) => (
                      <div
                        key={req.id}
                        className={`p-5 rounded-3xl border space-y-3 ${isV2 ? 'bg-[#EFEBE2] border-[#A36B42]/30' : 'bg-slate-950 border-slate-800'}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700">
                            {req.status || 'Pending'}
                          </span>
                          <span className="text-[11px] text-slate-500">{req.date || 'Flexible'}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">{req.institutionName || req.name}</h4>
                          <p className="text-xs text-slate-500">{req.location || 'Tricity'}</p>
                        </div>
                        <div className="text-xs space-y-1 pt-2 border-t border-[#A36B42]/15 text-slate-600 dark:text-slate-400">
                          <p>👤 Contact: {req.contactPerson || req.name}</p>
                          <p>📞 Phone: {req.phone}</p>
                          {req.email && <p>✉️ Email: {req.email}</p>}
                          {req.notes && <p className="italic">"{req.notes}"</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════
          MODAL: RENAME ASSET
          ══════════════════════════════════════════════════════════════ */}
      {showRenameModal && renameTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-3xl border p-6 space-y-4 ${
            isV2 ? 'bg-[#F7F4EE] border-[#A36B42]/30 text-[#242220]' : 'bg-slate-900 border-slate-800 text-white'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center space-x-2">
                <Edit3 className="w-4 h-4 text-[#A36B42]" />
                <span>Rename Image Asset</span>
              </h3>
              <button onClick={() => setShowRenameModal(false)} className="p-1 text-slate-500 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            {renameError && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs p-3 rounded-xl font-bold">
                {renameError}
              </div>
            )}

            <form onSubmit={handleExecuteRename} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1 text-slate-500">Current Filename</label>
                <div className="p-2.5 rounded-xl bg-black/5 font-mono text-[11px] truncate">
                  {renameTarget.name}
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">New Filename *</label>
                <input
                  type="text"
                  required
                  value={newAssetName}
                  onChange={(e) => setNewAssetName(e.target.value)}
                  className={`w-full rounded-xl px-3 py-2.5 outline-none font-mono ${
                    isV2 ? 'bg-[#EFEBE2] border border-[#A36B42]/30' : 'bg-slate-950'
                  }`}
                  placeholder="e.g. cgc_fest_2026.jpg"
                />
              </div>

              <div>
                <label className="flex items-start space-x-2 cursor-pointer p-3 rounded-xl border bg-amber-500/10 border-amber-500/25">
                  <input
                    type="checkbox"
                    checked={renameAutoUpdateRefs}
                    onChange={(e) => setRenameAutoUpdateRefs(e.target.checked)}
                    className="w-4 h-4 rounded mt-0.5"
                  />
                  <div>
                    <span className="font-bold block">Automatically update references (Recommended)</span>
                    <span className="text-[11px] text-slate-500">
                      Replaces all occurrences of this image URL in events, gallery, site settings, and CMS blocks so links don't break.
                    </span>
                  </div>
                </label>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRenameModal(false)}
                  className="flex-1 py-2.5 rounded-full border border-slate-300 font-bold hover:bg-black/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={renameLoading}
                  className="flex-1 bg-[#242220] hover:bg-[#3D3834] text-white font-bold py-2.5 rounded-full shadow"
                >
                  {renameLoading ? 'Renaming...' : 'Rename Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MODAL: DELETE ASSET WARNING POPUP
          ══════════════════════════════════════════════════════════════ */}
      {showDeleteWarningModal && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className={`w-full max-w-lg rounded-3xl border p-6 space-y-5 shadow-2xl ${
            isV2 ? 'bg-[#F7F4EE] border-[#A36B42]/30 text-[#242220]' : 'bg-slate-900 border-slate-800 text-white'
          }`}>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-600 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base">Confirm Asset Deletion</h3>
                <p className="text-xs text-slate-500 font-mono">{deleteTarget.name}</p>
              </div>
            </div>

            {/* If used anywhere, show prominent warning */}
            {deleteTarget.usageCount > 0 ? (
              <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 space-y-2.5 text-xs">
                <div className="flex items-center space-x-2 font-extrabold text-amber-700 dark:text-amber-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>⚠️ Caution: This image is actively used on your website!</span>
                </div>
                <p className="text-[#5C554E] leading-relaxed">
                  This image is currently referenced in <strong>{deleteTarget.usageCount} location(s)</strong>:
                </p>
                <ul className="list-disc list-inside space-y-1 font-semibold text-xs text-slate-700 dark:text-slate-300 bg-[#F7F4EE] dark:bg-slate-950 p-3 rounded-xl border border-amber-500/20 max-h-36 overflow-y-auto">
                  {deleteTarget.usedIn.map((loc, idx) => (
                    <li key={idx} className="truncate">
                      {loc}
                    </li>
                  ))}
                </ul>
                <p className="text-[11px] text-rose-600 font-bold">
                  Deleting this file will cause broken image placeholders in the sections listed above.
                </p>
              </div>
            ) : (
              <p className="text-xs text-[#5C554E]">
                This image is currently not used anywhere on the website. Are you sure you want to permanently remove it from <code>/assets/</code>?
              </p>
            )}

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteWarningModal(false)}
                className="flex-1 py-3 rounded-full border border-slate-300 font-bold text-xs hover:bg-black/5 transition-colors cursor-pointer"
              >
                Cancel (Keep Image)
              </button>
              <button
                type="button"
                onClick={() => handleExecuteDeleteAsset(true)}
                disabled={deleteLoading}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-3 rounded-full shadow transition-colors cursor-pointer"
              >
                {deleteLoading ? 'Deleting...' : deleteTarget.usageCount > 0 ? 'Force Delete Anyway' : 'Delete Asset'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MODALS: ADD/EDIT BOOK, EVENT, GALLERY, USER
          ══════════════════════════════════════════════════════════════ */}

      {/* Add / Edit Book Modal */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className={`w-full max-w-lg rounded-3xl border p-6 space-y-4 max-h-[90vh] overflow-y-auto ${
            isV2 ? 'bg-[#F7F4EE] border-[#A36B42]/30 text-[#242220]' : 'bg-slate-900 border-slate-800 text-white'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base">{editingBookId ? 'Edit Book Details' : 'Add New Book'}</h3>
              <button onClick={() => setShowBookModal(false)} className="p-1 text-slate-500 hover:text-black"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveBook} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Book Title *</label>
                <input
                  type="text"
                  required
                  value={bookForm.title}
                  onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                  className={`w-full rounded-xl px-3 py-2 outline-none ${isV2 ? 'bg-[#EFEBE2] border border-[#A36B42]/30' : 'bg-slate-950'}`}
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Author *</label>
                <input
                  type="text"
                  required
                  value={bookForm.author}
                  onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                  className={`w-full rounded-xl px-3 py-2 outline-none ${isV2 ? 'bg-[#EFEBE2] border border-[#A36B42]/30' : 'bg-slate-950'}`}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Main Category</label>
                  <select
                    value={bookForm.mainCategory}
                    onChange={(e) => setBookForm({ ...bookForm, mainCategory: e.target.value })}
                    className={`w-full rounded-xl px-3 py-2 outline-none ${isV2 ? 'bg-[#EFEBE2] border border-[#A36B42]/30' : 'bg-slate-950'}`}
                  >
                    <option value="Acharya Prashant Foundation">Acharya Prashant Foundation</option>
                    <option value="Other Author">Other Author</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Language</label>
                  <select
                    value={bookForm.language}
                    onChange={(e) => setBookForm({ ...bookForm, language: e.target.value })}
                    className={`w-full rounded-xl px-3 py-2 outline-none ${isV2 ? 'bg-[#EFEBE2] border border-[#A36B42]/30' : 'bg-slate-950'}`}
                  >
                    <option value="Hindi">Hindi</option>
                    <option value="English">English</option>
                    <option value="Bilingual">Bilingual</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    value={bookForm.mrp}
                    onChange={(e) => setBookForm({ ...bookForm, mrp: parseFloat(e.target.value) || 0 })}
                    className={`w-full rounded-xl px-3 py-2 outline-none ${isV2 ? 'bg-[#EFEBE2] border border-[#A36B42]/30' : 'bg-slate-950'}`}
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    value={bookForm.sellingPrice}
                    onChange={(e) => setBookForm({ ...bookForm, sellingPrice: parseFloat(e.target.value) || 0 })}
                    className={`w-full rounded-xl px-3 py-2 outline-none font-bold ${isV2 ? 'bg-[#EFEBE2] border border-[#A36B42]/30' : 'bg-slate-950'}`}
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Stock</label>
                  <input
                    type="number"
                    value={bookForm.availableStock}
                    onChange={(e) => setBookForm({ ...bookForm, availableStock: parseInt(e.target.value) || 0 })}
                    className={`w-full rounded-xl px-3 py-2 outline-none font-bold ${isV2 ? 'bg-[#EFEBE2] border border-[#A36B42]/30' : 'bg-slate-950'}`}
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold mb-1">Cover Image Path / URL</label>
                <input
                  type="text"
                  value={bookForm.coverImage}
                  onChange={(e) => setBookForm({ ...bookForm, coverImage: e.target.value })}
                  placeholder="/assets/books/sankalp.jpg"
                  className={`w-full rounded-xl px-3 py-2 outline-none ${isV2 ? 'bg-[#EFEBE2] border border-[#A36B42]/30' : 'bg-slate-950'}`}
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={bookForm.description}
                  onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
                  className={`w-full rounded-xl p-2 outline-none resize-none ${isV2 ? 'bg-[#EFEBE2] border border-[#A36B42]/30' : 'bg-slate-950'}`}
                />
              </div>
              <div>
                <label className="flex items-center space-x-2 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bookForm.isKidsSection}
                    onChange={(e) => setBookForm({ ...bookForm, isKidsSection: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <span>Show in Kids Wisdom Corner 🎈</span>
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-[#242220] hover:bg-[#3D3834] text-white font-bold py-3 rounded-full shadow mt-2"
              >
                {editingBookId ? 'Save Book Changes' : 'Add Book to Inventory'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Event Modal with Direct Image Upload */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className={`w-full max-w-lg rounded-3xl border p-6 space-y-4 max-h-[90vh] overflow-y-auto ${
            isV2 ? 'bg-[#F7F4EE] border-[#A36B42]/30 text-[#242220]' : 'bg-slate-900 border-slate-800 text-white'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base">{editingEventId ? 'Edit Campus Event' : 'Add Campus Event'}</h3>
              <button onClick={() => setShowEventModal(false)} className="p-1 text-slate-500 hover:text-black"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveEvent} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  placeholder="e.g. CGC Landran Bookstall & PTM Wisdom Pavilion"
                  className={`w-full rounded-xl px-3 py-2 outline-none ${isV2 ? 'bg-[#EFEBE2] border border-[#A36B42]/30' : 'bg-slate-950'}`}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={eventForm.location}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                    placeholder="e.g. CGC Landran Campus"
                    className={`w-full rounded-xl px-3 py-2 outline-none ${isV2 ? 'bg-[#EFEBE2] border border-[#A36B42]/30' : 'bg-slate-950'}`}
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">City</label>
                  <input
                    type="text"
                    value={eventForm.city}
                    onChange={(e) => setEventForm({ ...eventForm, city: e.target.value })}
                    placeholder="e.g. Mohali, Chandigarh"
                    className={`w-full rounded-xl px-3 py-2 outline-none ${isV2 ? 'bg-[#EFEBE2] border border-[#A36B42]/30' : 'bg-slate-950'}`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Date</label>
                  <input
                    type="text"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    placeholder="e.g. Feb 2026"
                    className={`w-full rounded-xl px-3 py-2 outline-none ${isV2 ? 'bg-[#EFEBE2] border border-[#A36B42]/30' : 'bg-slate-950'}`}
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Category</label>
                  <select
                    value={eventForm.category}
                    onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                    className={`w-full rounded-xl px-3 py-2 outline-none ${isV2 ? 'bg-[#EFEBE2] border border-[#A36B42]/30' : 'bg-slate-950'}`}
                  >
                    <option value="University Fest">University Fest</option>
                    <option value="School PTM">School PTM</option>
                    <option value="PTM Stall">PTM Stall</option>
                    <option value="Book Fair">Book Fair</option>
                    <option value="School Camp">School Camp</option>
                    <option value="Community Stall">Community Stall</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  placeholder="Engaged 1,200+ students and parents..."
                  className={`w-full rounded-xl p-2 outline-none resize-none ${isV2 ? 'bg-[#EFEBE2] border border-[#A36B42]/30' : 'bg-slate-950'}`}
                />
              </div>
              
              {/* Event Image URLs & Direct Upload Button */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold">Event Image URLs (One URL per line)</label>
                  <button
                    type="button"
                    onClick={() => eventImageInputRef.current?.click()}
                    disabled={eventUploading}
                    className="bg-[#242220] hover:bg-[#3D3834] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow flex items-center space-x-1 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>{eventUploading ? 'Uploading...' : 'Upload New Image'}</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={eventForm.imagesText}
                  onChange={(e) => setEventForm({ ...eventForm, imagesText: e.target.value })}
                  placeholder="/assets/cgc1.jpg&#10;/assets/cgc2.jpg"
                  className={`w-full rounded-xl p-2 font-mono outline-none ${isV2 ? 'bg-[#EFEBE2] border border-[#A36B42]/30' : 'bg-slate-950'}`}
                />
              </div>

              <button
                type="submit"
                disabled={eventActionLoading}
                className="w-full bg-[#242220] hover:bg-[#3D3834] text-white font-bold py-3 rounded-full shadow mt-2"
              >
                {eventActionLoading ? 'Saving Event...' : editingEventId ? 'Save Event Changes' : 'Create Campus Event'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Gallery Modal with Direct Image Upload */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-3xl border p-6 space-y-4 ${
            isV2 ? 'bg-[#F7F4EE] border-[#A36B42]/30 text-[#242220]' : 'bg-slate-900 border-slate-800 text-white'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base">{editingGalleryId ? 'Edit Gallery Photo' : 'Add Gallery Photo'}</h3>
              <button onClick={() => setShowGalleryModal(false)} className="p-1 text-slate-500 hover:text-black"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveGallery} className="space-y-3 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold">Image URL / Asset Path *</label>
                  <button
                    type="button"
                    onClick={() => galleryImageInputRef.current?.click()}
                    disabled={galleryUploading}
                    className="bg-[#242220] hover:bg-[#3D3834] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow flex items-center space-x-1 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>{galleryUploading ? 'Uploading...' : 'Upload Image'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={galleryForm.image_url}
                  onChange={(e) => setGalleryForm({ ...galleryForm, image_url: e.target.value })}
                  placeholder="/assets/cgc1.jpg"
                  className={`w-full rounded-xl px-3 py-2 outline-none ${isV2 ? 'bg-[#EFEBE2] border border-[#A36B42]/30' : 'bg-slate-950'}`}
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Caption / Title</label>
                <input
                  type="text"
                  value={galleryForm.caption}
                  onChange={(e) => setGalleryForm({ ...galleryForm, caption: e.target.value })}
                  placeholder="e.g. CGC Landran Bookstall Setup"
                  className={`w-full rounded-xl px-3 py-2 outline-none ${isV2 ? 'bg-[#EFEBE2] border border-[#A36B42]/30' : 'bg-slate-950'}`}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Category</label>
                  <select
                    value={galleryForm.category}
                    onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                    className={`w-full rounded-xl px-3 py-2 outline-none ${isV2 ? 'bg-[#EFEBE2] border border-[#A36B42]/30' : 'bg-slate-950'}`}
                  >
                    <option value="Campus">Campus</option>
                    <option value="PTM">PTM</option>
                    <option value="Stalls">Stalls</option>
                    <option value="Dialogue">Dialogue</option>
                    <option value="Community">Community</option>
                    <option value="Book Fairs">Book Fairs</option>
                    <option value="Kids Corner">Kids Corner</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Display Order</label>
                  <input
                    type="number"
                    value={galleryForm.display_order}
                    onChange={(e) => setGalleryForm({ ...galleryForm, display_order: parseInt(e.target.value) || 0 })}
                    className={`w-full rounded-xl px-3 py-2 outline-none ${isV2 ? 'bg-[#EFEBE2] border border-[#A36B42]/30' : 'bg-slate-950'}`}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={galleryActionLoading}
                className="w-full bg-[#242220] hover:bg-[#3D3834] text-white font-bold py-3 rounded-full shadow mt-2"
              >
                {galleryActionLoading ? 'Saving...' : editingGalleryId ? 'Save Photo Changes' : 'Add to Gallery'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-3xl border p-6 space-y-4 ${
            isV2 ? 'bg-[#F7F4EE] border-[#A36B42]/30 text-[#242220]' : 'bg-slate-900 border-slate-800 text-white'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base">{editingUserId ? 'Edit User Account' : 'Create User Account'}</h3>
              <button onClick={() => setShowUserModal(false)} className="p-1 text-slate-500 hover:text-black"><X className="w-5 h-5" /></button>
            </div>

            {userActionError && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs p-2.5 rounded-xl font-bold">
                {userActionError}
              </div>
            )}

            <form onSubmit={handleSaveUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Username *</label>
                <input
                  type="text"
                  required
                  disabled={!!editingUserId}
                  value={userForm.username}
                  onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                  placeholder="e.g. rahul_volunteer"
                  className={`w-full rounded-xl px-3 py-2 outline-none ${isV2 ? 'bg-[#EFEBE2] border border-[#A36B42]/30' : 'bg-slate-950'}`}
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  value={userForm.full_name}
                  onChange={(e) => setUserForm({ ...userForm, full_name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className={`w-full rounded-xl px-3 py-2 outline-none ${isV2 ? 'bg-[#EFEBE2] border border-[#A36B42]/30' : 'bg-slate-950'}`}
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Role *</label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                  className={`w-full rounded-xl px-3 py-2 outline-none font-bold ${isV2 ? 'bg-[#EFEBE2] border border-[#A36B42]/30' : 'bg-slate-950'}`}
                >
                  <option value="Volunteer">Volunteer (Sales Entry & Requests Only)</option>
                  <option value="Admin">Admin (Books, Events, Gallery & CMS)</option>
                  <option value="Superadmin">Superadmin (Full Access + Settings & Users)</option>
                </select>
              </div>
              <div>
                <label className="block font-bold mb-1">{editingUserId ? 'New Password (leave blank to keep current)' : 'Password *'}</label>
                <input
                  type="password"
                  required={!editingUserId}
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  placeholder="Enter Password"
                  className={`w-full rounded-xl px-3 py-2 outline-none ${isV2 ? 'bg-[#EFEBE2] border border-[#A36B42]/30' : 'bg-slate-950'}`}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#242220] hover:bg-[#3D3834] text-white font-bold py-3 rounded-full shadow mt-2"
              >
                {editingUserId ? 'Update User' : 'Create User Account'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
