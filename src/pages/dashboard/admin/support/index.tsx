import AdminLayout from '@/components/layouts/AdminLayout';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MessageSquare, CheckCircle, Clock, AlertCircle, User, Send, Paperclip } from 'lucide-react';

// Mock Support Data
const TICKETS = [
    { id: 'TKT-001', user: 'Budi Santoso', subject: 'Refund Request #BKG-992', status: 'Open', priority: 'High', date: '2 mins ago', message: 'Saya ingin request refund karena ada urusan mendadak.' },
    { id: 'TKT-002', user: 'Siti Aminah', subject: 'Gagal Login App', status: 'Pending', priority: 'Medium', date: '1 hour ago', message: 'Password saya tidak bisa direset.' },
    { id: 'TKT-003', user: 'John Doe', subject: 'Tanya Paket Derawan', status: 'Closed', priority: 'Low', date: 'Yesterday', message: 'Apakah paket ini include snorkeling gear?' },
    { id: 'TKT-004', user: 'Ahmad Dani', subject: 'Pembayaran Belum Verifikasi', status: 'Open', priority: 'High', date: '2 days ago', message: 'Saya sudah transfer tapi status masih pending.' },
];

export default function AdminSupport() {
    const [selectedTicket, setSelectedTicket] = useState<typeof TICKETS[0] | null>(null);
    const [reply, setReply] = useState('');

    return (
        <AdminLayout title="Helpdesk & Support">
            <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex gap-6">

                {/* Ticket List (Left Panel) */}
                <div className="w-1/3 flex flex-col bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Tickets</h2>
                            <div className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">4 Open</div>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input type="text" placeholder="Search tickets..." className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 border-none text-sm focus:ring-2 focus:ring-emerald-500" />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {TICKETS.map((ticket) => (
                            <motion.div
                                key={ticket.id}
                                onClick={() => setSelectedTicket(ticket)}
                                whileHover={{ y: -2 }}
                                className={`p-4 rounded-2xl cursor-pointer border transition-all ${selectedTicket?.id === ticket.id ? 'bg-emerald-50 border-emerald-200 shadow-md' : 'bg-white border-gray-100 hover:border-emerald-200'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-gray-900 text-sm">#{ticket.id}</span>
                                    <span className="text-[10px] text-gray-400">{ticket.date}</span>
                                </div>
                                <h3 className="font-bold text-gray-800 text-sm mb-1 truncate">{ticket.subject}</h3>
                                <p className="text-xs text-gray-500 line-clamp-2">{ticket.message}</p>
                                <div className="flex items-center gap-2 mt-3">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${ticket.status === 'Open' ? 'bg-red-100 text-red-600' :
                                            ticket.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                        {ticket.status}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${ticket.priority === 'High' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                                        }`}>
                                        {ticket.priority}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Ticket Detail (Right Panel) */}
                <div className="flex-1 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 flex flex-col">
                    {selectedTicket ? (
                        <>
                            {/* Header */}
                            <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className="text-2xl font-black text-gray-900">{selectedTicket.subject}</h2>
                                        <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-500">#{selectedTicket.id}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <User className="w-4 h-4" />
                                        <span className="font-bold text-emerald-600">{selectedTicket.user}</span>
                                        <span>•</span>
                                        <span>Customer</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition">
                                        Mark Solved
                                    </button>
                                </div>
                            </div>

                            {/* Chat View */}
                            <div className="flex-1 overflow-y-auto mb-6 space-y-6">
                                {/* Customer Message */}
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                        <User className="w-5 h-5 text-gray-500" />
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-r-3xl rounded-bl-3xl max-w-xl">
                                        <p className="text-gray-800 text-sm leading-relaxed">{selectedTicket.message}</p>
                                        <span className="text-[10px] text-gray-400 mt-2 block">{selectedTicket.date}</span>
                                    </div>
                                </div>

                                {/* Agent Reply Mock */}
                                <div className="flex gap-4 flex-row-reverse">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                        <div className="font-bold text-emerald-600 text-xs">AG</div>
                                    </div>
                                    <div className="bg-emerald-600 text-white p-4 rounded-l-3xl rounded-br-3xl max-w-xl shadow-lg shadow-emerald-200">
                                        <p className="text-emerald-50 text-sm leading-relaxed">Halo Kak {selectedTicket.user}, mohon maaf atas ketidaknyamanannya. Tim kami sedang melakukan pengecekan refund manual. Mohon ditunggu 1x24 jam ya.</p>
                                        <span className="text-[10px] text-emerald-200 mt-2 block opacity-70">Just now</span>
                                    </div>
                                </div>
                            </div>

                            {/* Reply Input */}
                            <div className="mt-auto bg-gray-50 p-2 rounded-2xl border border-gray-200 flex items-center gap-2">
                                <button className="p-3 rounded-xl hover:bg-white text-gray-400 hover:text-gray-600 transition">
                                    <Paperclip className="w-5 h-5" />
                                </button>
                                <input
                                    type="text"
                                    value={reply}
                                    onChange={(e) => setReply(e.target.value)}
                                    placeholder="Type your reply..."
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium"
                                />
                                <button className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition shadow-lg">
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
                            <MessageSquare className="w-16 h-16 mb-4 opacity-50" />
                            <p className="font-bold text-lg">Select a ticket to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
