// Main Application Logic
class ThumbnailApp {
    constructor() {
        this.renderer = new CanvasRenderer('thumbnail-canvas');
        this.dragResize = new DragResizeHandler(
            document.getElementById('thumbnail-canvas'),
            this.renderer,
            () => this.updateCanvas()
        );
        
        this.currentLayout = 'classic';
        this.currentTitle = '';
        this.currentMonth = 'November';
        this.currentYear = '2025';
        this.currentFontSize = 48;
        
        this.setupEventListeners();
        this.updateCanvas();
    }

    setupEventListeners() {
        // Layout selector
        document.getElementById('layout-select').addEventListener('change', (e) => {
            this.currentLayout = e.target.value;
            // Update default positions when layout changes
            if (this.renderer.headshotImage) {
                this.setDefaultHeadshotPosition();
            }
            if (this.renderer.screenshotImage) {
                this.setDefaultScreenshotPosition();
            }
            this.updateCanvas();
        });

        // Title input
        document.getElementById('title-input').addEventListener('input', (e) => {
            this.currentTitle = e.target.value;
            this.updateCanvas();
        });

        // Font size slider
        const fontSizeSlider = document.getElementById('font-size-slider');
        const fontSizeValue = document.getElementById('font-size-value');
        fontSizeSlider.addEventListener('input', (e) => {
            this.currentFontSize = parseInt(e.target.value);
            fontSizeValue.textContent = this.currentFontSize;
            this.updateCanvas();
        });

        // Month selector
        document.getElementById('month-select').addEventListener('change', (e) => {
            this.currentMonth = e.target.value;
            this.updateCanvas();
        });

        // Year input
        document.getElementById('year-input').addEventListener('input', (e) => {
            this.currentYear = e.target.value;
            this.updateCanvas();
        });

        // Headshot upload
        document.getElementById('headshot-upload').addEventListener('change', (e) => {
            this.handleImageUpload(e.target.files[0], 'headshot');
        });

        // Remove headshot
        document.getElementById('remove-headshot').addEventListener('click', () => {
            this.removeImage('headshot');
        });

        // Screenshot upload
        document.getElementById('screenshot-upload').addEventListener('change', (e) => {
            this.handleImageUpload(e.target.files[0], 'screenshot');
        });

        // Remove screenshot
        document.getElementById('remove-screenshot').addEventListener('click', () => {
            this.removeImage('screenshot');
        });

        // Maintain aspect ratio toggle
        document.getElementById('maintain-aspect').addEventListener('change', (e) => {
            this.dragResize.setMaintainAspectRatio(e.target.checked);
        });

        // Download button
        document.getElementById('download-btn').addEventListener('click', () => {
            this.downloadThumbnail();
        });
    }

    handleImageUpload(file, type) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                if (type === 'headshot') {
                    this.renderer.setHeadshot(img);
                    // Set default position for headshot based on layout
                    this.setDefaultHeadshotPosition();
                    document.getElementById('remove-headshot').style.display = 'block';
                } else if (type === 'screenshot') {
                    this.renderer.setScreenshot(img);
                    // Set default position for screenshot based on layout
                    this.setDefaultScreenshotPosition();
                    document.getElementById('remove-screenshot').style.display = 'block';
                }
                this.updateCanvas();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    setDefaultHeadshotPosition() {
        const canvas = document.getElementById('thumbnail-canvas');
        const pos = this.dragResize.getHeadshotPos();
        
        // Default positions based on layout
        if (this.currentLayout === 'classic') {
            pos.x = canvas.width - 250;
            pos.y = canvas.height - 250;
            pos.width = 200;
            pos.height = 200;
        } else if (this.currentLayout === 'split') {
            pos.x = canvas.width * 0.6 + 50;
            pos.y = 100;
            pos.width = 180;
            pos.height = 180;
        } else if (this.currentLayout === 'centered') {
            pos.x = canvas.width / 2 - 100;
            pos.y = canvas.height - 250;
            pos.width = 200;
            pos.height = 200;
        }
        
        this.dragResize.setHeadshotPos(pos);
    }

    setDefaultScreenshotPosition() {
        const canvas = document.getElementById('thumbnail-canvas');
        const pos = this.dragResize.getScreenshotPos();
        
        // Default positions based on layout
        if (this.currentLayout === 'classic') {
            pos.x = 500;
            pos.y = 200;
            pos.width = 400;
            pos.height = 300;
        } else if (this.currentLayout === 'split') {
            pos.x = canvas.width * 0.6 + 50;
            pos.y = 300;
            pos.width = 400;
            pos.height = 300;
        } else if (this.currentLayout === 'centered') {
            pos.x = canvas.width / 2 - 200;
            pos.y = 450;
            pos.width = 400;
            pos.height = 300;
        }
        
        this.dragResize.setScreenshotPos(pos);
    }

    removeImage(type) {
        if (type === 'headshot') {
            this.renderer.setHeadshot(null);
            document.getElementById('headshot-upload').value = '';
            document.getElementById('remove-headshot').style.display = 'none';
        } else if (type === 'screenshot') {
            this.renderer.setScreenshot(null);
            document.getElementById('screenshot-upload').value = '';
            document.getElementById('remove-screenshot').style.display = 'none';
        }
        this.updateCanvas();
    }

    updateCanvas() {
        const headshotPos = this.dragResize.getHeadshotPos();
        const screenshotPos = this.dragResize.getScreenshotPos();
        
        this.renderer.render({
            layout: this.currentLayout,
            title: this.currentTitle,
            month: this.currentMonth,
            year: this.currentYear,
            fontSize: this.currentFontSize,
            headshotPos: headshotPos,
            screenshotPos: screenshotPos
        });
    }

    downloadThumbnail() {
        const month = this.currentMonth.substring(0, 3).toLowerCase();
        const filename = `elixir-montreal-${month}-${this.currentYear}-thumbnail.png`;
        this.renderer.download(filename);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ThumbnailApp();
});

