import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/session';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res);
    if (!session || session.role !== 'admin') {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.method === 'POST') {
        try {
            const { userId } = req.body;
            if (!userId) return res.status(400).json({ message: 'User ID required' });

            // Check existing open session
            const existing = await prisma.chatSession.findFirst({
                where: { userId, status: 'open' }
            });

            if (existing) {
                return res.status(200).json({ id: existing.id });
            }

            // Create new
            const newSession = await prisma.chatSession.create({
                data: {
                    userId,
                    status: 'open',
                    messages: {
                        create: {
                            content: 'Hello! How can we help you today?',
                            isAdmin: true,
                            senderId: session.id, // Admin ID
                            read: true
                        }
                    }
                }
            });

            return res.status(201).json({ id: newSession.id });
        } catch (error) {
            console.error('Error creating chat session:', error);
            return res.status(500).json({ message: 'Error creating session' });
        }
    }

    if (req.method === 'GET') {
        try {
            const sessions = await prisma.chatSession.findMany({
                include: {
                    user: {
                        select: { name: true, email: true, role: true }
                    },
                    messages: {
                        orderBy: { createdAt: 'desc' },
                        take: 1
                    }
                },
                orderBy: { updatedAt: 'desc' }
            });

            // Format for frontend
            const formattedSessions = sessions.map(s => ({
                id: s.id,
                user: s.user.name,
                subject: `Support Chat #${s.id.substring(0, 8)}`, // Generic subject as ChatSession might not have subject
                status: s.status,
                priority: 'Normal', // Default
                date: s.messages[0]?.createdAt.toISOString() || s.updatedAt.toISOString(),
                message: s.messages[0]?.content || '(No messages)',
                unreadCount: 0 // logic to count unread user messages could be added
            }));

            return res.status(200).json(formattedSessions);
        } catch (error) {
            console.error('Error fetching admin chat sessions:', error);
            return res.status(500).json({ message: 'Error fetching sessions' });
        }
    }

    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
