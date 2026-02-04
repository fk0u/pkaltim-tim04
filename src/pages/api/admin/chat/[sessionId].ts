import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/session';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res);
    if (!session || session.role !== 'admin') {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { sessionId } = req.query;

    if (!sessionId || typeof sessionId !== 'string') {
        return res.status(400).json({ message: 'Invalid Session ID' });
    }

    if (req.method === 'GET') {
        try {
            const chatSession = await prisma.chatSession.findUnique({
                where: { id: sessionId },
                include: {
                    messages: { orderBy: { createdAt: 'asc' } },
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                            idNumber: true,
                            bio: true,
                            bookings: {
                                take: 5,
                                orderBy: { date: 'desc' },
                                select: {
                                    id: true,
                                    productName: true,
                                    amount: true,
                                    status: true,
                                    date: true
                                }
                            }
                        }
                    }
                }
            });

            if (!chatSession) return res.status(404).json({ message: 'Session not found' });

            return res.status(200).json(chatSession);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error fetching session details' });
        }
    }

    if (req.method === 'POST') {
        try {
            const { content } = req.body;
            if (!content) return res.status(400).json({ message: 'Content required' });

            const message = await prisma.message.create({
                data: {
                    sessionId,
                    content,
                    senderId: session.id, // Admin ID
                    isAdmin: true,
                    read: false
                }
            });

            // Update session timestamp
            await prisma.chatSession.update({
                where: { id: sessionId },
                data: { updatedAt: new Date(), status: 'open' } // Re-open if closed?
            });

            return res.status(201).json(message);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error sending message' });
        }
    }

    // Update Status (e.g. Close Ticket)
    if (req.method === 'PUT') {
        try {
            const { status } = req.body;
            const updated = await prisma.chatSession.update({
                where: { id: sessionId },
                data: { status }
            });
            return res.status(200).json(updated);
        } catch (error) {
            return res.status(500).json({ message: 'Error updating status' });
        }
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
