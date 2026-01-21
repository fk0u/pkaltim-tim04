// Basic Activity Logger
// Could be enhanced to write to DB or external service

export const logActivity = (userId: string, action: string, details: any = {}) => {
    const timestamp = new Date().toISOString();
    console.log(`[ACTIVITY] ${timestamp} | User: ${userId} | Action: ${action}`, details);
    // TODO: Write to ActivityLog table in DB
};
