import AdminLayout from '@/components/layouts/AdminLayout';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Search, Filter, MessageSquare, CheckCircle, Clock, AlertCircle, User, Send, Paperclip, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui';

export default function AdminSupport() {
    // Admin Support Page
    const { user } = useAuth();
    const router = useRouter(); // Added router
    const { addToast } = useToast();
    const [tickets, setTickets] = useState<any[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [reply, setReply] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isMsgLoading, setIsMsgLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const hasInitiatedChat = useRef(false);

    useEffect(() => {
        fetchTickets();
    }, []);

    // Handle startChat query param
    useEffect(() => {
        if (router.isReady && router.query.startChat && !hasInitiatedChat.current) {
            hasInitiatedChat.current = true;
            initiateChat(router.query.startChat as string);
        }
    }, [router.isReady, router.query]);

    // Polling for messages (every 3 seconds)
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (selectedTicket) {
            // Initial fetch is already triggered by the dependency on selectedTicket below
            // This interval handles subsequent updates
            interval = setInterval(() => {
                fetchMessages(selectedTicket.id, true); // true = silent (no loading spinner)
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [selectedTicket]);

    // Polling for tickets list (every 10 seconds)
    useEffect(() => {
        const interval = setInterval(() => {
            fetchTickets(true); // true = silent
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const initiateChat = async (userId: string) => {
        try {
            const res = await fetch('/api/admin/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });

            if (res.ok) {
                const session = await res.json();
                // Fetch fresh tickets directly to get the latest list including the new one
                const ticketsRes = await fetch('/api/admin/chat');
                if (ticketsRes.ok) {
                    const latestTickets = await ticketsRes.json();
                    setTickets(latestTickets);

                    // Find and select the session
                    const updatedTicket = latestTickets.find((t: any) => t.id === session.id);
                    if (updatedTicket) {
                        setSelectedTicket(updatedTicket);
                        // Remove query param to clean URL
                        router.replace('/dashboard/admin/support', undefined, { shallow: true });
                    }
                }
            } else {
                addToast('Failed to start chat session', 'error');
            }
        } catch (error) {
            console.error('Error initiating chat:', error);
            addToast('Failed to start chat', 'error');
        }
    };

    const fetchTickets = async (silent = false) => {
        if (!silent) setIsLoading(true);
        try {
            const res = await fetch('/api/admin/chat');
            if (res.ok) {
                const data = await res.json();
                setTickets(data);

                // If we are just observing, we might want to update the selectedTicket status if it changed
                if (silent && selectedTicket) {
                    const currentInList = data.find((t: any) => t.id === selectedTicket.id);
                    if (currentInList && currentInList.status !== selectedTicket.status) {
                        setSelectedTicket(prev => ({ ...prev, status: currentInList.status }));
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            if (!silent) setIsLoading(false);
        }
    };

    const fetchMessages = async (sessionId: string, silent = false) => {
        if (!silent) setIsMsgLoading(true);
        try {
            const res = await fetch(`/api/admin/chat/${sessionId}`);
            if (res.ok) {
                const data = await res.json();

                // Update selected ticket with richer user info if available
                if (data.user) {
                    setSelectedTicket((prev: any) => ({
                        ...prev,
                        userDetail: data.user,
                        userAvatar: data.user.avatar,
                        user: data.user.name
                    }));
                }

                // Only update if messages count changed or new content (simple check)
                setMessages(prev => {
                    const newMsgs = data.messages || [];
                    if (newMsgs.length !== prev.length) return newMsgs;
                    // Deep check could be here, but usually length check is enough for chat append
                    // We can also check the ID of the last message
                    if (newMsgs.length > 0 && prev.length > 0 && newMsgs[newMsgs.length - 1].id !== prev[prev.length - 1].id) return newMsgs;
                    return prev;
                });
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            if (!silent) setIsMsgLoading(false);
        }
    };

    const handleSendReply = async () => {
        if (!reply.trim() || !selectedTicket) return;

        try {
            const res = await fetch(`/api/admin/chat/${selectedTicket.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: reply })
            });

            if (res.ok) {
                const newMsg = await res.json();
                setMessages(prev => [...prev, newMsg]);
                setReply('');
                fetchTickets(); // Refresh list to update "last message"
            } else {
                addToast('Failed to send reply', 'error');
            }
        } catch (error) {
            addToast('Error sending reply', 'error');
        }
    };

    const handleStatusUpdate = async (status: string) => {
        if (!selectedTicket) return;
        try {
            const res = await fetch(`/api/admin/chat/${selectedTicket.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                setTickets(prev => prev.map(t => t.id === selectedTicket.id ? { ...t, status } : t));
                setSelectedTicket(prev => ({ ...prev, status }));
                addToast(`Ticket marked as ${status}`, 'success');
            }
        } catch (error) {
            addToast('Error updating status', 'error');
        }
    };

    return (
        <AdminLayout title="Helpdesk & Support">
            <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex gap-6">

                {/* Ticket List (Left Panel) */}
                <div className="w-1/3 flex flex-col bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Tickets</h2>
                            <div className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">
                                {tickets.filter(t => t.status === 'open').length} Open
                            </div>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input type="text" placeholder="Search tickets..." className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 border-none text-sm focus:ring-2 focus:ring-emerald-500" />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {isLoading ? (
                            <div className="flex justify-center p-4"><Loader2 className="animate-spin text-gray-400" /></div>
                        ) : tickets.length > 0 ? (
                            tickets.map((ticket) => (
                                <motion.div
                                    key={ticket.id}
                                    onClick={() => setSelectedTicket(ticket)}
                                    whileHover={{ y: -2 }}
                                    className={`p-4 rounded-2xl cursor-pointer border transition-all ${selectedTicket?.id === ticket.id ? 'bg-emerald-50 border-emerald-200 shadow-md' : 'bg-white border-gray-100 hover:border-emerald-200'}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-bold text-gray-900 text-sm truncate w-24">#{ticket.id.substring(0, 8)}</span>
                                        <span className="text-[10px] text-gray-400 whitespace-nowrap">{new Date(ticket.date).toLocaleDateString()}</span>
                                    </div>
                                    <h3 className="font-bold text-gray-800 text-sm mb-1 truncate">{ticket.subject}</h3>
                                    <p className="text-xs text-gray-500 line-clamp-2">{ticket.message}</p>
                                    <div className="flex items-center gap-2 mt-3">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${ticket.status === 'open' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                            {ticket.status}
                                        </span>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-400 text-sm">No active tickets</div>
                        )}
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
                                        <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-500">#{selectedTicket.id.substring(0, 8)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <User className="w-4 h-4" />
                                        <span className="font-bold text-emerald-600">{selectedTicket.user}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {selectedTicket.status !== 'closed' && (
                                        <button
                                            onClick={() => handleStatusUpdate('closed')}
                                            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition"
                                        >
                                            Close Ticket
                                        </button>
                                    )}
                                    {selectedTicket.status === 'closed' && (
                                        <button
                                            onClick={() => handleStatusUpdate('open')}
                                            className="px-4 py-2 bg-emerald-100 text-emerald-600 rounded-xl font-bold text-sm hover:bg-emerald-200 transition"
                                        >
                                            Re-open Ticket
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 flex gap-6 overflow-hidden">
                                {/* Chat Area */}
                                <div className="flex-1 flex flex-col overflow-hidden">
                                    <div className="flex-1 overflow-y-auto mb-4 space-y-6 px-2 pr-4 custom-scrollbar">
                                        {isMsgLoading ? (
                                            <div className="flex justify-center pt-10"><Loader2 className="animate-spin text-emerald-500 w-8 h-8" /></div>
                                        ) : (
                                            messages.map((msg) => (
                                                <div key={msg.id} className={`flex gap-4 ${msg.isAdmin ? 'flex-row-reverse' : ''}`}>
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.isAdmin ? 'bg-emerald-100' : 'bg-gray-200'} overflow-hidden`}>
                                                        {msg.isAdmin ? (
                                                            <div className="font-bold text-emerald-600 text-xs">AG</div>
                                                        ) : (
                                                            // Use user avatar from selectedTicket context if available, or generic
                                                            selectedTicket.userAvatar ? (
                                                                <img src={selectedTicket.userAvatar} alt="User" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <User className="w-5 h-5 text-gray-500" />
                                                            )
                                                        )}
                                                    </div>
                                                    <div className={`p-4 max-w-xl shadow-sm ${msg.isAdmin ? 'bg-emerald-600 text-white rounded-l-3xl rounded-br-3xl' : 'bg-gray-50 text-gray-800 rounded-r-3xl rounded-bl-3xl'}`}>
                                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                                        <span className={`text-[10px] mt-2 block ${msg.isAdmin ? 'text-emerald-200' : 'text-gray-400'}`}>
                                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                        <div ref={messagesEndRef} />
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
                                            onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                                            placeholder="Type your reply..."
                                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium"
                                        />
                                        <button
                                            onClick={handleSendReply}
                                            disabled={!reply.trim()}
                                            className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition shadow-lg disabled:opacity-50 disabled:shadow-none"
                                        >
                                            <Send className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Customer Context Sidebar */}
                                <div className="w-80 bg-gray-50 rounded-2xl p-4 overflow-y-auto border border-gray-100 hidden xl:block">
                                    <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">About Customer</h3>
                                    {selectedTicket.userDetail ? (
                                        <div className="space-y-6">
                                            {/* Profile */}
                                            <div className="text-center">
                                                <div className="w-20 h-20 mx-auto bg-white rounded-full p-1 shadow-sm mb-3">
                                                    <img
                                                        src={selectedTicket.userDetail.avatar || `https://ui-avatars.com/api/?name=${selectedTicket.userDetail.name}`}
                                                        alt={selectedTicket.userDetail.name}
                                                        className="w-full h-full rounded-full object-cover"
                                                    />
                                                </div>
                                                <h4 className="font-bold text-gray-900">{selectedTicket.userDetail.name}</h4>
                                                <p className="text-xs text-gray-500">{selectedTicket.userDetail.email}</p>
                                                <div className="mt-3 flex justify-center gap-2">
                                                    <span className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-600 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" /> joined {new Date().getFullYear()}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Contact Info */}
                                            <div className="bg-white p-3 rounded-xl border border-gray-100 space-y-2">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600"><User className="w-3 h-3" /></div>
                                                    <span className="truncate">{selectedTicket.userDetail.phone || 'No phone'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><AlertCircle className="w-3 h-3" /></div>
                                                    <span className="truncate">{selectedTicket.userDetail.idNumber || 'No ID'}</span>
                                                </div>
                                            </div>

                                            {/* Recent Bookings */}
                                            <div>
                                                <h5 className="font-bold text-gray-900 text-xs uppercase mb-3 flex items-center gap-2">
                                                    <CheckCircle className="w-3 h-3 text-emerald-500" /> Recent Bookings
                                                </h5>
                                                <div className="space-y-2">
                                                    {selectedTicket.userDetail.bookings && selectedTicket.userDetail.bookings.length > 0 ? (
                                                        selectedTicket.userDetail.bookings.map((bk: any) => (
                                                            <div key={bk.id} className="bg-white p-3 rounded-xl border border-gray-100 text-xs">
                                                                <div className="flex justify-between font-bold text-gray-800 mb-1">
                                                                    <span className="truncate w-32" title={bk.productName}>{bk.productName}</span>
                                                                    <span className={
                                                                        bk.status === 'Paid' ? 'text-emerald-600' :
                                                                            bk.status === 'Pending' ? 'text-amber-600' : 'text-gray-400'
                                                                    }>{bk.status}</span>
                                                                </div>
                                                                <div className="flex justify-between text-gray-500">
                                                                    <span>{new Date(bk.date).toLocaleDateString()}</span>
                                                                    <span className="font-medium text-gray-700">Rp {bk.amount.toLocaleString()}</span>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-center text-gray-400 text-xs py-2">No bookings yet</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-gray-300" /></div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
                            <MessageSquare className="w-16 h-16 mb-4 opacity-50" />
                            <p className="font-bold text-lg">Select a ticket to view conversation</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
