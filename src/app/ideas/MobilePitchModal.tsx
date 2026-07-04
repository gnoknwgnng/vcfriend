"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { submitIdea } from "./actions";
import { motion, AnimatePresence } from "framer-motion";

export function MobilePitchModal() {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = async (formData: FormData) => {
    await submitIdea(formData);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Floating Action Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center z-40 hover:bg-emerald-700 transition-transform active:scale-95"
      >
        <Plus className="w-7 h-7" />
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
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm lg:hidden p-0 sm:p-4"
          >
            <div className="w-full h-full max-h-[90vh] sm:h-auto sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
              <div className="bg-emerald-500/10 border-b border-emerald-900/10 px-6 py-4 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Pitch Your Idea</h2>
                  <p className="text-sm text-slate-600 mt-1">What are you building?</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 bg-white/50 rounded-full hover:bg-white text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                <form action={handleAction}>
                  <div className="space-y-4 pt-6 px-6">
                    <div className="space-y-3">
                      <Input 
                        name="authorName" 
                        placeholder="Your Name (Optional)" 
                        className="bg-slate-50 border-slate-200 h-12"
                      />
                      <Input 
                        name="contactInfo" 
                        placeholder="Contact Phone Number (Optional)" 
                        className="bg-slate-50 border-slate-200 h-12"
                        type="tel"
                      />
                    </div>
                    <div className="space-y-2">
                      <Textarea 
                        name="content" 
                        placeholder="I am building a platform that helps..." 
                        className="min-h-[150px] bg-slate-50 border-slate-200 resize-none text-base"
                        required
                      />
                    </div>
                  </div>
                  <div className="bg-slate-50/80 mt-6 pb-8 sm:pb-6 pt-4 px-6 border-t border-slate-100">
                    <Button type="submit" className="w-full font-bold shadow-md bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-14 text-lg">
                      Submit Pitch
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
