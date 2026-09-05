import Link from 'next/link';
import { Download, Smartphone, CheckCircle, ArrowLeft, ShieldCheck, Wifi } from 'lucide-react';

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 text-center">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Smartphone className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">QueueLess Mobile App</h1>
        <p className="text-sm text-slate-600 mb-6">
          Official Android Native Application for Smart Crowd & Wait Time Predictions.
        </p>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-6 text-left space-y-2 text-xs text-slate-700">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-slate-500">File Name:</span>
            <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200">QueueLess.apk</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-slate-500">File Size:</span>
            <span className="font-semibold text-emerald-600">3.86 MB (Ultra-Light)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-slate-500">Target OS:</span>
            <span>Android 6.0 to 15.0</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-slate-500">Live Sync:</span>
            <span className="flex items-center text-blue-600 font-medium">
              <Wifi className="w-3 h-3 mr-1" /> http://10.119.2.183:3000
            </span>
          </div>
        </div>

        <a
          href="/api/download"
          className="w-full inline-flex items-center justify-center py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-base shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5"
        >
          <Download className="w-5 h-5 mr-2" />
          Download QueueLess APK
        </a>

        <div className="mt-8 text-left border-t border-slate-100 pt-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Quick Installation Steps</h2>
          <ol className="text-xs text-slate-600 space-y-2.5 list-decimal list-inside">
            <li>Tap the <strong>Download QueueLess APK</strong> button above.</li>
            <li>When downloaded, tap the file in your notification bar.</li>
            <li>If asked, allow <em>&ldquo;Install from unknown sources&rdquo;</em> in settings.</li>
            <li>Open <strong>QueueLess</strong> and enjoy real-time wait tracking!</li>
          </ol>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <Link href="/" className="inline-flex items-center hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Home
          </Link>
          <span className="inline-flex items-center text-emerald-600 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Safe & Signed
          </span>
        </div>
      </div>
    </div>
  );
}

