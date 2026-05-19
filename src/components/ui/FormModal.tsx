'use client'

import React, { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface FormModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
  onSubmit?: (e: React.FormEvent) => void
  submitLabel?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
}

const sizeMap = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl',
}

export default function FormModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  onSubmit,
  submitLabel = 'Salvar',
  size = 'md',
  loading = false,
}: FormModalProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div ref={ref} className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizeMap[size]} max-h-[90vh] flex flex-col`}>
        {/* Header */}
        <div className="px-7 py-5 border-b border-slate-100 flex items-start justify-between gap-4 flex-shrink-0">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">{title}</h3>
            {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors flex-shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={onSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="overflow-y-auto flex-1 px-7 py-5">
            {children}
          </div>

          {/* Footer */}
          {onSubmit && (
            <div className="px-7 py-4 border-t border-slate-100 flex items-center justify-end gap-3 flex-shrink-0 bg-slate-50/50 rounded-b-2xl">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 disabled:opacity-60 transition-colors flex items-center gap-2"
              >
                {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {submitLabel}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

// Form field helper components
export function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 pb-2 border-b border-slate-100">{title}</h4>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

export function FormRow({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
}

export function FormField({
  label,
  required,
  error,
  children,
  hint,
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
  hint?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

export function Input({
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white placeholder-slate-400 ${className}`}
    />
  )
}

export function Select({
  className = '',
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white ${className}`}
    >
      {children}
    </select>
  )
}

export function Textarea({
  className = '',
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white placeholder-slate-400 resize-none ${className}`}
    />
  )
}
