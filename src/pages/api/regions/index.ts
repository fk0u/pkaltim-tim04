import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { sendSuccess, sendError } from '@/lib/api-response';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const regions = await prisma.region.findMany();
      
      const regionsWithJson = regions.map(r => ({
          ...r,
          destinations: JSON.parse(r.destinations)
      }));

      return sendSuccess(res, regionsWithJson);
    } catch (error) {
      console.error(error);
      return sendError(res, 500, 'Error fetching regions');
    }
  } else {
    return sendError(res, 405, 'Method not allowed');
  }
}
