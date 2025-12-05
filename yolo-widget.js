document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('yolo-form');
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('image-upload');
    const uploadContent = document.getElementById('upload-content');
    const imagePreview = document.getElementById('image-preview');
    const previewImg = document.getElementById('preview-img');
    const processBtn = document.getElementById('process-btn');
    const confidenceSlider = document.querySelector('input[name="confidence"]');
    const iouSlider = document.querySelector('input[name="iou"]');
    const confidenceValue = document.getElementById('confidence-value');
    const iouValue = document.getElementById('iou-value');
    const sizeButtons = document.querySelectorAll('.size-btn');
    const sampleImages = document.querySelectorAll('.sample-img');
    const results = document.getElementById('results');
    const loading = document.getElementById('loading');
    let selectedImageSize = 640;
    let currentImageData = null;

    // Handle slider updates
    confidenceSlider.addEventListener('input', function() {
        confidenceValue.textContent = this.value;
    });

    iouSlider.addEventListener('input', function() {
        iouValue.textContent = this.value;
    });

    // Handle size button selection
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            sizeButtons.forEach(b => {
                b.style.background = '#f5f5f5';
                b.style.color = '#333';
                b.style.borderColor = '#ddd';
                b.classList.remove('active-size');
            });
            this.style.background = '#ff6b35';
            this.style.color = 'white';
            this.style.borderColor = '#ff6b35';
            this.classList.add('active-size');
            selectedImageSize = parseInt(this.dataset.size);
        });
    });

    // Handle upload area click
    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });

    // Handle drag and drop
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.borderColor = '#ff6b35';
        this.style.background = '#fffaf9';
    });

    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.style.borderColor = '#ddd';
        this.style.background = '#f9f9f9';
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.borderColor = '#ddd';
        this.style.background = '#f9f9f9';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleImageUpload(files[0]);
        }
    });

    // Handle file input change
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            handleImageUpload(this.files[0]);
        }
    });

    // Handle sample image clicks
    sampleImages.forEach(img => {
        img.addEventListener('click', function() {
            const imageUrl = this.dataset.url;
            previewImg.src = imageUrl;
            currentImageData = imageUrl;
            showImagePreview();
        });
    });

    function handleImageUpload(file) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImg.src = e.target.result;
                currentImageData = file;
                showImagePreview();
            };
            reader.readAsDataURL(file);
        }
    }

    function showImagePreview() {
        uploadContent.style.display = 'none';
        imagePreview.style.display = 'block';
        processBtn.disabled = false;
        processBtn.textContent = 'Process Image';
        processBtn.style.background = '#ff6b35';
    }

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!currentImageData) {
            alert('Please upload an image first!');
            return;
        }

        // Show loading
        results.style.display = 'none';
        loading.style.display = 'block';
        processBtn.disabled = true;
        processBtn.textContent = 'Processing...';

        // Prepare form data
        const formData = new FormData();
        formData.append('task', document.querySelector('select[name="task"]').value);
        formData.append('model', document.querySelector('select[name="model"]').value);
        formData.append('image_size', selectedImageSize);
        formData.append('confidence', confidenceSlider.value);
        formData.append('iou', iouSlider.value);
        
        if (typeof currentImageData === 'string') {
            formData.append('image_url', currentImageData);
        } else {
            formData.append('image', currentImageData);
        }

        // Send to external API
        fetch('https://yolo-demo.neuralnet.solutions/predict', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            loading.style.display = 'none';
            processBtn.disabled = false;
            processBtn.textContent = 'Process Image';
            
            if (data.success || data.status === 'success') {
                showResults(data);
            } else {
                showError(data.message || data.error || 'Processing failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            loading.style.display = 'none';
            processBtn.disabled = false;
            processBtn.textContent = 'Process Image';
            showError(`Network error: ${error.message}`);
        });
    });

    function showResults(data) {
        const resultsContent = document.getElementById('results-content');
        
        // Handle different possible response formats
        const imageUrl = data.processed_image_url || data.result_image || data.image_url || data.output_image;
        const detectionsCount = data.detections_count || data.detections || data.objects_detected || 'Unknown';
        const processingTime = data.processing_time || data.inference_time || data.time || 'N/A';
        const modelUsed = data.model || data.model_name || 'N/A';
        
        resultsContent.innerHTML = `
            <div style="display: flex; gap: 20px; align-items: center; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 300px;">
                    ${imageUrl ? 
                        `<img src="${imageUrl}" alt="Processed Image" style="width: 100%; border-radius: 8px; box-shadow: 0 4px 12px rgba(255, 107, 53, 0.2);">` :
                        `<div style="width: 100%; height: 300px; background: #f5f5f5; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #666;">No processed image available</div>`
                    }
                </div>
                <div style="flex: 1; min-width: 200px;">
                    <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(255, 107, 53, 0.1); border: 1px solid #ffe8e0;">
                        <h4 style="margin: 0 0 15px 0; color: #333;">Detection Summary</h4>
                        <p style="margin: 5px 0;"><strong style="color: #ff6b35;">Objects detected:</strong> ${detectionsCount}</p>
                        <p style="margin: 5px 0;"><strong style="color: #ff6b35;">Processing time:</strong> ${processingTime}</p>
                        <p style="margin: 5px 0;"><strong style="color: #ff6b35;">Model used:</strong> ${modelUsed}</p>
                        ${data.confidence ? `<p style="margin: 5px 0;"><strong style="color: #ff6b35;">Confidence:</strong> ${data.confidence}</p>` : ''}
                        ${data.classes ? `<p style="margin: 5px 0;"><strong style="color: #ff6b35;">Classes found:</strong> ${data.classes.join(', ')}</p>` : ''}
                    </div>
                </div>
            </div>
        `;
        results.style.display = 'block';
    }

    function showError(message) {
        const resultsContent = document.getElementById('results-content');
        resultsContent.innerHTML = `
            <div style="background: #fff5f5; border: 1px solid #fecaca; color: #dc2626; padding: 15px; border-radius: 8px;">
                <strong>Error:</strong> ${message}
                <br><small>Please check if the API server is running and accessible.</small>
            </div>
        `;
        results.style.display = 'block';
    }
});
