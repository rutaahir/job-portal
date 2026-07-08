/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 4000);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16"
    >
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-bold text-primary-theme font-mono uppercase tracking-widest">
          Contact Us
        </span>
        <h1 className="text-3xl md:text-5xl font-serif font-extrabold text-text-primary-theme tracking-tight">
          We're Here to Help <br />You <span className="text-primary-theme">Succeed</span>
        </h1>
        <p className="text-text-secondary-theme font-normal text-sm sm:text-base">
          Have a question or need assistance? Reach out to our dedicated support and enterprise sales teams. We respond within 2 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Contact Info (Left Column) */}
        <div className="lg:col-span-5 bg-secondary-theme text-white p-8 rounded-3xl border border-border-theme/20 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(232,112,42,0.1),transparent_50%)]" />

          <div className="space-y-8 z-10">
            <h3 className="text-xl font-bold font-serif">Office Headquarters</h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 text-primary-theme rounded-xl">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-white/50 uppercase font-mono tracking-wider">Phone</div>
                  <div className="text-sm font-semibold">+91 8490911181</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 text-primary-theme rounded-xl">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-white/50 uppercase font-mono tracking-wider">Email</div>
                  <div className="text-sm font-semibold">sales@technoadviser.com</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 text-primary-theme rounded-xl">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-white/50 uppercase font-mono tracking-wider">Address</div>
                  <div className="text-sm font-semibold leading-relaxed">
                    Gandhinagar, Gujarat,<br />India - 382355
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 text-primary-theme rounded-xl">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-white/50 uppercase font-mono tracking-wider">Working Hours</div>
                  <div className="text-sm font-semibold">Mon - Sat: 9:00 AM - 6:00 PM</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-12 text-xs text-white/40 font-semibold font-mono tracking-wide z-10">
            TECHNOADVISER TECHNOLOGIES
          </div>
        </div>

        {/* Message Form (Right Column) */}
        <div className="lg:col-span-7 bg-surface-theme p-8 rounded-3xl border border-border-theme shadow-sm relative">
          <h3 className="text-xl font-bold text-text-primary-theme mb-6">Send Us a Message</h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary-theme">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rahul"
                  className="w-full bg-transparent border border-border-theme text-text-primary-theme rounded-xl p-3 text-sm focus:outline-none focus:border-primary-theme font-medium placeholder-text-muted-theme"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary-theme">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. socialbuzz31@gmail.com"
                  className="w-full bg-transparent border border-border-theme text-text-primary-theme rounded-xl p-3 text-sm focus:outline-none focus:border-primary-theme font-medium placeholder-text-muted-theme"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary-theme">Subject</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="How can we help you?"
                className="w-full bg-transparent border border-border-theme text-text-primary-theme rounded-xl p-3 text-sm focus:outline-none focus:border-primary-theme font-medium placeholder-text-muted-theme"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary-theme">Your Message</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Type your question or requirement here..."
                className="w-full bg-transparent border border-border-theme text-text-primary-theme rounded-xl p-3 text-sm focus:outline-none focus:border-primary-theme font-medium placeholder-text-muted-theme resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full bg-primary-theme hover:bg-primary-hover-theme disabled:bg-primary-theme/50 text-white font-bold py-3.5 px-6 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {status === 'sending' ? 'Sending Message...' : 'Send Message'}
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Success Dialog Overlay */}
          <AnimatePresence>
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 bg-surface-theme/95 rounded-3xl flex flex-col items-center justify-center text-center p-8 z-10"
              >
                <div className="w-16 h-16 bg-success-theme/15 text-success-theme rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-lg font-bold text-text-primary-theme mb-2">Message Sent Successfully!</h4>
                <p className="text-xs text-text-secondary-theme max-w-sm">
                  Thank you for writing to TechnoAdviser. Our support executive has received your ticket and will follow up with you shortly.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
