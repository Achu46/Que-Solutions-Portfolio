import React, { useState, useEffect } from 'react';
import { PhoneIncoming, PhoneOutgoing, MessageSquareText, Headphones, Activity, CheckCircle2, TrendingUp } from 'lucide-react';

export default function HeroVisual() {
  const [activeCallTime, setActiveCallTime] = useState(84);
  const [activeTab, setActiveTab] = useState('inbound');

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCallTime((prev) => (prev > 120 ? 60 : prev + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `0${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="relative w-full max-w-lg lg:max-w-xl mx-auto select-none">
      {/* Ambient background glow in soft logo sage */}
      <div className="absolute -inset-4 bg-gradient-to-r from-brand-500/15 to-brand-600/10 rounded-3xl blur-2xl -z-10" />

      {/* Main Container Card: Crisp White with Olive Border */}
      <div className="relative bg-white rounded-2xl p-5 sm:p-6 border border-[#DCE5D5] shadow-xl overflow-hidden">
        {/* Top Status Header */}
        <div className="flex items-center justify-between border-b border-[#E8EFE3] pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 text-brand-600">
              <Headphones className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-500 rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-500 rounded-full" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Que Support Operations</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200 font-semibold">
                  Live Active
                </span>
              </div>
              <div className="text-xs text-slate-500">Customer Care & Support Dispatch</div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-500">Shift Schedule</div>
            <div className="text-xs font-bold text-brand-700">4h / Mon–Sat</div>
          </div>
        </div>

        {/* Channel Switcher Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-[#F4F7F2] rounded-xl border border-[#E2EADA] mb-5">
          <button
            onClick={() => setActiveTab('inbound')}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'inbound'
                ? 'bg-white text-brand-800 border border-brand-200 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PhoneIncoming className="w-3.5 h-3.5 text-brand-600" />
            <span>Inbound</span>
          </button>
          <button
            onClick={() => setActiveTab('outbound')}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'outbound'
                ? 'bg-white text-brand-800 border border-brand-200 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PhoneOutgoing className="w-3.5 h-3.5 text-brand-600" />
            <span>Outbound</span>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'chat'
                ? 'bg-white text-brand-800 border border-brand-200 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquareText className="w-3.5 h-3.5 text-brand-600" />
            <span>Chat / WA</span>
          </button>
        </div>

        {/* Dynamic Interactive Channel View */}
        {activeTab === 'inbound' && (
          <div className="space-y-3 animate-fadeIn">
            {/* Live Call in Progress */}
            <div className="p-3.5 bg-[#F9FAF8] rounded-xl border border-[#E2EADA] flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600">
                  <PhoneIncoming className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Customer Inquiry · Order #8491</div>
                  <div className="text-[11px] text-slate-500">Tracking & Return Query — Resolution in Progress</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono font-bold text-brand-700">{formatTimer(activeCallTime)}</div>
                <div className="text-[10px] text-brand-600 font-semibold">Connected</div>
              </div>
            </div>

            {/* Completed Call */}
            <div className="p-3 bg-white rounded-xl border border-[#E8EFE3] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800">Product Pre-Sale Question</div>
                  <div className="text-[10px] text-slate-500">Customer Assisted & Lead Captured</div>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-brand-50 text-brand-700 font-medium border border-brand-200">Resolved</span>
            </div>
          </div>
        )}

        {activeTab === 'outbound' && (
          <div className="space-y-3 animate-fadeIn">
            <div className="p-3.5 bg-[#F9FAF8] rounded-xl border border-[#E2EADA] flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600">
                  <PhoneOutgoing className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Order Verification Callback</div>
                  <div className="text-[11px] text-slate-500">Cash-on-Delivery Address Confirmed</div>
                </div>
              </div>
              <span className="text-[10px] px-2 py-1 rounded bg-brand-50 text-brand-700 border border-brand-200 font-semibold">
                Confirmed
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#E8EFE3] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800">Abandoned Cart Follow-up</div>
                  <div className="text-[10px] text-slate-500">Customer Completed Checkout</div>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-brand-50 text-brand-700 font-mono border border-brand-200">Won</span>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="space-y-3 animate-fadeIn">
            <div className="p-3.5 bg-[#F9FAF8] rounded-xl border border-[#E2EADA] space-y-2.5">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-semibold text-brand-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-500 inline-block"></span>
                  WhatsApp Business
                </span>
                <span>Just now</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg text-xs text-slate-800 border border-[#E2EADA] shadow-sm">
                "Hello, I placed order #4120 yesterday. When will it ship to Chennai?"
              </div>
              <div className="bg-brand-600 p-2.5 rounded-lg text-xs text-white shadow-sm ml-4">
                "Hi! Your order is packed and dispatched via courier. Tracking link: qsol.in/tr/4120"
              </div>
            </div>
          </div>
        )}

        {/* Bottom Key Value Proof Metric Cards */}
        <div className="grid grid-cols-2 gap-3 pt-4 mt-5 border-t border-[#E8EFE3]">
          <div className="bg-[#F9FAF8] p-2.5 rounded-xl border border-[#E2EADA] flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-brand-50 text-brand-600 border border-brand-200">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Response Time</div>
              <div className="text-xs font-bold text-slate-900">&lt; 3 Minutes</div>
            </div>
          </div>

          <div className="bg-[#F9FAF8] p-2.5 rounded-xl border border-[#E2EADA] flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-brand-50 text-brand-600 border border-brand-200">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Quality SLA</div>
              <div className="text-xs font-bold text-slate-900">100% Monitored</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
