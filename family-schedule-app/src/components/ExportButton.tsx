import React from 'react';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';

interface ExportButtonProps {
  targetElementId: string;
  filename?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  targetElementId,
  filename = 'family-schedule.jpg',
}) => {
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      const element = document.getElementById(targetElementId);
      if (!element) {
        alert('エクスポート対象が見つかりません');
        return;
      }

      // エクスポート用のコンパクトスタイルを一時的に適用
      element.classList.add('export-mode');
      
      // 少し待ってからキャプチャ（DOM更新のため）
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2.0, // 高解像度で全画面表示
        useCORS: true,
        allowTaint: true,
        width: element.scrollWidth,
        height: element.scrollHeight,
        scrollX: 0,
        scrollY: 0,
      });

      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Export failed:', error);
      alert('エクスポートに失敗しました');
    } finally {
      // エクスポート用スタイルを削除
      const element = document.getElementById(targetElementId);
      if (element) {
        element.classList.remove('export-mode');
      }
      setIsExporting(false);
    }
  };

  return (
    <button 
      className="action-button export-button"
      onClick={handleExport}
      disabled={isExporting}
    >
      <Download size={20} />
      {isExporting ? 'エクスポート中...' : 'JPEG画像でダウンロード'}
    </button>
  );
};