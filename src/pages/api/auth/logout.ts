import type { NextApiRequest, NextApiResponse } from 'next';
import { sendSuccess, sendError } from '@/lib/api-response';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
      // In JWT stateless auth, server can't easily invalidate token without blacklist.
      // For now, we just return success to let client clear storage.
      // In advanced implementation, we would add token to a Redis blacklist.
      return sendSuccess(res, null, 'Logged out successfully');
  } else {
    return sendError(res, 405, 'Method not allowed');
  }
}
