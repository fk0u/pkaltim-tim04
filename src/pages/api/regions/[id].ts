import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { sendSuccess, sendError } from '@/lib/api-response';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const region = await prisma.region.findUnique({
        where: { id: Number(id) }
      });

      if (!region) {
        return sendError(res, 404, 'Region not found');
      }
      
      const regionWithJson = {
          ...region,
          destinations: JSON.parse(region.destinations)
      };

      return sendSuccess(res, regionWithJson);
    } catch (error) {
      return sendError(res, 500, 'Error fetching region');
    }
  } else {
    return sendError(res, 405, 'Method not allowed');
  }
}
