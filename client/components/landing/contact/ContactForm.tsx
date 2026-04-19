// landing/contact/ContactForm.tsx - Contact form component

import { Button } from '@/components/ui/button'
import { CheckCircle, Loader2, Send, XCircle, User, Mail, MessageSquare, FileText } from 'lucide-react'
import { useContactForm } from './useContactForm'

export function ContactForm() {
  const {
    formData,
    privacyAccepted,
    isSubmitting,
    submitStatus,
    errorMessage,
    fieldErrors,
    setPrivacyAccepted,
    handleInputChange,
    handleSubmit
  } = useContactForm()

  return (
    <div className="relative w-full min-w-0 p-4 sm:p-8 lg:p-10 rounded-[1.25rem] sm:rounded-[1.5rem] lg:rounded-[2rem] bg-white sm:bg-white/80 sm:backdrop-blur-xl shadow-2xl shadow-violet-200/30 ring-1 ring-white/50">
      {/* Decorative gradient glow - hidden on mobile to prevent overflow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-blue-500/10 rounded-[2.2rem] blur-xl -z-10 hidden sm:block" />
      
      <div className="mb-6 sm:mb-8">
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
          Թողեք ձեր հաղորդագրությունը
        </h3>
        <p className="text-slate-500 text-sm sm:text-base">
          Լրացրեք ստորև բերված ձևը և մենք կկապնվենք ձեզ հետ 24 ժամվա ընթացքում
        </p>
      </div>

      <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-green-50/80 border border-green-200 text-green-700 backdrop-blur-sm">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <p className="text-xs sm:text-sm font-medium">Ձեր հաղորդագրությունը հաջողությամբ ուղարկվեց։ Մենք շուտով կկապնվենք ձեզ հետ։</p>
          </div>
        )}
        {submitStatus === 'error' && (
          <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-red-50/80 border border-red-200 text-red-700 backdrop-blur-sm">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <p className="text-xs sm:text-sm font-medium">{errorMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:gap-5">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <User className="w-4 h-4 text-violet-500" />
              Անուն
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={isSubmitting || submitStatus === 'success'}
              className={`flex h-12 w-full rounded-xl border ${fieldErrors.name ? 'border-red-400 focus-visible:ring-red-500/20 focus-visible:border-red-400' : 'border-slate-200 focus-visible:ring-violet-500/20 focus-visible:border-violet-400'} bg-slate-50/50 px-4 py-3 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:bg-white disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200`}
              placeholder="Ձեր անունը"
            />
            {fieldErrors.name && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Mail className="w-4 h-4 text-violet-500" />
              Էլ. փոստ
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isSubmitting || submitStatus === 'success'}
              className={`flex h-12 w-full rounded-xl border ${fieldErrors.email ? 'border-red-400 focus-visible:ring-red-500/20 focus-visible:border-red-400' : 'border-slate-200 focus-visible:ring-violet-500/20 focus-visible:border-violet-400'} bg-slate-50/50 px-4 py-3 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:bg-white disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200`}
              placeholder="Ձեր էլ. փոստը"
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="subject" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <FileText className="w-4 h-4 text-violet-500" />
            Թեմա
          </label>
          <input
            type="text"
            id="subject"
            value={formData.subject}
            onChange={handleInputChange}
            disabled={isSubmitting || submitStatus === 'success'}
            className={`flex h-12 w-full rounded-xl border ${fieldErrors.subject ? 'border-red-400 focus-visible:ring-red-500/20 focus-visible:border-red-400' : 'border-slate-200 focus-visible:ring-violet-500/20 focus-visible:border-violet-400'} bg-slate-50/50 px-4 py-3 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:bg-white disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200`}
            placeholder="Հաղորդագրության թեման"
          />
          {fieldErrors.subject && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.subject}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-violet-500" />
            Հաղորդագրություն
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={handleInputChange}
            disabled={isSubmitting || submitStatus === 'success'}
            className={`flex min-h-[120px] w-full rounded-xl border ${fieldErrors.message ? 'border-red-400 focus-visible:ring-red-500/20 focus-visible:border-red-400' : 'border-slate-200 focus-visible:ring-violet-500/20 focus-visible:border-violet-400'} bg-slate-50/50 px-4 py-3 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:bg-white disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-y`}
            placeholder="Գրեք ձեր հաղորդագրությունը այստեղ..."
          />
          {fieldErrors.message && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.message}</p>
          )}
        </div>

        <div className="flex items-start gap-2 sm:gap-3 pt-2">
          <div className="relative flex items-center">
            <input
              id="privacy"
              name="privacy"
              type="checkbox"
              checked={privacyAccepted}
              onChange={(e) => {
                setPrivacyAccepted(e.target.checked)
                if (fieldErrors.privacy) {
                  // Clear privacy error when checked
                }
              }}
              disabled={isSubmitting || submitStatus === 'success'}
              className={`h-4 w-4 sm:h-5 sm:w-5 rounded-lg ${fieldErrors.privacy ? 'border-red-400' : 'border-slate-300'} text-violet-600 focus:ring-violet-500/20 transition duration-150 ease-in-out cursor-pointer`}
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="privacy"
              className="text-xs sm:text-sm text-slate-600 cursor-pointer select-none break-words leading-relaxed"
            >
              Ես համաձայն եմ{' '}
              <span className="text-violet-600 hover:underline font-semibold">
                գաղտնիության քաղաքականությանը
              </span>
            </label>
            {fieldErrors.privacy && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.privacy}</p>
            )}
          </div>
        </div>

        <div className="pt-2 sm:pt-3">
          <Button
            type="submit"
            disabled={isSubmitting || submitStatus === 'success'}
            className="w-full h-12 sm:h-14 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 hover:from-violet-500 hover:via-fuchsia-500 hover:to-violet-500 text-white font-bold text-sm sm:text-lg shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 px-4 sm:px-6 disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            {isSubmitting ? (
              <span className="flex items-center gap-2 sm:gap-3 relative z-10">
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                Ուղարկվում է...
              </span>
            ) : submitStatus === 'success' ? (
              <span className="flex items-center gap-2 sm:gap-3 relative z-10">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                Ուղարկված է
              </span>
            ) : (
              <span className="flex items-center gap-2 sm:gap-3 relative z-10">
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="truncate">Ուղարկել հաղորդագրությունը</span>
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
