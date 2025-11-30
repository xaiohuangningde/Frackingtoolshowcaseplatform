import React, { useState } from 'react';
import { X, Link, Image, Box } from 'lucide-react';
import type { FrackingTool } from '../App';

interface UploadDialogProps {
  onClose: () => void;
  onSubmit: (tool: Omit<FrackingTool, 'id'>) => void;
  existingGroups: string[];
}

export function UploadDialog({ onClose, onSubmit, existingGroups }: UploadDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    group: '',
    description: '',
    posterUrl: '',
    modelUrl: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证
    if (!formData.name || !formData.group || !formData.posterUrl || !formData.modelUrl) {
      alert('请填写所有必填字段');
      return;
    }

    // 验证 URL 格式
    try {
      new URL(formData.posterUrl);
      new URL(formData.modelUrl);
    } catch {
      alert('请输入有效的 URL 地址');
      return;
    }

    onSubmit(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 模拟示例数据
  const fillExample = () => {
    setFormData({
      name: '示例工具-螺旋钻头',
      group: '钻井工具',
      description: '直径: 215mm | 适用地层: 中硬岩 | PDC材质',
      posterUrl: 'https://images.unsplash.com/photo-1581092583537-20d51876f3e9?w=800&h=800&fit=crop',
      modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
          <h2 className="text-gray-900">添加新工具</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-5">
            {/* 名称 */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                工具名称 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="例如: 可钻式复合桥塞-Type A"
                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                required
              />
            </div>

            {/* 分组 */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                工具分组 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.group}
                  onChange={(e) => handleChange('group', e.target.value)}
                  placeholder="输入新分组或选择已有分组"
                  className="flex-1 px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  list="groups"
                  required
                />
                <datalist id="groups">
                  {existingGroups.map(group => (
                    <option key={group} value={group} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* 描述 */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                工具描述
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="例如: 耐压: 70MPa | 温度: 150℃ | 材质: 高强度合金"
                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                rows={3}
              />
            </div>

            {/* 封面图 URL */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                <Image className="w-4 h-4 inline mr-1" />
                封面图 URL (CDN) <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="url"
                    value={formData.posterUrl}
                    onChange={(e) => handleChange('posterUrl', e.target.value)}
                    placeholder="https://cdn.example.com/image.jpg"
                    className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1.5">
                推荐尺寸: 800×800px，支持 .jpg / .png
              </p>
            </div>

            {/* 模型 URL */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                <Box className="w-4 h-4 inline mr-1" />
                3D 模型 URL (CDN) <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="url"
                    value={formData.modelUrl}
                    onChange={(e) => handleChange('modelUrl', e.target.value)}
                    placeholder="https://cdn.example.com/model.glb"
                    className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1.5">
                仅支持 .glb 格式，建议文件大小 {'<'} 10MB
              </p>
            </div>

            {/* 快速填充示例 */}
            <button
              type="button"
              onClick={fillExample}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              快速填充示例数据
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[#E5E7EB] bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            保存工具
          </button>
        </div>
      </div>
    </div>
  );
}