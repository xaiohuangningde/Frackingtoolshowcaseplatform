import React, { useState, useRef } from 'react';
import { X, RotateCcw, Loader2, Maximize2, Info } from 'lucide-react';
import type { FrackingTool } from '../App';

interface ModelDetailProps {
  tool: FrackingTool;
  onClose: () => void;
}

export function ModelDetail({ tool, onClose }: ModelDetailProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const modelViewerRef = useRef<any>(null);

  // 模型加载完成
  const handleModelLoad = () => {
    setIsLoading(false);
  };

  // 监听 model-viewer 加载事件
  React.useEffect(() => {
    const modelViewer = modelViewerRef.current;
    if (modelViewer) {
      const onLoad = () => setIsLoading(false);
      modelViewer.addEventListener('load', onLoad);
      
      // 如果模型已经加载完成
      if (modelViewer.loaded) {
        setIsLoading(false);
      }

      return () => {
        modelViewer.removeEventListener('load', onLoad);
      };
    }
  }, []);

  // 重置视角
  const handleResetCamera = () => {
    if (modelViewerRef.current) {
      modelViewerRef.current.resetTurntableRotation();
      modelViewerRef.current.cameraOrbit = '0deg 75deg 105%';
    }
  };

  // 全屏
  const handleFullscreen = () => {
    if (modelViewerRef.current) {
      if (modelViewerRef.current.requestFullscreen) {
        modelViewerRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
      {/* 顶部工具栏 */}
      <header className="flex items-center justify-between px-6 py-4 bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
            title="关闭"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="text-white">
            <h2 className="text-lg">{tool.name}</h2>
            <p className="text-sm text-white/60">{tool.group}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              showInfo 
                ? 'bg-white text-gray-900' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            title="切换信息面板"
          >
            <Info className="w-4 h-4" />
            <span className="text-sm">信息</span>
          </button>
          <button
            onClick={handleResetCamera}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
            title="重置视角"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={handleFullscreen}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
            title="全屏"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 主内容区 */}
      <div className="flex-1 flex relative">
        {/* 3D 查看器 */}
        <div className="flex-1 relative">
          <model-viewer
            ref={modelViewerRef}
            src={tool.modelUrl}
            poster={tool.posterUrl}
            camera-controls
            auto-rotate
            auto-rotate-delay="3000"
            rotation-per-second="30deg"
            onLoad={handleModelLoad}
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'transparent'
            }}
          />

          {/* Loading 状态 */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3 text-white">
                <Loader2 className="w-12 h-12 animate-spin" />
                <span>加载 3D 模型中...</span>
              </div>
            </div>
          )}

          {/* 操作提示 */}
          {!isLoading && (
            <div className="absolute bottom-6 left-6 px-4 py-2.5 bg-white/10 backdrop-blur-md rounded-lg text-white text-sm border border-white/20">
              <div className="flex items-center gap-4">
                <span>🖱️ 拖拽旋转</span>
                <span>🔍 滚轮缩放</span>
                <span>🔄 自动旋转</span>
              </div>
            </div>
          )}
        </div>

        {/* 信息侧边栏 */}
        {showInfo && (
          <aside className="w-80 bg-white/5 backdrop-blur-sm border-l border-white/10 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* 基本信息 */}
              <div>
                <h3 className="text-white mb-3">基本信息</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-white/60 mb-1">工具名称</div>
                    <div className="text-sm text-white">{tool.name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/60 mb-1">所属分组</div>
                    <div className="text-sm text-white">
                      <span className="px-2 py-1 bg-white/10 rounded">
                        {tool.group}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 技术参数 */}
              <div>
                <h3 className="text-white mb-3">技术参数</h3>
                <div className="text-sm text-white/80 leading-relaxed whitespace-pre-line">
                  {tool.description}
                </div>
              </div>

              {/* 资源信息 */}
              <div>
                <h3 className="text-white mb-3">资源链接</h3>
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="text-white/60 mb-1">封面图</div>
                    <div className="text-white/40 break-all font-mono">
                      {tool.posterUrl.substring(0, 50)}...
                    </div>
                  </div>
                  <div>
                    <div className="text-white/60 mb-1">3D 模型</div>
                    <div className="text-white/40 break-all font-mono">
                      {tool.modelUrl.substring(0, 50)}...
                    </div>
                  </div>
                </div>
              </div>

              {/* 预览图 */}
              <div>
                <h3 className="text-white mb-3">封面预览</h3>
                <img 
                  src={tool.posterUrl} 
                  alt={tool.name}
                  className="w-full rounded-lg border border-white/20"
                />
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}