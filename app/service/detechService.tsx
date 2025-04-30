export default async function detectImage(uri: any) {
    const formData = new FormData();
  
    const uriParts = uri.split('.');
    const fileType = uriParts[uriParts.length - 1];
    const fileName = `photo.${fileType}`;
  
    const response = await fetch(uri);
    const blob = await response.blob();
  
    formData.append('file', blob, fileName);
  
    try {
      const res = await fetch('https://your-ai-server.com/detect', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const result = await res.json();
      console.log('Kết quả detect:', result);
      alert(JSON.stringify(result));
    } catch (err) {
      console.error('Detect lỗi', err);
      alert('Detect lỗi');
    }
  }