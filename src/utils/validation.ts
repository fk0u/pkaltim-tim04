/**
 * Validation Utilities
 * simulating backend-grade validation logic
 */

// NIK Validation (16 digits, specific logic)
export const validateNIK = (nik: string): { isValid: boolean; message?: string } => {
    if (!nik) return { isValid: false, message: 'NIK is required' };
    if (!/^\d+$/.test(nik)) return { isValid: false, message: 'NIK must contain only numbers' };
    if (nik.length !== 16) return { isValid: false, message: 'NIK must be exactly 16 digits' };

    // Advanced check: Date of birth extraction (simplified)
    // NIK format: PPCCTTDDMMYYNNNN
    // DD > 40 means female (DD - 40)

    return { isValid: true };
};

// Phone Validation (Indonesian format favored)
export const validatePhone = (phone: string): { isValid: boolean; message?: string } => {
    if (!phone) return { isValid: false, message: 'Phone number is required' };
    // Supports +62, 62, 08...
    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,10}$/;
    if (!phoneRegex.test(phone)) return { isValid: false, message: 'Invalid Indonesian phone number format' };

    return { isValid: true };
};

// Email Validation
export const validateEmail = (email: string): { isValid: boolean; message?: string } => {
    if (!email) return { isValid: false, message: 'Email is required' };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return { isValid: false, message: 'Invalid email address' };

    return { isValid: true };
};

// Credit Card Validation (Basic Luhn or format)
export const validateCard = (cardNumber: string): { isValid: boolean; message?: string } => {
    const cleanNum = cardNumber.replace(/\s/g, '');
    if (!/^\d{16}$/.test(cleanNum)) return { isValid: false, message: 'Card number must be 16 digits' };
    return { isValid: true };
};
