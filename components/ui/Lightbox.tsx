'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'

interface LightboxProps {
    isOpen: boolean
    onClose: () => void
    imageSrc: string
    imageAlt?: string
    actions?: React.ReactNode
}

export default function Lightbox({ isOpen, onClose, imageSrc, imageAlt, actions }: LightboxProps) {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        if (isOpen) {
            window.addEventListener('keydown', handleEsc)
            document.body.style.overflow = 'hidden' // Prevent scrolling
        }
        return () => {
            window.removeEventListener('keydown', handleEsc)
            document.body.style.overflow = ''
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return createPortal(
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px',
            }}
            onClick={onClose}
        >
            {/* Close Button */}
            <button
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    fontSize: '2rem',
                    cursor: 'pointer',
                    zIndex: 10000,
                }}
                aria-label="Close"
            >
                &times;
            </button>

            {/* Image Container */}
            <div
                style={{
                    position: 'relative',
                    maxWidth: '100%',
                    maxHeight: '90%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={imageSrc}
                    alt={imageAlt || 'Lightbox Image'}
                    style={{
                        maxWidth: '100%',
                        maxHeight: '80vh',
                        objectFit: 'contain',
                        borderRadius: '4px',
                    }}
                    onClick={(e) => e.stopPropagation()}
                />

                {/* Actions Bar */}
                {actions && (
                    <div
                        style={{
                            marginTop: '1rem',
                            display: 'flex',
                            gap: '1rem',
                            padding: '10px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            backdropFilter: 'blur(5px)',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {actions}
                    </div>
                )}
            </div>
        </div>,
        document.body
    )
}
