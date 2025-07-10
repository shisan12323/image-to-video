function triggerDownload(href: string, filename: string) {
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * 下载图片的简化版本，优先使用代理来避免跨域问题
 */
export default async function downloadPhoto(url: string, filename: string) {
  try {
    // 使用代理下载来避免跨域问题
    const proxyResponse = await fetch('/api/download-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl: url }),
    });

    if (proxyResponse.ok) {
      const blob = await proxyResponse.blob();
      const blobUrl = URL.createObjectURL(blob);
      triggerDownload(blobUrl, filename);
      URL.revokeObjectURL(blobUrl);
      return;
    }
  } catch (proxyError) {
    console.warn("Proxy download failed, trying direct download", proxyError);
  }

  try {
    // 回退到直接 fetch
    const response = await fetch(url, { mode: "cors" });
    if (!response.ok) throw new Error("Network response was not ok");

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    triggerDownload(blobUrl, filename);
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.warn("All download methods failed, using direct link", error);
    // 最后回退到直接链接
    triggerDownload(url, filename);
  }
}