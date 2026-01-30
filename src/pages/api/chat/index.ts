import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/session';

// Simple chat handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res);
    if (!session) return res.status(401).json({ message: 'Unauthorized' });
    const userId = session.id;

    if (req.method === 'GET') {
        try {
            // Find active session or create one
            let chatSession = await prisma.chatSession.findFirst({
                where: { userId, status: 'open' },
                include: { messages: { orderBy: { createdAt: 'asc' } } }
            });

            if (!chatSession) {
                // Return empty if no session, or just return empty list
                return res.status(200).json({ messages: [] });
            }

            return res.status(200).json({ messages: chatSession.messages });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error fetching chat' });
        }
    }

    if (req.method === 'POST') {
        try {
            const { content } = req.body;
            if (!content) return res.status(400).json({ message: 'Empty message' });

            // Find or create session
            let chatSession = await prisma.chatSession.findFirst({
                where: { userId, status: 'open' }
            });

            if (!chatSession) {
                chatSession = await prisma.chatSession.create({
                    data: { userId, status: 'open' }
                });
            }

            // Create User Message
            const message = await prisma.message.create({
                data: {
                    sessionId: chatSession.id,
                    content,
                    senderId: userId,
                    isAdmin: false,
                    read: true // Read by system immediately?
                }
            });

            // Simulate Auto-Reply (Bot) if it's the first message or for testing
            // In a real app, this would be a separate process or admin panel
            const msgCount = await prisma.message.count({ where: { sessionId: chatSession.id } });
            if (msgCount <= 1 || content.toLowerCase().includes('help')) {
                setTimeout(async () => {
                    // This async operation inside a serverless fn might be cut off, but for demo it's "okay" or we just insert immediately
                    // For robust vercel/nextjs, we should insert immediately or use a queue. 
                    // We'll insert immediately for simplicity of the prompt "Real Data" requirement.
                }, 0);
                await prisma.message.create({
                    data: {
                        sessionId: chatSession.id,
                        content: "Terima kasih telah menghubungi BorneoTrip! Agen kami akan segera bergabung.",
                        isAdmin: true,
                        read: false
                    }
                });
            }

            return res.status(201).json(message);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error sending message' });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
