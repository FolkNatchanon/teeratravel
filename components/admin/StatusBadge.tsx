import React from 'react';

type StatusVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface StatusBadgeProps {
    status: string;
    variant?: StatusVariant;
    className?: string;
}

const variantStyles: Record<StatusVariant, string> = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    neutral: 'bg-gray-100 text-gray-800',
};

// Helper function to guess variant if not provided
const getVariantFromStatus = (status: string): StatusVariant => {
    const s = status.toLowerCase();
    if (['complete', 'confirmed', 'active', 'paid'].includes(s)) return 'success';
    if (['pending', 'processing', 'draft'].includes(s)) return 'warning';
    if (['cancelled', 'cancel', 'rejected', 'inactive'].includes(s)) return 'error';
    if (['open', 'scheduled'].includes(s)) return 'info';
    return 'neutral';
};

export default function StatusBadge({ status, variant, className = '' }: StatusBadgeProps) {
    const finalVariant = variant || getVariantFromStatus(status);

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[finalVariant]} ${className}`}>
            {status}
        </span>
    );
}
