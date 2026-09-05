'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Download, Smartphone, Laptop, Apple, ArrowLeft, ShieldCheck, Wifi, Check, ExternalLink, Globe } from 'lucide-react';

export default function DownloadPage() {
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'laptop'>('android');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-center p-4 sm:p-6 py-12">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Smartphone className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Get QueueLess App
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Choose your device below for instant installation or web access.
          </p>
        </div>

        {/* Device Switcher Tabs */}
        <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1.5 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('android')}
            className={`flex items-center justify-center py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeTab === 'android'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4 mr-1.5 text-emerald-600" />
            Android
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ios')}
            className={`flex items-center justify-center py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeTab === 'ios'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Apple className="w-4 h-4 mr-1.5 text-slate-800" />
            iPhone / iOS
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('laptop')}
            className={`flex items-center justify-center py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeTab === 'laptop'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Laptop className="w-4 h-4 mr-1.5 text-blue-600" />
            Laptop / PC
          </button>
        </div>

        {/* Tab 1: Android APK */}
        {activeTab === 'android' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5 text-xs text-slate-700">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-500">Binary Package:</span>
                <span className="font-mono bg-white px-2.5 py-0.5 rounded border border-slate-200 font-bold">QueueLess.apk</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-500">File Size:</span>
                <span className="font-semibold text-emerald-600">3.86 MB (Ultra-Lightweight)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-500">Compatibility:</span>
                <span>Android 6.0 up to Android 15.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-500">Local Wi-Fi Server:</span>
                <span className="flex items-center text-blue-600 font-semibold font-mono">
                  <Wifi className="w-3.5 h-3.5 mr-1" /> 10.119.2.183:3000
                </span>
              </div>
            </div>

            <a
              href="/api/download"
              className="w-full flex items-center justify-center py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-base shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Android APK (3.86 MB)
            </a>

            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-left text-xs text-amber-900 space-y-1.5">
              <div className="font-bold text-amber-800 flex items-center">
                <Check className="w-4 h-4 mr-1.5 text-emerald-600" />
                How to install on Android:
              </div>
              <p>1. Tap the button above to download the APK directly.</p>
              <p>2. Tap the downloaded file in your browser or notification bar.</p>
              <p>3. Choose <strong>Install</strong> (enable <em>&ldquo;Allow unknown apps&rdquo;</em> if prompted).</p>
            </div>
          </div>
        )}

        {/* Tab 2: iPhone / iOS (PWA) */}
        {activeTab === 'ios' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200 text-left text-xs text-blue-950 space-y-2">
              <div className="font-bold text-blue-900 flex items-center text-sm">
                <Apple className="w-4 h-4 mr-1.5 text-slate-900" />
                Why iPhones do not use APKs:
              </div>
              <p className="text-slate-600 leading-relaxed">
                Apple does not allow installing Android APK files on iOS. Instead, iPhones use <strong>Progressive Web Apps (PWA)</strong>, which install directly to your Home Screen with a full-screen native experience!
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-3 text-xs text-slate-700">
              <div className="font-bold text-slate-900 text-sm">3 Steps to Install on iPhone:</div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                <div>
                  Open <strong>Safari</strong> on your iPhone and go to:
                  <div className="font-mono bg-white p-1.5 rounded border border-slate-200 font-bold text-blue-600 mt-1">
                    http://10.119.2.183:3000
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                <div>
                  Tap the <strong>Share button</strong> at the bottom of Safari (the square icon with an arrow pointing up ⎋).
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</span>
                <div>
                  Scroll down and tap <strong>&ldquo;Add to Home Screen&rdquo;</strong>, then tap <strong>Add</strong>.
                </div>
              </div>
            </div>

            <div className="text-center text-xs text-slate-500">
              ✨ QueueLess will now appear on your iPhone screen with its own icon and open full-screen without browser bars!
            </div>
          </div>
        )}

        {/* Tab 3: Laptop / PC */}
        {activeTab === 'laptop' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-3 text-xs text-slate-700">
              <div className="font-bold text-slate-900 text-sm flex items-center">
                <Laptop className="w-4 h-4 mr-2 text-blue-600" />
                Laptop Web Application
              </div>
              <p className="text-slate-600">
                You can access the full QueueLess dashboard on any laptop, Mac, or desktop PC via any modern browser:
              </p>
              
              <div className="space-y-2">
                <div>
                  <div className="text-slate-500 font-semibold mb-1">On this laptop:</div>
                  <a
                    href="http://localhost:3000"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center font-mono font-bold text-blue-600 hover:underline"
                  >
                    http://localhost:3000 <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </a>
                </div>

                <div>
                  <div className="text-slate-500 font-semibold mb-1">On other laptops in your Wi-Fi:</div>
                  <a
                    href="http://10.119.2.183:3000"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center font-mono font-bold text-blue-600 hover:underline"
                  >
                    http://10.119.2.183:3000 <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-left text-xs text-emerald-950 space-y-2">
              <div className="font-bold text-emerald-900 flex items-center">
                <Check className="w-4 h-4 mr-1.5 text-emerald-700" />
                How to install as a Standalone App on Laptop (Chrome / Edge):
              </div>
              <p className="text-slate-600">
                1. Look at the right side of the address bar at the top of your browser.
              </p>
              <p className="text-slate-600">
                2. Click the <strong>Install icon</strong> (computer screen with a down arrow 📥).
              </p>
              <p className="text-slate-600">
                3. Click <strong>Install</strong>. QueueLess will launch as an independent desktop window app with its own Windows desktop icon!
              </p>
            </div>

            <Link
              href="/"
              className="w-full flex items-center justify-center py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all"
            >
              <Globe className="w-4 h-4 mr-2" />
              Open QueueLess Web Dashboard
            </Link>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <Link href="/" className="inline-flex items-center hover:text-slate-900 transition-colors font-medium">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Home
          </Link>
          <span className="inline-flex items-center text-emerald-600 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Verified & Virus-Free
          </span>
        </div>

      </div>
    </div>
  );
}
