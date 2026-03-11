'use client';
import { useState, useEffect } from 'react';
import AdminShell from '../components/AdminShell';
import toast from 'react-hot-toast';

export default function HomepagePage() {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('hero');

    useEffect(() => {
        fetch('/api/homepage').then(r => r.json()).then(d => {
            setContent(d.content || {});
        }).catch(() => toast.error('Failed to load content')).finally(() => setLoading(false));
    }, []);

    const deepSet = (path, value) => {
        setContent(prev => {
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
        if (!content) return '';
        const keys = path.split('.');
        let val = content;
        for (const k of keys) {
            if (val == null) return '';
            val = val[k];
        }
        return val ?? '';
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/homepage', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(content),
            });
            if (!res.ok) throw new Error();
            toast.success('Homepage content saved!');
        } catch {
            toast.error('Failed to save content');
        } finally {
            setSaving(false);
        }
    };

    const Field = ({ label, path, multiline = false, placeholder = '' }) => (
        <div>
            <label className="block text-xs text-gray-500 mb-1">{label}</label>
            {multiline ? (
                <textarea
                    value={getVal(path)}
                    onChange={e => deepSet(path, e.target.value)}
                    rows={3}
                    placeholder={placeholder}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500 text-sm resize-none"
                />
            ) : (
                <input
                    type="text"
                    value={getVal(path)}
                    onChange={e => deepSet(path, e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500 text-sm"
                />
            )}
        </div>
    );
    const handleUpload = async (e, path) => {
        const file = e.target.files[0];
        if (!file) return;
        const toastId = toast.loading('Uploading...');
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error);
            deepSet(path, result.path);
            toast.success('Uploaded successfully', { id: toastId });
        } catch (err) {
            toast.error(err.message, { id: toastId });
        }
    };

    const ImageField = ({ label, path }) => (
        <div>
            <label className="block text-xs text-gray-500 mb-1">{label}</label>
            <div className="flex items-center gap-4 p-3 bg-gray-800 border border-gray-700 rounded-xl">
                {getVal(path) ? (
                    <img src={getVal(path)} alt={label} className="w-16 h-12 object-cover bg-gray-900 rounded border border-gray-700" />
                ) : (
                    <div className="w-16 h-12 bg-gray-900 rounded border border-gray-700 flex items-center justify-center text-gray-600 text-[10px]">No Img</div>
                )}
                <div className="flex-1">
                    <input type="file" accept="image/*" onChange={e => handleUpload(e, path)} className="hidden" id={`upload-${path}`} />
                    <label htmlFor={`upload-${path}`} className="cursor-pointer text-xs text-amber-500 hover:text-amber-400 font-medium">
                        Change {label}
                    </label>
                    <p className="text-[10px] text-gray-500 truncate mt-0.5">{getVal(path) || 'No file selected'}</p>
                </div>
            </div>
        </div>
    );

    const tabs = [
        { id: 'hero', label: '🔥 Hero' },
        { id: 'about', label: '📖 About' },
        { id: 'howWeWork', label: '🔧 Process' },
        { id: 'whyChooseUs', label: '⭐ Why Choose' },
        { id: 'workShowcase', label: 'Recent Work' },
        { id: 'aboutPage', label: '👤 Founder' },
        { id: 'contactPage', label: '📞 Contact Pg' },
        { id: 'faq', label: '❓ FAQ' },
        { id: 'contact', label: '📍 Contact Info' },
    ];

    if (loading) return (
        <AdminShell>
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        </AdminShell>
    );

    return (
        <AdminShell>
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Site Content</h1>
                        <p className="text-gray-500 text-sm">Edit sections and page content</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            id="save-homepage"
                            className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-semibold rounded-xl text-sm transition-all disabled:opacity-50 shadow-lg shadow-red-500/20"
                        >
                            {saving ? '⏳ Saving...' : '✓ Save All Changes'}
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id
                                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20'
                                : 'bg-gray-900 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content panels */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 space-y-6 shadow-xl">
                    {activeTab === 'hero' && (
                        <div className="space-y-4">
                            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Hero Section</h2>
                            <ImageField label="Hero Background Image" path="hero.backgroundImage" />
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <Field label="Title Part 1" path="hero.title.part1" placeholder="CHRISTMAS " />
                                <Field label="Title Part 2" path="hero.title.part2" placeholder="LIGHTING" />
                                <Field label="Title Part 3" path="hero.title.part3" placeholder="SERVICES" />
                            </div>
                            <Field label="Subtitle" path="hero.subtitle" placeholder="Holiday or Permanent..." multiline />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="Badge Text" path="hero.badge.text" />
                                <Field label="Badge Icon" path="hero.badge.icon" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-800">
                                <div className="space-y-3">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase">Primary Button</h3>
                                    <Field label="Text" path="hero.cta.primary.text" />
                                    <Field label="Link" path="hero.cta.primary.link" />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase">Secondary Button</h3>
                                    <Field label="Text" path="hero.cta.secondary.text" />
                                    <Field label="Link" path="hero.cta.secondary.link" />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'howWeWork' && (
                        <div className="space-y-6">
                            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">How We Work Section</h2>
                            <Field label="Badge" path="howWeWork.badge" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="Title Prefix" path="howWeWork.title.prefix" />
                                <Field label="Title Text" path="howWeWork.title.text" />
                            </div>
                            <Field label="Subtitle" path="howWeWork.subtitle" multiline />

                            <div className="space-y-4 pt-4 border-t border-gray-800">
                                <h3 className="text-xs font-bold text-gray-500 uppercase">Process Steps</h3>
                                {(getVal('howWeWork.steps') || []).map((step, i) => (
                                    <div key={i} className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 space-y-3">
                                        <div className="grid grid-cols-2 gap-4">
                                            <Field label="Step Number" path={`howWeWork.steps.${i}.number`} />
                                            <Field label="Color (Hex)" path={`howWeWork.steps.${i}.color`} />
                                        </div>
                                        <Field label="Icon Name" path={`howWeWork.steps.${i}.icon`} />
                                        <Field label="Title" path={`howWeWork.steps.${i}.title`} />
                                        <Field label="Description" path={`howWeWork.steps.${i}.description`} multiline />
                                        <button
                                            onClick={() => {
                                                const steps = [...content.howWeWork.steps];
                                                steps.splice(i, 1);
                                                deepSet('howWeWork.steps', steps);
                                            }}
                                            className="text-red-400 text-xs hover:text-red-300"
                                        >
                                            Remove Step
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => {
                                        const steps = [...(content.howWeWork?.steps || []), { number: '01', title: '', description: '', icon: 'FaStar', color: '#E63946', features: [] }];
                                        deepSet('howWeWork.steps', steps);
                                    }}
                                    className="w-full py-2 border border-dashed border-gray-700 rounded-lg text-gray-500 hover:text-amber-500 hover:border-amber-500 text-xs"
                                >
                                    + Add Process Step
                                </button>
                            </div>
                        </div>
                    )}


                    {activeTab === 'whyChooseUs' && (
                        <div className="space-y-6">
                            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Why Choose Us Section</h2>
                            <Field label="Badge" path="whyChooseUs.badge" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="Main Title" path="whyChooseUs.title.main" />
                                <Field label="Highlight Title" path="whyChooseUs.title.highlight" />
                            </div>
                            <Field label="Description" path="whyChooseUs.description" multiline />

                            <div className="space-y-4 pt-4 border-t border-gray-800">
                                <h3 className="text-xs font-bold text-gray-500 uppercase">Features</h3>
                                {(getVal('whyChooseUs.items') || []).map((item, i) => (
                                    <div key={i} className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 space-y-3">
                                        <div className="grid grid-cols-2 gap-4">
                                            <Field label="Icon Code" path={`whyChooseUs.items.${i}.icon`} />
                                            <Field label="Title" path={`whyChooseUs.items.${i}.title`} />
                                        </div>
                                        <Field label="Description" path={`whyChooseUs.items.${i}.description`} multiline />
                                        <button
                                            onClick={() => {
                                                const items = [...content.whyChooseUs.items];
                                                items.splice(i, 1);
                                                deepSet('whyChooseUs.items', items);
                                            }}
                                            className="text-red-400 text-xs hover:text-red-300"
                                        >
                                            Remove Item
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => {
                                        const items = [...(content.whyChooseUs?.items || []), { title: '', description: '', icon: 'FaCheckCircle' }];
                                        deepSet('whyChooseUs.items', items);
                                    }}
                                    className="w-full py-2 border border-dashed border-gray-700 rounded-lg text-gray-500 hover:text-amber-500 hover:border-amber-500 text-xs"
                                >
                                    + Add Feature
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'workShowcase' && (
                        <div className="space-y-4">
                            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Recent Work Marquee</h2>
                            <Field label="Badge" path="workShowcase.badge" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="Title Prefix" path="workShowcase.title.prefix" />
                                <Field label="Title Main" path="workShowcase.title.main" />
                            </div>
                            <Field label="Description" path="workShowcase.description" multiline />
                            <Field label="CTA Text" path="workShowcase.cta" />
                            <p className="text-xs text-gray-500">Images are managed in Recent Work.</p>
                        </div>
                    )}
                    {activeTab === 'about' && (
                        <>
                            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Homepage About Section</h2>
                            <Field label="Badge" path="about.badge" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="Title Part 1" path="about.title.part1" />
                                <Field label="Title Part 2" path="about.title.part2" />
                            </div>
                            <Field label="Subtitle" path="about.subtitle" multiline />
                        </>
                    )}

                    {activeTab === 'aboutPage' && (
                        <>
                            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">About Page Content</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="Founder Name" path="aboutPage.founder.name" />
                                <Field label="Founder Role" path="aboutPage.founder.role" />
                            </div>
                            <Field label="Founder Quote" path="aboutPage.founder.quote" multiline />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="Expertise" path="aboutPage.founder.expertise" />
                                <Field label="Philosophy" path="aboutPage.founder.philosophy" />
                            </div>
                            <Field label="Tagline" path="aboutPage.founder.tagline" />
                        </>
                    )}

                    {activeTab === 'contactPage' && (
                        <>
                            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Contact Page Content</h2>
                            <Field label="Badge" path="contactPage.badge" />
                            <Field label="Title" path="contactPage.title" />
                            <Field label="Subtitle" path="contactPage.subtitle" multiline />
                        </>
                    )}

                    {activeTab === 'faq' && (
                        <>
                            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">FAQ Management</h2>
                            {/* Simple list editor for FAQ */}
                            {(getVal('faq') || []).map((f, i) => (
                                <div key={i} className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 space-y-3">
                                    <Field label={`Question ${i + 1}`} path={`faq.${i}.question`} />
                                    <Field label="Answer" path={`faq.${i}.answer`} multiline />
                                    <button
                                        onClick={() => {
                                            const newFaq = [...content.faq];
                                            newFaq.splice(i, 1);
                                            setContent({ ...content, faq: newFaq });
                                        }}
                                        className="text-red-400 text-xs hover:text-red-300"
                                    >
                                        Remove Question
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => {
                                    const newFaq = [...(content.faq || []), { question: '', answer: '', category: 'General' }];
                                    setContent({ ...content, faq: newFaq });
                                }}
                                className="w-full py-3 border-2 border-dashed border-gray-700 rounded-xl text-gray-500 hover:text-amber-500 hover:border-amber-500 transition-all text-sm"
                            >
                                + Add New Question
                            </button>
                        </>
                    )}

                    {activeTab === 'contact' && (
                        <>
                            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Global Contact Info</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="Phone" path="contact.phone" />
                                <Field label="Email" path="contact.email" />
                                <Field label="Address" path="contact.address" />
                                <Field label="Hours" path="contact.hours" />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </AdminShell>
    );
}



