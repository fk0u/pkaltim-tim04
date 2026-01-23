/**
 * BACKEND DATA SCHEMA DOCUMENTATION
 * ---------------------------------
 * This file contains the TypeScript interfaces that define the data contract
 * between the Frontend (Next.js) and the future Backend / Database.
 * 
 * CORE ENTITIES:
 * - User: Represents a customer or admin. Key fields: id, role, status.
 * - Booking: The central transaction record. 
 *   - Links `userId` to `productId`.
 *   - Contains denormalized `productName`, `productImage` for display efficiency.
 *   - Includes `travelers` array for passenger manifest.
 *   - Supports `productType` of 'Package' or 'Event'.
 * - TourPackage / Event: Product definitions.
 *   - 'Event' includes `quota` and specific `date`.
 *   - 'TourPackage' is typically multi-day with `duration`.
 * 
 * NOTES FOR BACKEND TEAM:
 * - Dates are currently ISO strings.
 * - `price` is in IDR (Integer).
 * - `travelers` array should be stored as JSONB or a separate relation.
 */
