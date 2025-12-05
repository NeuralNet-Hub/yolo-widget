(function() {
    'use strict';
    
    // YOLO Widget functionality
    class YOLOWidget {
        constructor(container) {
            this.container = container;
            this.selectedImageSize = 640;
            this.currentImageData = null;
            this.init();
        }
        
        init() {
            this.bindEvents();
        }
        
        bindEvents() {
            const form = this.container.querySelector('#yolo-form');
            const uploadArea = this.container.querySelector('#upload-area');
            const fileInput = this.container.querySelector('#image-upload');
            const uploadContent = this.container.querySelector('#upload-content');
            const imagePreview = this.container.querySelector('#image-preview');
            const previewImg = this.container.querySelector('#preview-img');
            const processBtn = this.container.querySelector('#process-btn');
            const confidenceSlider = this.container.querySelector('input[name="confidence"]');
            const iouSlider = this.container.querySelector('input[name="iou"]');
            const confidenceValue = this.container.querySelector('#confidence-value');
            const iouValue = this.container.querySelector('#iou-value');
            const sizeButtons = this.container.querySelectorAll('.size-btn');
            const sampleImages = this.container.querySelectorAll('.sample-img');
            
            // Slider updates
            confidenceSlider.addEventListener('input', () => {
                confidenceValue.textContent = confidenceSlider.value;
            });
            
            iouSlider.addEventListener('input', () => {
                iouValue.textContent = iouSlider.value;
            });
            
            // Size button selection
            sizeButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    sizeButtons.forEach(b => {
                        b.style.background = '#f5f5f5';
                        b.style.color = '#333';
                        b.style.borderColor = '#ddd';
                        b.classList.remove('active-size');
                    });
                    btn.style.background = '#0066ff';
                    btn.style.color = 'white';
                    btn.style.borderColor = '#0066ff';
                    btn.classList.add('active-size');
                    this.selectedImageSize = parseInt(btn.dataset.size);
                });
            });
            
            // Upload area interactions
            uploadArea.addEventListener('click', () => fileInput.click());
            uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
            uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
            uploadArea.addEventListener('drop', this.handleDrop.bind(this));
            
            // File input change
            fileInput.addEventListener('change', () => {
                if (fileInput.files.length > 0) {
                    this.handleImageUpload(fileInput.files[0]);
                }
            });
            
            // Sample images
            sampleImages.forEach(img => {
                img.addEventListener('click', () => {
                    const imageUrl = img.dataset.url;
                    previewImg.src = imageUrl;
                    this.currentImageData = imageUrl;
                    this.showImagePreview();
                });
            });
            
            // Form submission
            form.addEventListener('submit', this.handleSubmit.bind(this));
        }
        
        handleDragOver(e) {
            e.preventDefault();
            const uploadArea = e.currentTarget;
            uploadArea.style.borderColor = '#0066ff';
            uploadArea.style.background = '#f0f8ff';
        }
        
        handleDragLeave(e) {
            e.preventDefault();
            const uploadArea = e.currentTarget;
            uploadArea.style.borderColor = '#ddd';
            uploadArea.style.background = '#f9f9f9';
        }
        
        handleDrop(e) {
            e.preventDefault();
            const uploadArea = e.currentTarget;
            uploadArea.style.borderColor = '#ddd';
            uploadArea.style.background = '#f9f9f9';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleImageUpload(files[0]);
            }
        }
        
        handleImageUpload(file) {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const previewImg = this.container.querySelector('#preview-img');
                    previewImg.src = e.target.result;
                    this.currentImageData = file;
                    this.showImagePreview();
                };
                reader.readAsDataURL(file);
            }
        }
        
        showImagePreview() {
            const uploadContent = this.container.querySelector('#upload-content');
            const imagePreview = this.container.querySelector('#image-preview');
            const processBtn = this.container.querySelector('#process-btn');
            
            uploadContent.style.display = 'none';
            imagePreview.style.display = 'block';
            processBtn.disabled = false;
            processBtn.textContent = 'Process Image';
            processBtn.style.background = '#0066ff';
        }
        
        handleSubmit(e) {
            e.preventDefault();
            
            if (!this.currentImageData) {
                alert('Please upload an image first!');
                return;
            }
            
            const results = this.container.querySelector('#results');
            const loading = this.container.querySelector('#loading');
            const processBtn = this.container.querySelector('#process-btn');
            
            // Show loading
            results.style.display = 'none';
            loading.style.display = 'block';
            processBtn.disabled = true;
            processBtn.textContent = 'Processing...';
            
            // Prepare form data
            const formData = new FormData();
            formData.append('action', 'process_yolo_image');
            formData.append('task', this.container.querySelector('select[name="task"]').value);
            formData.append('model', this.container.querySelector('select[name="model"]').value);
            formData.append('image_size', this.selectedImageSize);
            formData.append('confidence', this.container.querySelector('input[name="confidence"]').value);
            formData.append('iou', this.container.querySelector('input[name="iou"]').value);
            
            if (typeof this.currentImageData === 'string') {
                formData.append('image_url', this.currentImageData);
            } else {
                formData.append('image', this.currentImageData);
            }
            
            // Send to backend
            fetch('/wp-admin/admin-ajax.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                loading.style.display = 'none';
                processBtn.disabled = false;
                processBtn.textContent = 'Process Image';
                
                if (data.success) {
                    this.showResults(data.data);
                } else {
                    this.showError(data.data || 'Processing failed');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                loading.style.display = 'none';
                processBtn.disabled = false;
                processBtn.textContent = 'Process Image';
                this.showError('Network error. Please try again.');
            });
        }
        
        showResults(data) {
            const resultsContent = this.container.querySelector('#results-content');
            resultsContent.innerHTML = `
                <div style="display: flex; gap: 20px; align-items: center; flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 300px;">
                        <img src="${data.processed_image_url}" alt="Processed Image" style="width: 100%; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    </div>
                    <div style="flex: 1; min-width: 200px;">
                        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                            <h4 style="margin: 0 0 15px 0; color: #333;">Detection Summary</h4>
                            <p style="margin: 5px 0;"><strong>Objects detected:</strong> ${data.detections_count || 0}</p>
                            <p style="margin: 5px 0;"><strong>Processing time:</strong> ${data.processing_time || 'N/A'}</p>
                            <p style="margin: 5px 0;"><strong>Model used:</strong> ${data.model || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            `;
            this.container.querySelector('#results').style.display = 'block';
        }
        
        showError(message) {
            const resultsContent = this.container.querySelector('#results-content');
            resultsContent.innerHTML = `
                <div style="background: #fee; border: 1px solid #fcc; color: #c33; padding: 15px; border-radius: 8px;">
                    <strong>Error:</strong> ${message}
                </div>
            `;
            this.container.querySelector('#results').style.display = 'block';
        }
    }
    
    // Initialize YOLO widgets when DOM is ready
    function initYOLOWidgets() {
        const widgets = document.querySelectorAll('[data-yolo-widget]');
        widgets.forEach(widget => {
            if (!widget.yoloWidget) {
                widget.yoloWidget = new YOLOWidget(widget);
            }
        });
    }
    
    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initYOLOWidgets);
    } else {
        initYOLOWidgets();
    }
    
    // Export for manual initialization
    window.YOLOWidget = YOLOWidget;
    window.initYOLOWidgets = initYOLOWidgets;
})();
