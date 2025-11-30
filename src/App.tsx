import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ToolCard } from './components/ToolCard';
import { UploadDialog } from './components/UploadDialog';
import { ModelDetail } from './components/ModelDetail';
import { Plus } from 'lucide-react';

export interface FrackingTool {
  id: string;
  name: string;
  group: string;
  description: string;
  posterUrl: string;
  modelUrl: string;
}

// 模拟数据 - 所有资源通过 CDN URL 引用
const MOCK_TOOLS: FrackingTool[] = [
  {
    id: '1',
    name: '可钻式复合桥塞-Type A',
    group: '井下工具',
    description: '耐压: 70MPa | 温度: 150℃ | 材质: 高强度合金',
    posterUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=800&fit=crop',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb'
  },
  {
    id: '2',
    name: '水力喷砂器',
    group: '井下工具',
    description: '喷射压力: 50-80MPa | 孔径: 6-12mm | 长度: 3.2m',
    posterUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&h=800&fit=crop',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb'
  },
  {
    id: '3',
    name: '高压柱塞泵',
    group: '压裂泵配件',
    description: '功率: 2500HP | 流量: 15BPM | 压力: 140MPa',
    posterUrl: 'https://images.unsplash.com/photo-1581092583537-20d51876f3e9?w=800&h=800&fit=crop',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/shishkebab.glb'
  },
  {
    id: '4',
    name: '压裂液混配器',
    group: '压裂泵配件',
    description: '容量: 50m³ | 混配精度: ±2% | 自动化控制',
    posterUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=800&fit=crop',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/RobotExpressive.glb'
  },
  {
    id: '5',
    name: '智能分簇工具',
    group: '井下工具',
    description: '分簇级数: 8-12级 | 控制方式: 压力/流量激活',
    posterUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=800&fit=crop',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Models/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb'
  }
];

export default function App() {
  const [tools, setTools] = useState<FrackingTool[]>(MOCK_TOOLS);
  const [selectedGroup, setSelectedGroup] = useState<string>('全部');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<FrackingTool | null>(null);

  // 动态获取所有分组
  const groups = ['全部', ...Array.from(new Set(tools.map(tool => tool.group)))];

  // 筛选工具
  const filteredTools = selectedGroup === '全部' 
    ? tools 
    : tools.filter(tool => tool.group === selectedGroup);

  // 添加新工具
  const handleAddTool = (newTool: Omit<FrackingTool, 'id'>) => {
    const tool: FrackingTool = {
      ...newTool,
      id: Date.now().toString()
    };
    setTools([...tools, tool]);
    setIsUploadDialogOpen(false);
  };

  // 重命名分组
  const handleRenameGroup = (oldName: string, newName: string) => {
    if (!newName.trim() || newName === oldName) return;
    
    // 检查新名称是否已存在
    if (groups.includes(newName)) {
      alert('该分组名称已存在');
      return;
    }

    // 更新所有工具的分组名称
    setTools(tools.map(tool => 
      tool.group === oldName ? { ...tool, group: newName } : tool
    ));

    // 如果当前选中的是被重命名的分组，更新选中状态
    if (selectedGroup === oldName) {
      setSelectedGroup(newName);
    }
  };

  // 删除分组
  const handleDeleteGroup = (groupName: string) => {
    if (groupName === '全部') return;

    const confirm = window.confirm(`确定要删除分组"${groupName}"吗？该分组下的所有工具将移至"未分组"。`);
    if (!confirm) return;

    // 将该分组下的所有工具移至"未分组"
    setTools(tools.map(tool => 
      tool.group === groupName ? { ...tool, group: '未分组' } : tool
    ));

    // 如果当前选中的是被删除的分组，切换到"全部"
    if (selectedGroup === groupName) {
      setSelectedGroup('全部');
    }
  };

  // 加载 model-viewer script
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js';
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-[#E5E7EB] bg-white sticky top-0 z-40">
        <div className="px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-gray-900">压裂工具数字化展示平台</h1>
            <p className="text-gray-500 text-sm mt-1">高性能 3D 模型按需加载 · 专业工具数字孪生</p>
          </div>
          <button
            onClick={() => setIsUploadDialogOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            添加工具
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          groups={groups}
          selectedGroup={selectedGroup}
          onSelectGroup={setSelectedGroup}
          onRenameGroup={handleRenameGroup}
          onDeleteGroup={handleDeleteGroup}
        />

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="mb-6">
            <div className="text-sm text-gray-500">
              共 {filteredTools.length} 个工具
              {selectedGroup !== '全部' && ` · 分组: ${selectedGroup}`}
            </div>
          </div>

          {/* Tool Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} onSelect={() => setSelectedTool(tool)} />
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              该分组暂无工具
            </div>
          )}
        </main>
      </div>

      {/* Upload Dialog */}
      {isUploadDialogOpen && (
        <UploadDialog
          onClose={() => setIsUploadDialogOpen(false)}
          onSubmit={handleAddTool}
          existingGroups={groups.filter(g => g !== '全部')}
        />
      )}

      {/* Model Detail */}
      {selectedTool && (
        <ModelDetail
          tool={selectedTool}
          onClose={() => setSelectedTool(null)}
        />
      )}
    </div>
  );
}