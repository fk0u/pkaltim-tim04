import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ message: 'Region ID is required' });
    }

    const regionId = typeof id === 'string' ? parseInt(id, 10) : id;

    if (isNaN(regionId as number)) {
        return res.status(400).json({ message: 'Invalid Region ID' });
    }

    if (req.method === 'GET') {
        try {
            const region = await prisma.region.findUnique({
                where: { id: regionId as number }
            });

            if (!region) {
                return res.status(404).json({ message: 'Region not found' });
            }

            return res.status(200).json({
                ...region,
                coordinates: { lat: region.latitude, lng: region.longitude }
            });
        } catch (error) {
            console.error('Error fetching region:', error);
            return res.status(500).json({ message: 'Error fetching region' });
        }
    }

    if (req.method === 'PUT') {
        try {
            const { coordinates, ...data } = req.body;

            // Handle coordinates if provided
            if (coordinates) {
                data.latitude = coordinates.lat;
                data.longitude = coordinates.lng;
            }

            const region = await prisma.region.update({
                where: { id: regionId as number },
                data
            });

            return res.status(200).json({
                ...region,
                coordinates: { lat: region.latitude, lng: region.longitude }
            });
        } catch (error) {
            console.error('Error updating region:', error);
            return res.status(500).json({ message: 'Error updating region' });
        }
    }

    if (req.method === 'DELETE') {
        try {
            await prisma.region.delete({
                where: { id: regionId as number }
            });

            return res.status(200).json({ message: 'Region deleted successfully' });
        } catch (error) {
            console.error('Error deleting region:', error);
            return res.status(500).json({ message: 'Error deleting region' });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
