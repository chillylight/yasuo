// 获取DOM元素
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const previewSection = document.getElementById('previewSection');
const originalPreview = document.getElementById('originalPreview');
const compressedPreview = document.getElementById('compressedPreview');
const originalSize = document.getElementById('originalSize');
const compressedSize = document.getElementById('compressedSize');
const qualitySlider = document.getElementById('quality');
const qualityValue = document.getElementById('qualityValue');
const downloadBtn = document.getElementById('downloadBtn');

let originalFile = null;

// 点击上传区域触发文件选择
dropZone.addEventListener('click', () => {
    fileInput.click();
});

// 拖拽事件处理
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#0071e3';
    dropZone.style.backgroundColor = '#f5f5f7';
});

dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#86868b';
    dropZone.style.backgroundColor = 'white';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#86868b';
    dropZone.style.backgroundColor = 'white';
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleFile(file);
    }
});

// 文件选择处理
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
});

// 处理上传的文件
function handleFile(file) {
    if (!file.type.match('image.*')) {
        alert('请上传图片文件！');
        return;
    }

    originalFile = file;
    
    // 显示原始图片预览
    const reader = new FileReader();
    reader.onload = (e) => {
        originalPreview.src = e.target.result;
        originalSize.textContent = formatFileSize(file.size);
        previewSection.style.display = 'block';
        compressImage(e.target.result);
    };
    reader.readAsDataURL(file);
}

// 压缩图片
function compressImage(dataUrl) {
    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // 保持原始宽高比
        canvas.width = img.width;
        canvas.height = img.height;

        // 绘制图片
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // 压缩图片
        const quality = qualitySlider.value / 100;
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        
        // 显示压缩后的图片
        compressedPreview.src = compressedDataUrl;
        
        // 计算压缩后的文件大小
        const compressedSize = Math.round((compressedDataUrl.length - 'data:image/jpeg;base64,'.length) * 3/4);
        document.getElementById('compressedSize').textContent = formatFileSize(compressedSize);
    };
    img.src = dataUrl;
}

// 质量滑块变化事件
qualitySlider.addEventListener('input', (e) => {
    qualityValue.textContent = e.target.value + '%';
    if (originalFile) {
        const reader = new FileReader();
        reader.onload = (e) => compressImage(e.target.result);
        reader.readAsDataURL(originalFile);
    }
});

// 下载按钮点击事件
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `compressed_${originalFile.name}`;
    link.href = compressedPreview.src;
    link.click();
});

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
} 