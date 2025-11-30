import React from 'react';
import { Eye } from 'lucide-react';
import type { FrackingTool } from '../App';

interface ToolCardProps {
  tool: FrackingTool;
  onSelect: () => void;
}

export function ToolCard({ tool, onSelect }: ToolCardProps) {
  return (
    <div 
      className="border border-[#E5E7EB] rounded-xl overflow-hidden bg-white hover:shadow-lg transition-all cursor-pointer group"
      onClick={onSelect}
    >
      {/* 封面图区域 */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <img
          src={tool.posterUrl}
          alt={tool.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Hover 遮罩 */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-3 text-white">
            <Eye className="w-12 h-12" />
            <span>查看 3D 模型</span>
          </div>
        </div>

        {/* 分组标签 */}
        <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/95 backdrop-blur-sm text-gray-700 rounded-lg text-xs shadow-sm">
          {tool.group}
        </div>
      </div>

      {/* 信息区域 */}
      <div className="p-4">
        <h3 className="text-gray-900 mb-2">{tool.name}</h3>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
          {tool.description}
        </p>
      </div>
    </div>
  );
}
