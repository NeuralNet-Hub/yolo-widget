<div align="center">
  <a href="http://neuralnet.solutions" target="_blank">
    <img width="450" src="https://raw.githubusercontent.com/NeuralNet-Hub/assets/main/logo/LOGO_png_orig.png">
  </a>
</div>

# YOLO Widget by [NeuralNet](https://neuralnet.solutions) 🤖

This repository provides a complete interactive YOLO (You Only Look Once) widget that can be easily embedded into any website. The widget includes:

- **Interactive UI** with drag-and-drop image upload
- **Real-time parameter adjustment** for confidence and IoU thresholds
- **Multiple YOLO models** support (YOLO11n, YOLO11s, YOLO11m, YOLO11l)
- **Responsive design** that works on desktop and mobile
- **CDN-ready JavaScript** for easy deployment
- **External API integration** for image processing

The YOLO widget allows users to upload images and perform object detection, segmentation, or classification using state-of-the-art YOLO models directly in their browser.

![YOLO Widget Demo](https://via.placeholder.com/800x400/ff6b35/ffffff?text=YOLO+Widget+Demo)

## Features

- **Drag & Drop Upload**: Easy image uploading with visual feedback
- **Sample Images**: Pre-loaded sample images for quick testing
- **Parameter Controls**: Adjustable confidence and IoU thresholds with real-time sliders
- **Model Selection**: Choose from multiple YOLO model variants
- **Image Size Options**: 320px or 640px processing options
- **Results Display**: Visual results with detection counts and processing metrics
- **Error Handling**: Comprehensive error messages and loading states

## Quick Start

### Using CDN (Recommended)

1. Add the widget HTML to your webpage:

````html
<div id="yolo-widget" style="max-width: 800px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
  <!-- Widget HTML structure -->
  <!-- ... (full HTML structure) ... -->
</div>

<style>
  /* Widget styles */
  /* ... (CSS styles) ... */
</style>

<script src="https://cdn.jsdelivr.net/gh/NeuralNet-Hub/yolo-widget@main/yolo-widget.js" async></script>
````

### Self-Hosted

1. Clone this repository:
````bash
git clone https://github.com/NeuralNet-Hub/yolo-widget.git
cd yolo-widget
````

2. Host the `yolo-widget.js` file on your server and update the script src path accordingly.

## API Integration

The widget is designed to work with the YOLO API endpoint at:
````
https://yolo-demo.neuralnet.solutions/predict
````

### API Request Format

The widget sends POST requests with the following FormData:
- `task`: Detection task (detect/segment/classify)
- `model`: YOLO model variant (yolo11n/yolo11s/yolo11m/yolo11l)
- `image_size`: Processing size (320/640)
- `confidence`: Confidence threshold (0.0-1.0)
- `iou`: IoU threshold (0.0-1.0)
- `image`: Uploaded image file or `image_url` for sample images

### Expected API Response

````json
{
  "success": true,
  "processed_image_url": "https://api.example.com/results/processed_image.jpg",
  "detections_count": 5,
  "processing_time": "245ms",
  "model": "yolo11n",
  "classes": ["person", "car", "bicycle"]
}
````

## Usage Examples

### WordPress Integration

Add the widget to any WordPress page using an HTML widget in Elementor or any other page builder:

````html
<!-- Paste the complete widget HTML + CSS + script tag -->
````

### React/Vue Integration

For modern frameworks, you can adapt the vanilla JavaScript code or create framework-specific components.

### Custom Styling

The widget uses CSS custom properties and can be easily customized to match your brand colors:

````css
#yolo-widget {
  --primary-color: #ff6b35;
  --hover-color: #e55a2b;
  --background-light: #fffaf9;
}
````

## Configuration

### Model Options
- **YOLO11n**: Nano - Fastest, smallest model
- **YOLO11s**: Small - Good balance of speed and accuracy
- **YOLO11m**: Medium - Higher accuracy
- **YOLO11l**: Large - Best accuracy, slower processing

### Task Types
- **Detect**: Object detection with bounding boxes
- **Segment**: Instance segmentation
- **Classify**: Image classification

## File Structure

````
.
├── yolo-widget.js          # Main JavaScript functionality
├── README.md               # This file
└── examples/
    ├── wordpress.html      # WordPress integration example
    ├── react-component.jsx # React component example
    └── vanilla.html        # Vanilla HTML example
````

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## About NeuralNet

[NeuralNet](https://neuralnet.solutions) is an AI software development company specializing in privacy-focused artificial intelligence solutions. Our flagship products include [PrivateGPT](https://neuralnet.solutions/privategpt), a secure and private alternative to traditional AI chatbots that keeps your data completely confidential and runs locally on your infrastructure.

We develop cutting-edge AI tools that prioritize:

- **Data Privacy** - Your information never leaves your environment
- **Enterprise Security** - Military-grade encryption and access controls
- **Easy Deployment** - Ready-to-use solutions with minimal setup
- **Open Source** - Transparent, community-driven development

### Our AI Solutions

🤖 **Computer Vision**: Object detection, image classification, and segmentation  
💬 **Natural Language Processing**: Private chatbots and text analysis  
🔍 **Document Intelligence**: PDF analysis and content extraction  
⚡ **Real-time Processing**: Live video and image analysis

### Connect with Us

🌐 **Company Website**: [neuralnet.solutions](https://neuralnet.solutions)  
📝 **Author's Blog**: [henrynavarro.org](https://henrynavarro.org)  
🔒 **Try PrivateGPT**: [chat.privategpt.es](https://chat.privategpt.es)  
📊 **Computer Vision Demo**: [neuralnet.solutions/computer-vision](https://neuralnet.solutions/computer-vision)

---

*Building the future of private AI, one solution at a time.*
