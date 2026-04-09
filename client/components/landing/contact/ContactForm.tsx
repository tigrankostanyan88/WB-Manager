// landing/contact/ContactForm.tsx - Contact form component

import { Button } from '@/components/ui/button'
import { CheckCircle, Loader2, Send, XCircle } from 'lucide-react'
import { useContactForm } from './useContactForm'

export function ContactForm() {
  const {
    formData,
    privacyAccepted,
    isSubmitting,
    submitStatus,
    errorMessage,
    setPrivacyAccepted,
    handleInputChange,
    handleSubmit
  } = useContactForm()

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-white shadow-xl ring-1 ring-gray-900/5">
      <h2 className="text-xl sm:text-3xl font-bold tracking-tight mb-2 break-words leading-tight">
        Թողեք ձեր հաղորդագրությունը
      </h2>
      <p className="text-gray-500 mb-6 sm:mb-8 text-sm sm:text-base break-words">
        Լրացրեք ստորև բերված ձևը և մենք կկապնվենք ձեզ հետ 24 ժամվա ընթացքում:
      </p>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="flex items-center gap-2 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">Ձեր հաղորդագրությունը հաջողությամբ ուղարկվեց։ Մենք շուտով կկապնվենք ձեզ հետ։</p>
          </div>
        )}
        {submitStatus === 'error' && (
          <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
            <XCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{errorMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <div className="space-y-2">
            <label htmlFor="name" className="text-xs sm:text-sm font-semibold text-gray-700">
              Անուն
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={isSubmitting || submitStatus === 'success'}
              className="flex h-11 sm:h-12 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 sm:px-4 py-2 sm:py-3 text-sm ring-offset-white file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
              placeholder="Ձեր անունը"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-xs sm:text-sm font-semibold text-gray-700">
              Էլ. փոստ
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isSubmitting || submitStatus === 'success'}
              className="flex h-11 sm:h-12 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 sm:px-4 py-2 sm:py-3 text-sm ring-offset-white file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
              placeholder="Ձեր էլ. փոստը"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="subject" className="text-xs sm:text-sm font-semibold text-gray-700">
            Թեմա
          </label>
          <input
            type="text"
            id="subject"
            value={formData.subject}
            onChange={handleInputChange}
            disabled={isSubmitting || submitStatus === 'success'}
            className="flex h-11 sm:h-12 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 sm:px-4 py-2 sm:py-3 text-sm ring-offset-white file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
            placeholder="Հաղորդագրության թեման"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="text-xs sm:text-sm font-semibold text-gray-700">
            Հաղորդագրություն
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={handleInputChange}
            disabled={isSubmitting || submitStatus === 'success'}
            className="flex min-h-[100px] sm:min-h-[120px] w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 sm:px-4 py-2 sm:py-3 text-sm ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-y"
            placeholder="Գրեք ձեր հաղորդագրությունը այստեղ..."
          />
        </div>

        <div className="flex items-start sm:items-center gap-2 sm:gap-3 pt-2">
          <input
            id="privacy"
            name="privacy"
            type="checkbox"
            checked={privacyAccepted}
            onChange={(e) => setPrivacyAccepted(e.target.checked)}
            disabled={isSubmitting || submitStatus === 'success'}
            className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary transition duration-150 ease-in-out cursor-pointer mt-0.5 sm:mt-0 shrink-0"
          />
          <label
            htmlFor="privacy"
            className="text-xs sm:text-sm text-gray-600 cursor-pointer select-none break-words leading-tight sm:leading-normal"
          >
            Ես համաձայն եմ{' '}
            <span className="text-primary hover:underline font-medium">
              գաղտնիության քաղաքականությանը
            </span>
          </label>
        </div>

        <div className="pt-3">
          <Button
            type="submit"
            disabled={isSubmitting || submitStatus === 'success'}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 hover:from-violet-500 hover:via-purple-500 hover:to-violet-600 text-white font-bold text-base sm:text-lg shadow-xl shadow-violet-500/30 hover:shadow-violet-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 px-6 disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            {isSubmitting ? (
              <span className="flex items-center gap-3 relative z-10">
                <Loader2 className="w-5 h-5 animate-spin" />
                Ուղարկվում է...
              </span>
            ) : submitStatus === 'success' ? (
              <span className="flex items-center gap-3 relative z-10">
                <CheckCircle className="w-5 h-5" />
                Ուղարկված է
              </span>
            ) : (
              <span className="flex items-center gap-3 relative z-10">
                <Send className="w-5 h-5" />
                Ուղարկել հաղորդագրությունը
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
