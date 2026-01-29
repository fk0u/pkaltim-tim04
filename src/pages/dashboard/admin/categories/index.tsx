import { useState, useEffect } from 'react';
import Layout from '@/components/dashboard/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Edit2, Trash2, Search, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/router';
import { useToast, ImageUpload } from '@/components/ui';

interface Category {
    id: string;
    name: { id: string; en: string };
    icon: string;
    imageUrl: string;
}

export default function AdminCategories() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { addToast } = useToast();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({
        nameEn: '',
        nameId: '',
        icon: '',
        imageUrl: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!loading && (!user || user.role !== 'admin')) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (error) {
            console.error('Failed to fetch categories', error);
            addToast('Failed to fetch categories', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                nameEn: category.name.en,
                nameId: category.name.id,
                icon: category.icon,
                imageUrl: category.imageUrl
            });
        } else {
            setEditingCategory(null);
            setFormData({ nameEn: '', nameId: '', icon: '', imageUrl: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const payload = {
                name: { en: formData.nameEn, id: formData.nameId },
                icon: formData.icon,
                imageUrl: formData.imageUrl
            };

            const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories';
            const method = editingCategory ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error('Failed to save category');

            addToast(editingCategory ? 'Category updated' : 'Category created', 'success');
            setIsModalOpen(false);
            fetchCategories();
        } catch (error) {
            addToast('Error saving category', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');

            addToast('Category deleted', 'success');
            fetchCategories();
        } catch (error) {
            addToast('Error deleting category', 'error');
        }
    };

    const filteredCategories = categories.filter(c =>
        c.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.name.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading || isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <Layout>
            <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">Categories Management</h1>
                        <p className="text-gray-500">Manage trip categories</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition"
                    >
                        <Plus className="w-4 h-4" /> Add Category
                    </button>
                </div>

                {/* Search */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Icon</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Name (EN)</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Name (ID)</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Image</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredCategories.map((category) => (
                                <tr key={category.id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4 text-2xl">{category.icon}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{category.name.en}</td>
                                    <td className="px-6 py-4 text-gray-500">{category.name.id}</td>
                                    <td className="px-6 py-4">
                                        <img src={category.imageUrl} alt={category.name.en} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleOpenModal(category)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-emerald-600 transition">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(category.id)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-red-600 transition">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredCategories.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">No categories found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-xl font-bold text-gray-900">{editingCategory ? 'Edit Category' : 'New Category'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition"><X className="w-5 h-5 text-gray-500" /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name (English)</label>
                                    <input required type="text" value={formData.nameEn} onChange={e => setFormData({ ...formData, nameEn: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name (Indonesian)</label>
                                    <input required type="text" value={formData.nameId} onChange={e => setFormData({ ...formData, nameId: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Icon (Emoji)</label>
                                <input required type="text" value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. 🏝️" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                                <ImageUpload
                                    value={formData.imageUrl}
                                    onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                                    onRemove={() => setFormData({ ...formData, imageUrl: '' })}
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition font-medium">Cancel</button>
                                <button disabled={isSubmitting} type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium shadow-lg shadow-emerald-600/20 disabled:opacity-70 flex items-center gap-2">
                                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {editingCategory ? 'Save Changes' : 'Create Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
}
