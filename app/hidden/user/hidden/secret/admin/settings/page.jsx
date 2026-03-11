'use client';
import { useState, useEffect } from 'react';
import AdminShell from '../components/AdminShell';
import toast from 'react-hot-toast';

export default function SettingsPage() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('company');

    useEffect(() => {
        fetch('/api/settings').then(r => r.json()).then(d => {
            setSettings(d.settings || {
                companyName: '', tagline: '',
                contact: { phone: '', email: '', address: '', hours: '', support: '' },
                socialMedia: [],
                navigation: { items: [] },
                footer: {
                    year: 2026,
                    certifications: '',
                    text: '',
                    copyright: '',
                    location: { address: '', cityState: '', description: '', mapUrl: '' },
                    links: [],
                },
                seo: { metaTitle: '', metaDescription: '' },
            });
        }).catch(() => toast.error('Failed to load settings')).finally(() => setLoading(false));
    }, []);

    const deepSet = (path, value) => {
        setSettings(prev => {
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
        if (!settings) return '';
        const keys = path.split('.');
        let val = settings;
        for (const k of keys) {
            if (val == null) return '';
            val = val[k];
        }
        return val ?? '';
    };

    const updateSocial = (i, field, value) => {
        setSettings(prev => {
            const clone = JSON.parse(JSON.stringify(prev));
            if (!clone.socialMedia) clone.socialMedia = [];
            clone.socialMedia[i] = { ...clone.socialMedia[i], [field]: value };
            return clone;
        });
    };

    const addSocial = () => {
        setSettings(prev => {
            const clone = JSON.parse(JSON.stringify(prev));
            if (!clone.socialMedia) clone.socialMedia = [];
            clone.socialMedia.push({ key: '', icon: '', label: '', href: '' });
            return clone;
        });
    };

    const removeSocial = (i) => {
        setSettings(prev => {
            const clone = JSON.parse(JSON.stringify(prev));
            clone.socialMedia.splice(i, 1);
            return clone;
        });
    };

    const updateNavItem = (i, field, value) => {
        setSettings(prev => {
            const clone = JSON.parse(JSON.stringify(prev));
            if (!clone.navigation) clone.navigation = { items: [] };
            if (!clone.navigation.items) clone.navigation.items = [];
            clone.navigation.items[i] = { ...clone.navigation.items[i], [field]: value };
            return clone;
        });
    };

    const addNavItem = () => {
        setSettings(prev => {
            const clone = JSON.parse(JSON.stringify(prev));
            if (!clone.navigation) clone.navigation = { items: [] };
            if (!clone.navigation.items) clone.navigation.items = [];
            clone.navigation.items.push({ label: '', href: '', exact: false, dropdown: [] });
            return clone;
        });
    };

    const removeNavItem = (i) => {
        setSettings(prev => {
            const clone = JSON.parse(JSON.stringify(prev));
            clone.navigation.items.splice(i, 1);
            return clone;
        });
    };

    const updateDropdownItem = (navIndex, itemIndex, field, value) => {
        setSettings(prev => {
            const clone = JSON.parse(JSON.stringify(prev));
            const nav = clone.navigation?.items?.[navIndex];
            if (!nav) return clone;
            if (!nav.dropdown) nav.dropdown = [];
            nav.dropdown[itemIndex] = { ...nav.dropdown[itemIndex], [field]: value };
            return clone;
        });
    };

    const addDropdownItem = (navIndex) => {
        setSettings(prev => {
            const clone = JSON.parse(JSON.stringify(prev));
            const nav = clone.navigation?.items?.[navIndex];
            if (!nav) return clone;
            if (!nav.dropdown) nav.dropdown = [];
            nav.dropdown.push({ label: '', href: '', description: '', icon: '' });
            return clone;
        });
    };

    const removeDropdownItem = (navIndex, itemIndex) => {
        setSettings(prev => {
            const clone = JSON.parse(JSON.stringify(prev));
            const nav = clone.navigation?.items?.[navIndex];
            if (!nav?.dropdown) return clone;
            nav.dropdown.splice(itemIndex, 1);
            return clone;
        });
    };

    const addFooterGroup = () => {
        setSettings(prev => {
            const clone = JSON.parse(JSON.stringify(prev));
            if (!clone.footer) clone.footer = {};
            if (!clone.footer.links) clone.footer.links = [];
            clone.footer.links.push({ title: '', items: [] });
            return clone;
        });
    };

    const updateFooterGroupTitle = (groupIndex, value) => {
        setSettings(prev => {
            const clone = JSON.parse(JSON.stringify(prev));
            if (!clone.footer?.links) clone.footer.links = [];
            clone.footer.links[groupIndex] = { ...clone.footer.links[groupIndex], title: value };
            return clone;
        });
    };

    const removeFooterGroup = (groupIndex) => {
        setSettings(prev => {
            const clone = JSON.parse(JSON.stringify(prev));
            if (!clone.footer?.links) return clone;
            clone.footer.links.splice(groupIndex, 1);
            return clone;
        });
    };

    const addFooterLinkItem = (groupIndex) => {
        setSettings(prev => {
            const clone = JSON.parse(JSON.stringify(prev));
            if (!clone.footer?.links) clone.footer.links = [];
            const group = clone.footer.links[groupIndex];
            if (!group.items) group.items = [];
            group.items.push({ label: '', href: '' });
            return clone;
        });
    };

    const updateFooterLinkItem = (groupIndex, itemIndex, field, value) => {
        setSettings(prev => {
            const clone = JSON.parse(JSON.stringify(prev));
            const group = clone.footer?.links?.[groupIndex];
            if (!group) return clone;
            if (!group.items) group.items = [];
            group.items[itemIndex] = { ...group.items[itemIndex], [field]: value };
            return clone;
        });
    };

    const removeFooterLinkItem = (groupIndex, itemIndex) => {
        setSettings(prev => {
            const clone = JSON.parse(JSON.stringify(prev));
            const group = clone.footer?.links?.[groupIndex];
            if (!group?.items) return clone;
            group.items.splice(itemIndex, 1);
            return clone;
        });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });
            if (!res.ok) throw new Error();
            toast.success('Settings saved!');
        } catch { toast.error('Failed to save settings'); }
        finally { setSaving(false); }
    };

    const handleUpload = async (e, path) => {
        const file = e.target.files[0];
        if (!file) return;
        const toastId = toast.loading('Uploading...');
        try {
            const fd = new FormData();
            fd.append('file', file);
            const res = await fetch('/api/upload', { method: 'POST', body: fd });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            deepSet(path, data.path);
            toast.success('Uploaded successfully', { id: toastId });
        } catch (err) {
            toast.error(err.message, { id: toastId });
        }
    };

    const Field = ({ label, path, multiline = false, placeholder = '', type = 'text' }) => (
        <div>
            <label className="block text-xs text-gray-500 mb-1">{label}</label>
            {multiline ? (
                <textarea value={getVal(path)} onChange={e => deepSet(path, e.target.value)} rows={3} placeholder={placeholder}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500 text-sm resize-none" />
            ) : (
                <input type={type} value={getVal(path)} onChange={e => deepSet(path, type === 'number' ? Number(e.target.value) : e.target.value)} placeholder={placeholder}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500 text-sm" />
            )}
        </div>
    );

    const ImageField = ({ label, path }) => (
        <div>
            <label className="block text-xs text-gray-500 mb-1">{label}</label>
            <div className="flex items-center gap-4 p-3 bg-gray-800 border border-gray-700 rounded-xl">
                {getVal(path) ? (
                    <img src={getVal(path)} alt={label} className="w-12 h-12 object-contain bg-gray-900 rounded border border-gray-700" />
                ) : (
                    <div className="w-12 h-12 bg-gray-900 rounded border border-gray-700 flex items-center justify-center text-gray-600 text-[10px]">No Img</div>
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
        { id: 'company', label: 'ðŸ¢ Company' },
        { id: 'contact', label: 'ðŸ“ž Contact' },
        { id: 'navigation', label: 'Navigation' },
        { id: 'social', label: 'ðŸ“± Social Media' },
        { id: 'footer', label: 'ðŸ¦¶ Footer' },
        { id: 'seo', label: 'ðŸ” SEO' },
    ];

    if (loading) return (
        <AdminShell>
            <div className="flex items-center justify-center h-64 text-gray-500">Loading...</div>
        </AdminShell>
    );

    return (
        <AdminShell>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Site Settings</h1>
                        <p className="text-gray-500 text-sm">Manage company info, contact details, and more</p>
                    </div>
                    <button onClick={handleSave} disabled={saving} id="save-settings"
                        className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-semibold rounded-xl text-sm transition-all disabled:opacity-50 shadow-lg shadow-red-500/20">
                        {saving ? 'â³ Saving...' : 'âœ“ Save Settings'}
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id
                                ? 'bg-amber-600 text-white'
                                : 'bg-gray-900 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600'
                                }`}>
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 space-y-5">
                    {activeTab === 'company' && (
                        <div className="space-y-4">
                            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Company Info</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <ImageField label="Site Logo" path="logo" />
                                <ImageField label="Favicon" path="favicon" />
                            </div>
                            <Field label="Company Name" path="companyName" placeholder="Luminous Holiday Lighting" />
                            <Field label="Tagline" path="tagline" placeholder="Professional holiday lighting installation & design" multiline />
                        </div>
                    )}

                    {activeTab === 'contact' && (
                        <div className="space-y-4">
                            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Contact Details</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="Phone" path="contact.phone" placeholder="(614) 301-7100" />
                                <Field label="Email" path="contact.email" placeholder="info@lightsovercolumbus.com" />
                                <Field label="Business Hours" path="contact.hours" placeholder="Mon-Fri: 8AM-6PM" />
                                <Field label="Support" path="contact.support" placeholder="24/7 Support" />
                            </div>
                            <Field label="Address" path="contact.address" placeholder="123 Holiday Lane, North Pole, 12345" />
                        </div>
                    )}

                    {activeTab === 'navigation' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Navigation Menu</h2>
                                <button onClick={addNavItem} className="text-xs text-amber-400 hover:text-amber-300 transition-colors">+ Add Nav Item</button>
                            </div>
                            {(settings?.navigation?.items || []).map((item, i) => (
                                <div key={i} className="space-y-3 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Label</label>
                                            <input value={item.label || ''} onChange={e => updateNavItem(i, 'label', e.target.value)} placeholder="Services"
                                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500 text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Href</label>
                                            <input value={item.href || ''} onChange={e => updateNavItem(i, 'href', e.target.value)} placeholder="/services"
                                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500 text-sm" />
                                        </div>
                                        <div className="flex items-end gap-2">
                                            <label className="flex items-center gap-2 text-xs text-gray-400">
                                                <input type="checkbox" checked={!!item.exact} onChange={e => updateNavItem(i, 'exact', e.target.checked)} />
                                                Exact Match
                                            </label>
                                            <button onClick={() => removeNavItem(i)} className="ml-auto px-2 text-red-400 hover:bg-red-950/40 rounded-lg transition-colors text-sm">Remove</button>
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-gray-700/50">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-xs text-gray-500">Dropdown Items (optional)</p>
                                            <button onClick={() => addDropdownItem(i)} className="text-xs text-amber-400 hover:text-amber-300 transition-colors">+ Add Dropdown</button>
                                        </div>
                                        {(item.dropdown || []).length === 0 && (
                                            <p className="text-xs text-gray-600">No dropdown items</p>
                                        )}
                                        {(item.dropdown || []).map((d, di) => (
                                            <div key={di} className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-2">
                                                <input value={d.label || ''} onChange={e => updateDropdownItem(i, di, 'label', e.target.value)} placeholder="Residential"
                                                    className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500 text-xs" />
                                                <input value={d.href || ''} onChange={e => updateDropdownItem(i, di, 'href', e.target.value)} placeholder="/services/residential-lighting"
                                                    className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500 text-xs" />
                                                <input value={d.description || ''} onChange={e => updateDropdownItem(i, di, 'description', e.target.value)} placeholder="Short description"
                                                    className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500 text-xs" />
                                                <div className="flex gap-2">
                                                    <input value={d.icon || ''} onChange={e => updateDropdownItem(i, di, 'icon', e.target.value)} placeholder="Icon/Emoji"
                                                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500 text-xs" />
                                                    <button onClick={() => removeDropdownItem(i, di)} className="px-2 text-red-400 hover:bg-red-950/40 rounded-lg transition-colors text-xs">x</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {(!settings?.navigation?.items || settings.navigation.items.length === 0) && (
                                <div className="text-center py-8 text-gray-500 text-sm">
                                    No navigation items yet.{' '}
                                    <button onClick={addNavItem} className="text-amber-400 hover:text-amber-300">Add one Ã¢â€ â€™</button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'social' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Social Media Links</h2>
                                <button onClick={addSocial} className="text-xs text-amber-400 hover:text-amber-300 transition-colors">+ Add Link</button>
                            </div>
                            {(settings?.socialMedia || []).map((s, i) => (
                                <div key={i} className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Key (e.g. facebook)</label>
                                        <input value={s.key || ''} onChange={e => updateSocial(i, 'key', e.target.value)} placeholder="facebook"
                                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500 text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Label</label>
                                        <input value={s.label || ''} onChange={e => updateSocial(i, 'label', e.target.value)} placeholder="Facebook"
                                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500 text-sm" />
                                    </div>
                                    <div className="sm:col-span-1">
                                        <label className="block text-xs text-gray-500 mb-1">Icon Name (React Icons)</label>
                                        <input value={s.icon || ''} onChange={e => updateSocial(i, 'icon', e.target.value)} placeholder="FaFacebookF"
                                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500 text-sm" />
                                    </div>
                                    <div className="relative">
                                        <label className="block text-xs text-gray-500 mb-1">URL</label>
                                        <div className="flex gap-2">
                                            <input value={s.href || ''} onChange={e => updateSocial(i, 'href', e.target.value)} placeholder="https://..."
                                                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500 text-sm" />
                                            <button onClick={() => removeSocial(i)} className="px-2 text-red-400 hover:bg-red-950/40 rounded-lg transition-colors text-sm">âœ•</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {(!settings?.socialMedia || settings.socialMedia.length === 0) && (
                                <div className="text-center py-8 text-gray-500 text-sm">
                                    No social links yet.{' '}
                                    <button onClick={addSocial} className="text-amber-400 hover:text-amber-300">Add one â†’</button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'footer' && (
                        <>
                            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Footer Settings</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="Footer Year" path="footer.year" placeholder="2026" type="number" />
                                <Field label="Footer Text" path="footer.text" placeholder="Short footer tagline or text" />
                                <Field label="Copyright Text" path="footer.copyright" placeholder="© {year} {company}. All rights reserved." />
                                <Field label="Footer Address" path="footer.location.address" placeholder="123 Holiday Lane" />
                                <Field label="City, State & Zip" path="footer.location.cityState" placeholder="North Pole, 12345" />
                                <Field label="Map URL" path="footer.location.mapUrl" placeholder="https://maps.google.com/?q=..." />
                            </div>
                            <Field label="Location Description" path="footer.location.description" multiline placeholder="Serving the greater metropolitan area..." />
                            <Field label="Certifications" path="footer.certifications" placeholder="Licensed â€¢ Insured â€¢ Professional Installers â€¢ Free Estimates Available" />

                            <div className="pt-4 border-t border-gray-800 space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase">Footer Links</h3>
                                    <button onClick={addFooterGroup} className="text-xs text-amber-400 hover:text-amber-300 transition-colors">+ Add Group</button>
                                </div>

                                {(settings?.footer?.links || []).map((group, gi) => (
                                    <div key={gi} className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 space-y-3">
                                        <div className="flex items-center gap-2">
                                            <input value={group.title || ''} onChange={e => updateFooterGroupTitle(gi, e.target.value)} placeholder="Group Title"
                                                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500 text-sm" />
                                            <button onClick={() => removeFooterGroup(gi)} className="px-2 text-red-400 hover:bg-red-950/40 rounded-lg transition-colors text-sm">Remove</button>
                                        </div>
                                        {(group.items || []).map((link, li) => (
                                            <div key={li} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                                <input value={link.label || ''} onChange={e => updateFooterLinkItem(gi, li, 'label', e.target.value)} placeholder="Label"
                                                    className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500 text-xs" />
                                                <input value={link.href || ''} onChange={e => updateFooterLinkItem(gi, li, 'href', e.target.value)} placeholder="/about"
                                                    className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500 text-xs" />
                                                <div className="flex">
                                                    <button onClick={() => removeFooterLinkItem(gi, li)} className="ml-auto px-2 text-red-400 hover:bg-red-950/40 rounded-lg transition-colors text-xs">Remove</button>
                                                </div>
                                            </div>
                                        ))}
                                        <button onClick={() => addFooterLinkItem(gi)} className="text-xs text-amber-400 hover:text-amber-300 transition-colors">+ Add Link</button>
                                    </div>
                                ))}

                                {(!settings?.footer?.links || settings.footer.links.length === 0) && (
                                    <div className="text-center py-6 text-gray-500 text-sm">
                                        No footer link groups yet.{' '}
                                        <button onClick={addFooterGroup} className="text-amber-400 hover:text-amber-300">Add one â†’</button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {activeTab === 'seo' && (
                        <div className="space-y-4">
                            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">SEO Settings</h2>
                            <Field label="Site Title (Page Title Prefix)" path="seo.siteTitle" placeholder="Christmas Lighting Services" />
                            <Field label="Meta Title" path="seo.metaTitle" placeholder="Expert Holiday Light Installation in Columbus, OH" />
                            <Field label="Meta Description" path="seo.metaDescription" multiline placeholder="Professional Christmas lighting installation and design services..." />
                            <Field label="Keywords (Comma separated)" path="seo.keywords" placeholder="christmas lights, holiday lighting, columbus ohio" />
                        </div>
                    )}
                </div>
            </div>
        </AdminShell>
    );
}




