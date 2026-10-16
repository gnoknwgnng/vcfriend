"use client";

import { useState } from "react";
import { X, Plus, Rocket, AlertTriangle } from "lucide-react";
import { submitIdea } from "./actions";
import { motion, AnimatePresence } from "framer-motion";
import { NotificationOptIn } from "./NotificationOptIn";

export function MobilePitchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedName, setSubmittedName] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    const formData = new FormData(e.currentTarget);
    const authorName = formData.get("authorName") as string;
    const res = await submitIdea(formData);
    setIsLoading(false);
    if (res?.error) {
      setErrorMsg(res.error);
    } else {
      setSubmittedName(authorName || "");
      setIsSuccess(true);
      e.currentTarget.reset();
    }
  };

  return (
    <>
      {/* Mobile Floating Action Button */}
      <button
        onClick={() => {
          setIsOpen(true);
          setErrorMsg(null);
        }}
        className="lg:hidden fixed bottom-6 right-5 h-14 pl-4 pr-5 bg-coral text-white rounded-full shadow-[0_14px_30px_-10px_rgba(229,113,90,0.8)] flex items-center gap-2 font-semibold z-40 hover:bg-coral-deep transition-colors active:scale-95 cursor-pointer"
        aria-label="Pitch your idea"
      >
        <Plus className="w-5 h-5" />
        Pitch idea
      </button>

      {/* Full Screen Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="pitch-modal"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/50 backdrop-blur-sm lg:hidden p-0 sm:p-4"
          >
            <div className="w-full h-full max-h-[90vh] sm:h-auto sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col">
              <div className="px-6 py-4 flex justify-between items-center border-b border-line">
                <div>
                  <h2 className="text-xl font-semibold text-ink">Pitch your idea</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">What are you building?</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-full border border-line text-ink flex items-center justify-center hover:bg-mist transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {isSuccess ? (
                  <div className="p-6 text-center space-y-4">
                    <div className="mx-auto w-14 h-14 rounded-full bg-teal-light text-teal-deep flex items-center justify-center">
                      <Rocket className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-semibold text-ink">Pitch submitted</h2>
                    <p className="text-sm text-ink-soft leading-relaxed">
                      Your startup idea is now live in the global feed.
                    </p>
                    <div className="border-t border-line my-4" />
                    <div className="text-left font-sans">
                      <NotificationOptIn defaultName={submittedName} />
                    </div>
                    <button
                      onClick={() => {
                        setIsSuccess(false);
                        setIsOpen(false);
                        window.location.href = "/ideas";
                      }}
                      className="btn btn-ink w-full"
                    >
                      Back to feed
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="light-theme-form">
                    <div className="space-y-4 pt-6 px-6 text-ink">
                      {/* Notification opt-in for existing founders */}
                      <NotificationOptIn />

                      {/* Anti-Abuse Warning Notice */}
                      <div className="notice notice-warn flex gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>Please do not misuse this platform. Spammers&apos; IP addresses are logged, and invalid submissions are blocked by AI automatically.</span>
                      </div>

                      {errorMsg && (
                        <div className="notice notice-error" role="alert">
                          {errorMsg}
                        </div>
                      )}

                      <div className="space-y-3">
                        <input
                          name="authorName"
                          placeholder="Your name (optional)"
                          className="field"
                        />
                        <input
                          name="contactInfo"
                          placeholder="Contact phone number (optional)"
                          className="field"
                          type="tel"
                        />
                        <textarea
                          name="content"
                          placeholder="I am building a platform that helps..."
                          className="field min-h-[150px]"
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-6 pb-8 sm:pb-6 pt-4 px-6 border-t border-line bg-mist/70">
                      <button type="submit" disabled={isLoading} className="btn btn-coral w-full h-14 text-base">
                        <Rocket className="w-4 h-4" />
                        {isLoading ? "Submitting..." : "Submit pitch"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
