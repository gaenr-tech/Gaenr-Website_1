import React, { useState } from 'react';
import { FreelancerProfile, ServiceCategory } from '../../../types';
import {
  Users,
  CheckCircle2,
  Layers,
  Star,
  Plus,
  ExternalLink,
  TrendingUp,
  BarChart2,
  PieChart,
} from 'lucide-react';

interface OverviewViewProps {
  freelancers: FreelancerProfile[];
  categories: ServiceCategory[];
  navigate: (route: string) => void;
}

type TrendTimeframe = 'daily' | 'weekly' | 'monthly' | 'yearly';

export const OverviewView: React.FC<OverviewViewProps> = ({
  freelancers,
  categories,
  navigate,
}) => {
  const [timeframe, setTimeframe] = useState<TrendTimeframe>('daily');
  const totalFreelancers = freelancers.length;
  const activePublicProfiles = freelancers.filter((f) => f.isPublic).length;
  const draftProfiles = totalFreelancers - activePublicProfiles;
  const totalCategories = categories.length;

  const totalReviews = freelancers.reduce((sum, f) => sum + (f.reviewsCount || 0), 0);
  const totalCompletedProjects = freelancers.reduce(
    (sum, f) => sum + (f.completedProjects || 0),
    0
  );
  const reviewedFreelancers = freelancers.filter((f) => (f.reviewsCount || 0) > 0);
  const avgRating =
    totalReviews > 0 && reviewedFreelancers.length > 0
      ? (
          reviewedFreelancers.reduce((sum, f) => sum + (f.rating || 0), 0) /
          reviewedFreelancers.length
        ).toFixed(1)
      : '0.0';

  // ── Real-time chart data: labels derived from actual current date/time ──────
  const now = new Date();

  // Daily: 24 hourly divisions for 24 hours (1h - 24h)
  const dailyTrend = Array.from({ length: 24 }, (_, i) => ({
    label: `${i + 1}h`,
    count: 0,
  }));

  // Weekly: last 7 days (today backwards)
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyTrend = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (6 - i));
    return { label: dayNames[d.getDay()], count: 0 };
  });

  // Monthly: last 30 days — rendered as a line chart (too many bars otherwise)
  const monthlyTrend = Array.from({ length: 30 }, (_, i) => ({
    label: `D${i + 1}`,
    count: 0,
  }));

  // Yearly: last 12 months
  const monthAbbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const yearlyTrend = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
    return { label: monthAbbr[d.getMonth()], count: 0 };
  });

  const currentTrendData =
    timeframe === 'daily'
      ? dailyTrend
      : timeframe === 'weekly'
      ? weeklyTrend
      : timeframe === 'yearly'
      ? yearlyTrend
      : monthlyTrend;

  const maxDeliveryCount = Math.max(...currentTrendData.map((d) => d.count), 10);

  const timeframeMeta: Record<TrendTimeframe, { subtitle: string; footnote: string }> = {
    daily: {
      subtitle: 'Daily Deliveries (24 Hours)',
      footnote: 'Hourly delivery activity',
    },
    weekly: {
      subtitle: 'Daily Deliveries (7 Days)',
      footnote: 'Daily delivery totals',
    },
    monthly: {
      subtitle: 'Daily Deliveries (30 Days)',
      footnote: 'Daily output over the past month',
    },
    yearly: {
      subtitle: 'Monthly Deliveries (12 Months)',
      footnote: 'Monthly delivery totals',
    },
  };

  // Category distribution
  const categoryStats = categories.map((cat, idx) => {
    const count = freelancers.filter((f) => f.category === cat.slug).length;
    const percentage =
      totalFreelancers > 0 ? Math.round((count / totalFreelancers) * 100) : 0;
    const colors = [
      'bg-[#006eff]',
      'bg-indigo-500',
      'bg-emerald-500',
      'bg-amber-500',
      'bg-purple-500',
      'bg-rose-500',
      'bg-cyan-500',
    ];
    return {
      ...cat,
      count,
      percentage,
      color: colors[idx % colors.length],
    };
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Dashboard Overview Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time statistics of verified experts, completed deliveries, skill categories, and client reviews.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => navigate('/manage/profiles/new')}
            className="px-4 py-2 bg-[#006eff] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Expert</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#006eff]" />
            <span>View Public Site</span>
          </button>
        </div>
      </div>

      {/* 4 Direct & Simple KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Experts */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              Experts
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#006eff] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
              {totalFreelancers}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
              <span className="text-emerald-600 font-bold">{activePublicProfiles} Live Public</span>
              <span>•</span>
              <span className="text-slate-400">{draftProfiles} Draft</span>
            </div>
          </div>
        </div>

        {/* Card 2: Completed Deliveries */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              Completed Deliveries
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
              {totalCompletedProjects}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>100% Client Satisfaction</span>
            </div>
          </div>
        </div>

        {/* Card 3: Skills & Categories */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              Skills &amp; Categories
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
              {totalCategories}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Active precision outsourcing lines
            </div>
          </div>
        </div>

        {/* Card 4: Client Reviews */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              Client Reviews
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
                {avgRating}
              </span>
              <span className="text-xs text-slate-400 font-mono">/ 5.0</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              <span className="font-bold text-slate-800">{totalReviews}</span> verified feedbacks
            </div>
          </div>
        </div>
      </div>

      {/* Infographics & Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Deliveries & Output Performance (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-[#006eff]" />
                <span>Deliveries &amp; Project Output Trend</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {timeframeMeta[timeframe].subtitle}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Daily, Weekly, Monthly, Yearly Filter Buttons */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/80">
                {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => setTimeframe(period)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                      timeframe === period
                        ? 'bg-white text-[#006eff] shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chart Visualization — line for monthly, bars for daily/weekly/yearly */}
          <div className="pt-2">
            {timeframe === 'monthly' ? (
              /* ── Line Chart (Monthly 30 days) ─────────────────────────── */
              <div className="px-2 sm:px-4">
                <div className="relative h-48 w-full">
                  {(() => {
                    const W = 600;
                    const H = 160;
                    const pad = { top: 8, right: 12, bottom: 4, left: 28 };
                    const innerW = W - pad.left - pad.right;
                    const innerH = H - pad.top - pad.bottom;
                    const maxVal = Math.max(...monthlyTrend.map(d => d.count), 1);
                    const pts = monthlyTrend.map((d, i) => {
                      const x = pad.left + (i / (monthlyTrend.length - 1)) * innerW;
                      const y = pad.top + innerH - (d.count / maxVal) * innerH;
                      return `${x},${y}`;
                    });
                    const allZero = monthlyTrend.every(d => d.count === 0);
                    const flatY = pad.top + innerH;
                    return (
                      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
                        {/* Horizontal grid lines */}
                        {[0, 0.25, 0.5, 0.75, 1].map(pct => (
                          <line key={pct} x1={pad.left} x2={W - pad.right} y1={pad.top + innerH * (1 - pct)} y2={pad.top + innerH * (1 - pct)} stroke="#f1f5f9" strokeWidth="1" />
                        ))}
                        {/* Baseline */}
                        <line x1={pad.left} x2={W - pad.right} y1={H - pad.bottom} y2={H - pad.bottom} stroke="#e2e8f0" strokeWidth="1.5" />
                        {allZero ? (
                          /* flat dotted line when no data */
                          <line x1={pad.left} x2={W - pad.right} y1={flatY} y2={flatY} stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />
                        ) : (
                          <>
                            {/* Area fill */}
                            <defs>
                              <linearGradient id="line-fill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#006eff" stopOpacity="0.15" />
                                <stop offset="100%" stopColor="#006eff" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            <polygon
                              points={`${pad.left},${H - pad.bottom} ${pts.join(' ')} ${W - pad.right},${H - pad.bottom}`}
                              fill="url(#line-fill)"
                            />
                            {/* Line */}
                            <polyline points={pts.join(' ')} fill="none" stroke="#006eff" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                            {/* Dots every 5 days */}
                            {monthlyTrend.filter((_, i) => i % 5 === 4).map((d, i) => {
                              const idx = (i + 1) * 5 - 1;
                              const x = pad.left + (idx / (monthlyTrend.length - 1)) * innerW;
                              const y = pad.top + innerH - (d.count / maxVal) * innerH;
                              return <circle key={i} cx={x} cy={y} r="3" fill="#006eff" stroke="white" strokeWidth="1.5" />;
                            })}
                          </>
                        )}
                        {/* X-axis labels: D1, D5, D10…D30 */}
                        {[0, 4, 9, 14, 19, 24, 29].map(i => {
                          const x = pad.left + (i / (monthlyTrend.length - 1)) * innerW;
                          return (
                            <text key={i} x={x} y={H} textAnchor="middle" fontSize="8" fill="#94a3b8" fontFamily="monospace">
                              D{i + 1}
                            </text>
                          );
                        })}
                      </svg>
                    );
                  })()}
                </div>
                {monthlyTrend.every(d => d.count === 0) && (
                  <p className="text-center text-[11px] text-slate-400 font-mono mt-1">No delivery data yet</p>
                )}
              </div>
            ) : (
              /* ── Bar Chart (Daily / Weekly / Yearly) ───────────────────── */
              <div
                className={`h-56 flex items-end justify-between border-b border-slate-100 pb-3 ${
                  timeframe === 'daily'
                    ? 'gap-1 sm:gap-1.5 px-1 sm:px-3 overflow-x-auto'
                    : 'gap-2.5 sm:gap-6 px-2 sm:px-6'
                }`}
              >
                {currentTrendData.map((d) => {
                  const heightPercent = d.count === 0 ? 5 : Math.max(15, Math.round((d.count / maxDeliveryCount) * 100));
                  const isEmpty = d.count === 0;
                  const isDaily = timeframe === 'daily';

                  return (
                    <div
                      key={d.label}
                      className={`flex-1 flex flex-col items-center gap-1.5 group ${
                        isDaily ? 'min-w-[12px] sm:min-w-[16px]' : ''
                      }`}
                    >
                      <span
                        className={`font-mono font-bold transition-colors ${
                          isDaily ? 'text-[9px] sm:text-[10px]' : 'text-[11px]'
                        } ${isEmpty ? 'text-slate-300' : 'text-slate-600 group-hover:text-[#006eff]'}`}
                      >
                        {d.count}
                      </span>
                      <div
                        className={`w-full bg-slate-100 rounded-t-lg overflow-hidden h-40 flex items-end ${
                          isDaily ? 'max-w-[20px]' : 'max-w-[48px]'
                        }`}
                      >
                        <div
                          className={`w-full rounded-t-lg transition-all duration-500 ${
                            isEmpty
                              ? 'bg-slate-100'
                              : 'bg-gradient-to-t from-[#006eff] to-blue-400 group-hover:brightness-110'
                          }`}
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>
                      <span
                        className={`font-semibold text-slate-500 mt-0.5 whitespace-nowrap ${
                          isDaily
                            ? 'text-[7.5px] sm:text-[9px] font-mono'
                            : 'text-[10px]'
                        }`}
                      >
                        {d.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 px-2">
              <span className="font-mono">{timeframeMeta[timeframe].footnote}</span>
              <span className="text-slate-400 font-mono">
                {currentTrendData.reduce((s, d) => s + d.count, 0) === 0 ? 'No data yet' : `Total: ${currentTrendData.reduce((s, d) => s + d.count, 0)}`}
              </span>
            </div>
          </div>
        </div>

        {/* Chart 2: Category & Skill Distribution Infographic (1 Col) */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-[#006eff]" />
                <span>Category Distribution</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Workforce share across active skills
              </p>
            </div>
            <button
              onClick={() => navigate('/manage/categories')}
              className="text-xs text-[#006eff] hover:underline font-semibold cursor-pointer"
            >
              Categories →
            </button>
          </div>

          {/* Segmented Bar Breakdown */}
          <div className="space-y-3.5 pt-1">
            {categoryStats.map((cat) => (
              <div key={cat.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 truncate">{cat.title}</span>
                  <span className="font-mono text-slate-500 text-[11px]">
                    {cat.count} ({cat.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${cat.color} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.max(cat.percentage, 6)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Total Disciplines:</span>
            <span className="font-bold text-slate-700">{totalCategories} Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
