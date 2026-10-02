import React, { useState, useRef } from 'react';
import { AvatarAsset, FreelancerProfile } from '../../../types';
import { AvatarGraphic, getOfficialAvatarUrl } from '../../../components/common/Avatars';
import {
  Sparkles,
  Upload,
  Trash2,
  Lock,
  X,
  Image as ImageIcon,
  CheckCircle2,
  FileUp,
} from 'lucide-react';

interface AvatarsManageViewProps {
  avatars: AvatarAsset[];
  freelancers: FreelancerProfile[];
  onAddAvatar: (avatar: AvatarAsset) => void;
  onDeleteAvatar: (id: string) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AvatarsManageView: React.FC<AvatarsManageViewProps> = ({
  avatars,
  freelancers,
  onAddAvatar,
  onDeleteAvatar,
  showToast,
}) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [avatarName, setAvatarName] = useState('');
  const [avatarImageBase64, setAvatarImageBase64] = useState<string>('');
  const [avatarImageUrl, setAvatarImageUrl] = useState('');
  const [showUrlFallback, setShowUrlFallback] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Find all experts using this avatar
  const getAssignedFreelancers = (avatarId: string) => {
    return freelancers.filter((fl) => fl.avatarId === avatarId);
  };

  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WebP, SVG)', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const rawDataUrl = event.target.result as string;
        // 1. Immediately set preview so user sees image without any lag
        setAvatarImageBase64(rawDataUrl);

        if (!avatarName.trim()) {
          const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          const formatted = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
          setAvatarName(formatted);
        }

        const officialMatch = getOfficialAvatarUrl(file.name);
        if (officialMatch) {
          setAvatarImageUrl(officialMatch);
        }

        // 2. Perform canvas optimization in parallel
        try {
          const img = new Image();
          img.onload = () => {
            try {
              const maxDim = 400;
              let width = img.width;
              let height = img.height;
              if (width > maxDim || height > maxDim) {
                if (width > height) {
                  height = Math.round((height * maxDim) / width);
                  width = maxDim;
                } else {
                  width = Math.round((width * maxDim) / height);
                  height = maxDim;
                }
              }
              const canvas = document.createElement('canvas');
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(img, 0, 0, width, height);
                const optimized = canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.88);
                setAvatarImageBase64(optimized);
              }
            } catch {}
          };
          img.src = rawDataUrl;
        } catch {}
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleUploadAvatar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!avatarName.trim()) {
      showToast('Please enter an avatar name/label (e.g. The Intuitive Mind)', 'error');
      return;
    }

    const officialUrl = getOfficialAvatarUrl(avatarName);
    const finalImage = officialUrl || avatarImageBase64 || avatarImageUrl.trim();
    if (!finalImage) {
      showToast('Please upload an avatar image or provide a valid image URL', 'error');
      return;
    }

    const newAvatar: AvatarAsset = {
      id: `avatar-${Date.now()}`,
      name: avatarName.trim(),
      gender: 'male',
      tone: 'standard',
      assignedCount: 0,
      imageUrl: finalImage,
    };

    onAddAvatar(newAvatar);

    // Reset
    setAvatarName('');
    setAvatarImageBase64('');
    setAvatarImageUrl('');
    setShowUrlFallback(false);
    setShowUploadModal(false);
  };

  const handleDeleteWithConfirmation = (avatar: AvatarAsset) => {
    const assigned = getAssignedFreelancers(avatar.id);
    if (assigned.length > 0) {
      showToast(
        `Cannot remove avatar! It is in use by ${assigned.length} expert(s) (${assigned.map((f) => f.code).join(', ')}).`,
        'error'
      );
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete avatar "${avatar.name}"?`
    );
    if (!confirmed) return;

    onDeleteAvatar(avatar.id);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Avatar Library
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Upload and manage custom profile avatars safeguarding expert privacy across public showcases.
          </p>
        </div>
        {/* Upload avatar image button */}
        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2 bg-[#006eff] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/20 flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Avatar Image</span>
        </button>
      </div>

      {/* Grid of Avatars or Empty State */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {avatars.length === 0 ? (
          <div className="col-span-full py-16 px-6 bg-white border border-slate-200/90 rounded-3xl text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#006eff] flex items-center justify-center mx-auto shadow-xs border border-blue-100">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">No Custom Avatars Uploaded</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Upload your preferred avatar portraits. Any uploaded avatar can be chosen when creating or editing an expert profile.
              </p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-5 py-2.5 bg-[#006eff] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/20 inline-flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload First Avatar</span>
            </button>
          </div>
        ) : (
          avatars.map((av) => {
            const assignedFreelancers = getAssignedFreelancers(av.id);
            const isAssigned = assignedFreelancers.length > 0;

            return (
              <div
                key={av.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-300 transition-all group"
              >
                {/* Preview Avatar Image */}
                <div className="flex flex-col items-center text-center pt-2">
                  <div className="w-24 h-24 rounded-2xl bg-slate-100 border border-slate-200/90 flex items-center justify-center mb-3.5 shadow-xs overflow-hidden group-hover:scale-105 transition-transform">
                    <img
                      src={av.imageUrl || getOfficialAvatarUrl(av.name || av.id)}
                      alt={av.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const fallback = getOfficialAvatarUrl(av.name || av.id);
                        if (fallback && !e.currentTarget.src.endsWith(fallback)) {
                          e.currentTarget.src = fallback;
                        }
                      }}
                    />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm truncate max-w-full">
                    {av.name}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {av.id}
                  </span>
                </div>

                {/* Status and Removal Controls */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  {/* Protect assigned avatars from removal */}
                  {isAssigned ? (
                    <div
                      title={`In use by: ${assignedFreelancers.map((f) => f.code).join(', ')}`}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold"
                    >
                      <Lock className="w-3 h-3" />
                      <span>
                        In Use ({assignedFreelancers.length}{' '}
                        {assignedFreelancers.length === 1 ? 'expert' : 'experts'})
                      </span>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-mono font-medium">
                      Available
                    </span>
                  )}

                  {/* Remove avatar with confirmation */}
                  <button
                    onClick={() => handleDeleteWithConfirmation(av)}
                    disabled={isAssigned}
                    title={
                      isAssigned
                        ? `Cannot remove: In use by ${assignedFreelancers.length} expert(s) (${assignedFreelancers.map((f) => f.code).join(', ')})`
                        : 'Remove avatar'
                    }
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      isAssigned
                        ? 'text-slate-300 cursor-not-allowed'
                        : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Upload Avatar Modal */}
      {showUploadModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowUploadModal(false);
              setAvatarImageBase64('');
            }
          }}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#006eff] flex items-center justify-center">
                  <FileUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Upload Avatar</h3>
                  <p className="text-[11px] text-slate-500">Add a custom portrait for expert profiles</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setAvatarImageBase64('');
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadAvatar} className="space-y-4 text-xs">
              {/* Direct File Upload Dropzone */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Avatar Image File <span className="text-rose-500">*</span>
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/webp, image/svg+xml"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileProcess(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />

                {avatarImageBase64 ? (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-4">
                    <img
                      src={avatarImageBase64}
                      alt="Uploaded preview"
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-2xs shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs mb-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Image Loaded</span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">Ready to register into library</p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-1 text-[11px] text-[#006eff] hover:underline font-semibold cursor-pointer"
                      >
                        Change Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                      isDragging
                        ? 'border-[#006eff] bg-blue-50/50'
                        : 'border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center mx-auto mb-2 shadow-2xs">
                      <Upload className="w-6 h-6 text-[#006eff]" />
                    </div>
                    <span className="font-bold text-slate-800 text-xs block">
                      Click to choose image or drag &amp; drop
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-1">
                      PNG, JPG, WebP, SVG (Square or Portrait recommended)
                    </span>
                  </div>
                )}
              </div>

              {/* Avatar Label / Style Name */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Avatar Label / Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Avatar 01, Executive Casual, Modern Tech"
                  value={avatarName}
                  onChange={(e) => setAvatarName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-[#006eff] focus:outline-none transition-all"
                />
              </div>

              {/* Secondary option: paste image URL */}
              {!avatarImageBase64 && (
                <div>
                  <button
                    type="button"
                    onClick={() => setShowUrlFallback(!showUrlFallback)}
                    className="text-[11px] text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
                  >
                    {showUrlFallback ? '− Hide URL input' : '+ Or paste an image URL instead'}
                  </button>
                  {showUrlFallback && (
                    <div className="mt-2">
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={avatarImageUrl}
                        onChange={(e) => setAvatarImageUrl(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-[#006eff] focus:outline-none text-[11px] font-mono"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setAvatarImageBase64('');
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#006eff] hover:bg-blue-600 text-white font-bold rounded-xl shadow-sm shadow-blue-500/20 cursor-pointer transition-all"
                >
                  Save to Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
