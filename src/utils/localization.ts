import { LocalizedString } from '@/types';

export const getLocalized = (content: string | LocalizedString | undefined | null): string => {
    if (!content) return '';
    if (typeof content === 'string') return content;
    return content.id || content.en || '';
};

export const ensureLocalized = (content: string | LocalizedString | undefined | null): LocalizedString => {
    if (!content) return { id: '', en: '' };
    if (typeof content === 'string') return { id: content, en: '' };
    return content;
};
