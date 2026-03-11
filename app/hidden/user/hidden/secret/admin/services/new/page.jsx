'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AdminShell from '../../components/AdminShell';
import toast from 'react-hot-toast';

const ICON_OPTIONS = ['FaHome', 'FaStar', 'FaBuilding', 'FaTree', 'FaLightbulb', 'FaTools', 'FaShieldAlt', 'FaCheckCircle', 'FaBolt'];
const COLOR_OPTIONS = ['#E63946', '#F4A261', '#2A9D8F', '#1D3557', '#10B981', '#3B82F6', '#F59E0B', '#8B5CF6'];

export default function NewServicePage() {
    const router = useRouter();
    const fileRef = useRef();
    const detailHeroRef = useRef();
    const galleryRef = useRef();
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [features, setFeatures] = useState(['']);
    const [imagePreview, setImagePreview] = useState('');
    const [form, setForm] = useState({
        title: '', slug: '', description: '', shortDescription: '', longDescription: '',
        icon: 'FaStar', image: '', color: '#E63946',
        number: '01', stat: '', status: 'active', order: 0,
        detail: { heroTitle: '', heroSubtitle: '', heroImage: '', sections: [], gallery: [], faqs: [] },
        seo: { metaTitle: '', metaDescription: '' },
    });

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
    const setField = (path, value) => {
        setForm(prev => {
            const clone = JSON.parse(JSON.stringify(prev || {}));
            const keys = path.split('.');
            let obj = clone;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!obj[keys[i]]) obj[keys[i]] = {};
                obj = obj[keys[i]];
            }
            obj[keys[keys.length - 1]] = value;
            return clone;
        });
    };
    const getVal = (path) => {
        const keys = path.split('.');
        let val = form;
        for (const k of keys) {
            if (val == null) return '';
            val = val[k];
        }
        return val ?? '';
    };

    const generateSlug = (title) =>
        title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        setImagePreview(URL.createObjectURL(file));
        try {
            const fd = new FormData();
            fd.append('file', file);
            const res = await fetch('/api/upload', { method: 'POST', body: fd });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            set('image', data.path);
            toast.success('Image uploaded');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDetailHeroUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append('file', file);
            const res = await fetch('/api/upload', { method: 'POST', body: fd });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setField('detail.heroImage', data.path);
            toast.success('Hero image uploaded');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setUploading(false);
        }
    };

    const addFeature = () => setFeatures(f => [...f, '']);
    const updateFeature = (i, v) => setFeatures(f => f.map((x, j) => j === i ? v : x));
    const removeFeature = (i) => setFeatures(f => f.filter((_, j) => j !== i));

    const addSection = () => setField('detail.sections', [...(getVal('detail.sections') || []), { title: '', content: '' }]);
    const updateSection = (i, field, value) => {
        const sections = [...(getVal('detail.sections') || [])];
        sections[i] = { ...sections[i], [field]: value };
        setField('detail.sections', sections);
    };
    const removeSection = (i) => {
        const sections = [...(getVal('detail.sections') || [])];
        sections.splice(i, 1);
        setField('detail.sections', sections);
    };

    const addFaq = () => setField('detail.faqs', [...(getVal('detail.faqs') || []), { question: '', answer: '' }]);
    const updateFaq = (i, field, value) => {
        const faqs = [...(getVal('detail.faqs') || [])];
        faqs[i] = { ...faqs[i], [field]: value };
        setField('detail.faqs', faqs);
    };
    const removeFaq = (i) => {
        const faqs = [...(getVal('detail.faqs') || [])];
        faqs.splice(i, 1);
        setField('detail.faqs', faqs);
    };

    const addGalleryItem = () => setField('detail.gallery', [...(getVal('detail.gallery') || []), '']);
    const updateGalleryItem = (i, value) => {
        const gallery = [...(getVal('detail.gallery') || [])];
        gallery[i] = value;
        setField('detail.gallery', gallery);
    };
    const removeGalleryItem = (i) => {
        const gallery = [...(getVal('detail.gallery') || [])];
        gallery.splice(i, 1);
        setField('detail.gallery', gallery);
    };

    const handleGalleryUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append('file', file);
            const res = await fetch('/api/upload', { method: 'POST', body: fd });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            const gallery = [...(getVal('detail.gallery') || []), data.path];
            setField('detail.gallery', gallery);
            toast.success('Gallery image added');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const cleanDetail = {
                ...(form.detail || {}),
                sections: (form.detail?.sections || []).filter(s => (s.title || s.content)),
                faqs: (form.detail?.faqs || []).filter(f => (f.question || f.answer)),
                gallery: (form.detail?.gallery || []).filter(Boolean),
            };
            const payload = { ...form, detail: cleanDetail, features: features.filter(f => f.trim()) };
            const res = await fetch('/api/services', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            toast.success('Service created!');
            router.push('/admin/services');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminShell>
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="text-gray-500 hover:text-white transition-colors">← Back</button>
                    <h1 className="text-2xl font-bold text-white">New Service</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 space-y-5">
                        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Basic Info</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1.5">Title *</label>
                                <input
                                    type="text" required value={form.title}
                                    onChange={e => { set('title', e.target.value); set('slug', generateSlug(e.target.value)); }}
                                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-amber-500 text-sm"
                                    placeholder="Residential Lighting"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1.5">Slug (auto-generated)</label>
                                <input
                                    type="text" value={form.slug}
                                    onChange={e => set('slug', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-amber-400 font-mono focus:outline-none focus:border-amber-500 text-sm"
                                    placeholder="residential-lighting"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1.5">Description *</label>
                            <textarea
                                required value={form.description}
                                onChange={e => set('description', e.target.value)}
                                rows={4}
                                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-amber-500 text-sm resize-none"
                                placeholder="Full service description..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1.5">Long Description</label>
                            <textarea
                                value={form.longDescription}
                                onChange={e => set('longDescription', e.target.value)}
                                rows={5}
                                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-amber-500 text-sm resize-none"
                                placeholder="Detailed service description for the service detail page..."
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1.5">Number</label>
                                <input type="text" value={form.number} onChange={e => set('number', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-amber-500 text-sm"
                                    placeholder="01" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1.5">Stat Label</label>
                                <input type="text" value={form.stat} onChange={e => set('stat', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-amber-500 text-sm"
                                    placeholder="500+ Homes" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1.5">Status</label>
                                <select value={form.status} onChange={e => set('status', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-amber-500 text-sm">
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Appearance */}
                    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 space-y-5">
                        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Appearance</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1.5">Icon Name</label>
                                <select value={form.icon} onChange={e => set('icon', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-amber-500 text-sm">
                                    {ICON_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1.5">Accent Color</label>
                                <div className="flex gap-2 flex-wrap">
                                    {COLOR_OPTIONS.map(c => (
                                        <button key={c} type="button" onClick={() => set('color', c)}
                                            className={`w-7 h-7 rounded-lg transition-all ${form.color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-110' : ''}`}
                                            style={{ backgroundColor: c }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* Image upload */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-1.5">Service Image</label>
                            <div className="flex gap-4 items-start">
                                {imagePreview && (
                                    <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded-xl object-cover border border-gray-700" />
                                )}
                                <div className="flex-1">
                                    <input type="file" ref={fileRef} accept="image/*" onChange={handleUpload} className="hidden" />
                                    <button type="button" onClick={() => fileRef.current.click()}
                                        disabled={uploading}
                                        className="px-4 py-2.5 bg-gray-800 border border-dashed border-gray-600 hover:border-amber-500 text-gray-400 hover:text-white rounded-xl text-sm transition-all w-full disabled:opacity-50">
                                        {uploading ? '⏳ Uploading...' : '📁 Choose Image'}
                                    </button>
                                    {form.image && <p className="text-xs text-emerald-400 mt-1.5">✓ {form.image}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Features</h2>
                            <button type="button" onClick={addFeature} className="text-xs text-amber-400 hover:text-amber-300 transition-colors">+ Add Feature</button>
                        </div>
                        {features.map((f, i) => (
                            <div key={i} className="flex gap-2">
                                <input type="text" value={f} onChange={e => updateFeature(i, e.target.value)}
                                    placeholder={`Feature ${i + 1}`}
                                    className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-amber-500 text-sm" />
                                {features.length > 1 && (
                                    <button type="button" onClick={() => removeFeature(i)} className="px-3 py-2.5 text-red-400 hover:bg-red-950/40 rounded-xl transition-colors text-sm">✕</button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Detail Page */}
                    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 space-y-5">
                        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Detail Page</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1.5">Hero Title</label>
                                <input type="text" value={getVal('detail.heroTitle')} onChange={e => setField('detail.heroTitle', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-amber-500 text-sm"
                                    placeholder="Residential Lighting" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1.5">Hero Subtitle</label>
                                <input type="text" value={getVal('detail.heroSubtitle')} onChange={e => setField('detail.heroSubtitle', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-amber-500 text-sm"
                                    placeholder="Short headline for the detail page" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1.5">Hero Image</label>
                            <div className="flex gap-4 items-start">
                                {getVal('detail.heroImage') && (
                                    <img src={getVal('detail.heroImage')} alt="Hero Preview" className="w-24 h-24 rounded-xl object-cover border border-gray-700" />
                                )}
                                <div className="flex-1">
                                    <input type="file" ref={detailHeroRef} accept="image/*" onChange={handleDetailHeroUpload} className="hidden" />
                                    <button type="button" onClick={() => detailHeroRef.current.click()} disabled={uploading}
                                        className="px-4 py-2.5 bg-gray-800 border border-dashed border-gray-600 hover:border-amber-500 text-gray-400 hover:text-white rounded-xl text-sm transition-all w-full disabled:opacity-50">
                                        {uploading ? 'â³ Uploading...' : 'ðŸ“ Upload Hero Image'}
                                    </button>
                                    {getVal('detail.heroImage') && <p className="text-xs text-emerald-400 mt-1.5">âœ“ {getVal('detail.heroImage')}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-semibold text-gray-500 uppercase">Sections</h3>
                                <button type="button" onClick={addSection} className="text-xs text-amber-400 hover:text-amber-300">+ Add Section</button>
                            </div>
                            {(getVal('detail.sections') || []).map((section, i) => (
                                <div key={i} className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 space-y-3">
                                    <input value={section.title || ''} onChange={e => updateSection(i, 'title', e.target.value)}
                                        placeholder="Section Title"
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500" />
                                    <textarea value={section.content || ''} onChange={e => updateSection(i, 'content', e.target.value)}
                                        placeholder="Section content..."
                                        rows={3}
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500 resize-none" />
                                    <button type="button" onClick={() => removeSection(i)} className="text-red-400 text-xs hover:text-red-300">Remove Section</button>
                                </div>
                            ))}
                            {(getVal('detail.sections') || []).length === 0 && (
                                <p className="text-xs text-gray-500">No sections yet.</p>
                            )}
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-semibold text-gray-500 uppercase">FAQs</h3>
                                <button type="button" onClick={addFaq} className="text-xs text-amber-400 hover:text-amber-300">+ Add FAQ</button>
                            </div>
                            {(getVal('detail.faqs') || []).map((faq, i) => (
                                <div key={i} className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 space-y-3">
                                    <input value={faq.question || ''} onChange={e => updateFaq(i, 'question', e.target.value)}
                                        placeholder="Question"
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500" />
                                    <textarea value={faq.answer || ''} onChange={e => updateFaq(i, 'answer', e.target.value)}
                                        placeholder="Answer"
                                        rows={3}
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500 resize-none" />
                                    <button type="button" onClick={() => removeFaq(i)} className="text-red-400 text-xs hover:text-red-300">Remove FAQ</button>
                                </div>
                            ))}
                            {(getVal('detail.faqs') || []).length === 0 && (
                                <p className="text-xs text-gray-500">No FAQs yet.</p>
                            )}
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-semibold text-gray-500 uppercase">Gallery</h3>
                                <div className="flex gap-2">
                                    <button type="button" onClick={addGalleryItem} className="text-xs text-amber-400 hover:text-amber-300">+ Add URL</button>
                                    <input type="file" ref={galleryRef} accept="image/*" onChange={handleGalleryUpload} className="hidden" />
                                    <button type="button" onClick={() => galleryRef.current.click()} className="text-xs text-amber-400 hover:text-amber-300">Upload Image</button>
                                </div>
                            </div>
                            {(getVal('detail.gallery') || []).map((img, i) => (
                                <div key={i} className="flex gap-2 items-center">
                                    <input value={img || ''} onChange={e => updateGalleryItem(i, e.target.value)}
                                        placeholder="Image URL"
                                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs focus:outline-none focus:border-amber-500" />
                                    <button type="button" onClick={() => removeGalleryItem(i)} className="px-2 text-red-400 hover:bg-red-950/40 rounded-lg text-xs">Remove</button>
                                </div>
                            ))}
                            {(getVal('detail.gallery') || []).length === 0 && (
                                <p className="text-xs text-gray-500">No gallery images yet.</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase">SEO</h3>
                            <input value={getVal('seo.metaTitle')} onChange={e => setField('seo.metaTitle', e.target.value)}
                                placeholder="Meta Title"
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500" />
                            <textarea value={getVal('seo.metaDescription')} onChange={e => setField('seo.metaDescription', e.target.value)}
                                placeholder="Meta Description"
                                rows={3}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500 resize-none" />
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-3 justify-end">
                        <button type="button" onClick={() => router.back()} className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm transition-all">Cancel</button>
                        <button type="submit" disabled={saving}
                            className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-semibold rounded-xl text-sm transition-all disabled:opacity-50 shadow-lg shadow-red-500/20">
                            {saving ? '⏳ Saving...' : '✓ Create Service'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminShell>
    );
}
