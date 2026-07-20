import html2canvas from 'html2canvas';

async function captureToBlob(node: HTMLElement, scale: number): Promise<Blob> {
  const canvas = await html2canvas(node, {
    backgroundColor: '#ffffff',
    scale,
    useCORS: true,
    logging: false,
  });
  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('toBlob returned null'))),
      'image/jpeg',
      0.92,
    );
  });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export type ExportResult = 'shared' | 'downloaded';

// エクスポート専用のオフスクリーンDOM（sticky/overflowなし）を html2canvas でキャプチャし、
// スマホは共有シート（Web Share）、無ければJPEGダウンロードにフォールバック。
export async function exportOrShare(
  node: HTMLElement,
  filename: string,
  title: string,
): Promise<ExportResult> {
  const rect = node.getBoundingClientRect();
  // iOS Safari の canvas 上限(~16Mpx)を避けて scale を調整
  let scale = 2;
  const area = Math.max(1, rect.width * rect.height);
  while (area * scale * scale > 14_000_000 && scale > 1) scale -= 0.5;

  const blob = await captureToBlob(node, scale);
  const file = new File([blob], filename, { type: 'image/jpeg' });
  const nav = navigator as Navigator & {
    canShare?: (d: ShareData) => boolean;
    share?: (d: ShareData) => Promise<void>;
  };

  // スマホ（coarse pointer）だけ共有シート、PC（マウス）は素直に保存する
  const isTouch =
    typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches;

  if (isTouch && nav.canShare && nav.share && nav.canShare({ files: [file] })) {
    try {
      await nav.share({ files: [file], title });
      return 'shared';
    } catch (e) {
      const name = (e as { name?: string })?.name;
      if (name === 'AbortError') return 'shared'; // ユーザーが共有をキャンセル
      // それ以外はダウンロードへフォールバック
    }
  }
  downloadBlob(blob, filename);
  return 'downloaded';
}
