// Canvas Renderer for YouTube Thumbnail Generator
class CanvasRenderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = 1280;
        this.height = 720;
        this.logoImage = null;
        this.headshotImage = null;
        this.screenshotImage = null;
        this.onLogoLoaded = null; // Callback for when logo loads
        this.loadLogo();
    }

    setOnLogoLoaded(callback) {
        this.onLogoLoaded = callback;
    }

    async loadLogo() {
        this.logoImage = new Image();

        this.logoImage.onload = () => {
            // Notify app that logo is loaded so it can re-render
            if (this.onLogoLoaded) {
                this.onLogoLoaded();
            }
        };

        this.logoImage.onerror = (error) => {
            console.error('Error loading logo image:', error);
            // Try alternative loading method
            this.loadLogoAlternative();
        };

        // Try loading directly first
        this.logoImage.src = 'elixir-logo.svg';
    }

    async loadLogoAlternative() {
        try {
            const response = await fetch('elixir-logo.svg');
            if (!response.ok) {
                throw new Error(`Failed to load logo: ${response.status}`);
            }
            const svgText = await response.text();
            // Create data URL instead of blob
            const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
            const reader = new FileReader();
            reader.onload = (e) => {
                this.logoImage = new Image();
                this.logoImage.onload = () => {
                    if (this.onLogoLoaded) {
                        this.onLogoLoaded();
                    }
                };
                this.logoImage.onerror = (error) => {
                    console.error('Error loading logo via alternative method:', error);
                };
                this.logoImage.src = e.target.result;
            };
            reader.readAsDataURL(svgBlob);
        } catch (error) {
            console.error('Error loading logo:', error);
        }
    }

    setHeadshot(image) {
        this.headshotImage = image;
    }

    setScreenshot(image) {
        this.screenshotImage = image;
    }

    drawCircularHeadshot(headshotPos) {
        if (!this.headshotImage) return;

        const headshotSize = Math.min(headshotPos.width, headshotPos.height);
        const centerX = headshotPos.x + headshotSize / 2;
        const centerY = headshotPos.y + headshotSize / 2;
        const radius = headshotSize / 2;

        // Calculate aspect ratio of the image
        const imageAspect = this.headshotImage.width / this.headshotImage.height;
        const circleAspect = 1; // Circle is always 1:1

        let drawWidth, drawHeight, drawX, drawY;

        // Scale to cover the circle while maintaining aspect ratio
        if (imageAspect > circleAspect) {
            // Image is wider - fit to height, center horizontally
            drawHeight = headshotSize;
            drawWidth = drawHeight * imageAspect;
            drawX = centerX - drawWidth / 2;
            drawY = headshotPos.y;
        } else {
            // Image is taller - fit to width, center vertically
            drawWidth = headshotSize;
            drawHeight = drawWidth / imageAspect;
            drawX = headshotPos.x;
            drawY = centerY - drawHeight / 2;
        }

        // Create circular clipping path
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.clip();

        // Draw the image centered and scaled
        this.ctx.drawImage(
            this.headshotImage,
            drawX,
            drawY,
            drawWidth,
            drawHeight
        );

        this.ctx.restore();

        // Draw border
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 8;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    drawScreenshot(screenshotPos) {
        if (!this.screenshotImage) return;

        // Draw the screenshot image
        this.ctx.drawImage(
            this.screenshotImage,
            screenshotPos.x,
            screenshotPos.y,
            screenshotPos.width,
            screenshotPos.height
        );

        // Draw border
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 6;
        this.ctx.strokeRect(
            screenshotPos.x,
            screenshotPos.y,
            screenshotPos.width,
            screenshotPos.height
        );
    }

    render(data = {}) {
        const {
            layout = 'classic',
            title = '',
            month = 'November',
            year = '2025',
            fontSize = 48,
            headshotPos = { x: 1000, y: 500, width: 200, height: 200 },
            screenshotPos = { x: 600, y: 300, width: 400, height: 300 }
        } = data;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Render based on layout
        switch (layout) {
            case 'classic':
                this.renderClassicLayout(title, month, year, fontSize, headshotPos, screenshotPos);
                break;
            case 'split':
                this.renderSplitLayout(title, month, year, fontSize, headshotPos, screenshotPos);
                break;
            case 'centered':
                this.renderCenteredLayout(title, month, year, fontSize, headshotPos, screenshotPos);
                break;
        }
    }

    renderClassicLayout(title, month, year, fontSize, headshotPos, screenshotPos) {
        // Gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, this.width, this.height);
        gradient.addColorStop(0, '#26053d');
        gradient.addColorStop(0.5, '#8d67af');
        gradient.addColorStop(1, '#b7b4b4');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Logo and "ELIXIR MONTRÉAL" text (logo to the left of text)
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 32px sans-serif';
        const textY = 80; // Vertical center for logo + text
        const logoSize = 60; // Increased size for better visibility
        const logoX = 40;
        const logoY = textY - logoSize / 2 + 16; // Center logo vertically with text baseline

        if (this.logoImage) {
            if (this.logoImage.complete && this.logoImage.naturalWidth > 0) {
                this.ctx.drawImage(this.logoImage, logoX, logoY, logoSize, logoSize);
            }
        }

        const textX = logoX + logoSize + 15; // Text starts after logo with spacing
        this.ctx.fillText('ELIXIR MONTRÉAL', textX, textY);

        // Month/Year
        this.ctx.font = '24px sans-serif';
        this.ctx.fillText(`${month} ${year}`, textX, textY + 35);

        // Title (centered-left, large)
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = `bold ${fontSize}px sans-serif`;
        this.ctx.textBaseline = 'top';

        // Word wrap for long titles
        const maxWidth = this.width - 200;
        const words = title.split(' ');
        let line = '';
        let y = 250;

        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const metrics = this.ctx.measureText(testLine);
            if (metrics.width > maxWidth && i > 0) {
                this.ctx.fillText(line, 100, y);
                line = words[i] + ' ';
                y += fontSize + 10;
            } else {
                line = testLine;
            }
        }
        this.ctx.fillText(line, 100, y);

        // Progress bar accent at bottom
        this.ctx.fillStyle = '#ff69b4';
        this.ctx.fillRect(0, this.height - 4, this.width, 4);

        // Optional screenshot
        this.drawScreenshot(screenshotPos);

        // Optional headshot (circular) in bottom-right
        this.drawCircularHeadshot(headshotPos);
    }

    renderSplitLayout(title, month, year, fontSize, headshotPos, screenshotPos) {
        // Background
        const gradient = this.ctx.createLinearGradient(0, 0, this.width, 0);
        gradient.addColorStop(0, '#330A4C');
        gradient.addColorStop(0.6, '#8d67af');
        gradient.addColorStop(1, '#9f8daf');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Left side content (60%)
        const leftWidth = this.width * 0.6;

        // Logo and "ELIXIR MONTRÉAL" text (logo to the left of text)
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 28px sans-serif';
        const headerY = 60;
        const logoSize = 45;
        const logoX = 50;
        const logoY = headerY - logoSize / 2 + 14; // Center logo vertically with text baseline

        if (this.logoImage && this.logoImage.complete && this.logoImage.naturalWidth > 0) {
            this.ctx.drawImage(this.logoImage, logoX, logoY, logoSize, logoSize);
        }

        const textX = logoX + logoSize + 12;
        this.ctx.fillText('ELIXIR MONTRÉAL', textX, headerY);

        // Title on left side, vertically centered
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = `bold ${fontSize}px sans-serif`;
        this.ctx.textBaseline = 'top';

        const titleY = this.height / 2 - 100;
        const maxWidth = leftWidth - 100;
        const words = title.split(' ');
        let line = '';
        let y = titleY;

        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const metrics = this.ctx.measureText(testLine);
            if (metrics.width > maxWidth && i > 0) {
                this.ctx.fillText(line, 50, y);
                line = words[i] + ' ';
                y += fontSize + 10;
            } else {
                line = testLine;
            }
        }
        this.ctx.fillText(line, 50, y);

        // Month/Year below title
        this.ctx.font = '28px sans-serif';
        this.ctx.fillText(`${month} ${year}`, 50, y + fontSize + 20);

        // Right side for images (40%)
        const rightStart = leftWidth;

        // Optional headshot and screenshot on right
        this.drawCircularHeadshot(headshotPos);

        this.drawScreenshot(screenshotPos);
    }

    renderCenteredLayout(title, month, year, fontSize, headshotPos, screenshotPos) {
        // Full gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, this.width, this.height);
        gradient.addColorStop(0, '#26053d');
        gradient.addColorStop(0.5, '#715383');
        gradient.addColorStop(1, '#8d67af');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Logo and "ELIXIR MONTRÉAL" text centered (logo to the left of text)
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 36px sans-serif';
        const logoSize = 60;
        const headerY = 80;

        // Calculate total width of logo + spacing + text to center the group
        const textWidth = this.ctx.measureText('ELIXIR MONTRÉAL').width;
        const spacing = 15;
        const totalWidth = logoSize + spacing + textWidth;
        const groupStartX = (this.width - totalWidth) / 2;

        const logoX = groupStartX;
        const logoY = headerY - logoSize / 2 + 18; // Center logo vertically with text baseline

        if (this.logoImage && this.logoImage.complete && this.logoImage.naturalWidth > 0) {
            this.ctx.drawImage(this.logoImage, logoX, logoY, logoSize, logoSize);
        }

        const textX = logoX + logoSize + spacing;
        this.ctx.textAlign = 'left';
        this.ctx.fillText('ELIXIR MONTRÉAL', textX, headerY);

        this.ctx.font = '24px sans-serif';
        this.ctx.fillText(`${month} ${year}`, textX, headerY + 40);

        // Large centered title
        this.ctx.font = `bold ${fontSize}px sans-serif`;
        this.ctx.textAlign = 'center';

        const titleY = 280;
        const maxWidth = this.width - 200;
        const words = title.split(' ');
        let lines = [];
        let line = '';

        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const metrics = this.ctx.measureText(testLine);
            if (metrics.width > maxWidth && i > 0) {
                lines.push(line);
                line = words[i] + ' ';
            } else {
                line = testLine;
            }
        }
        if (line) lines.push(line);

        // Draw centered lines
        lines.forEach((line, index) => {
            this.ctx.fillText(line.trim(), this.width / 2, titleY + index * (fontSize + 15));
        });

        // Optional headshot and screenshot below title
        this.drawCircularHeadshot(headshotPos);

        this.drawScreenshot(screenshotPos);

        // Reset text align
        this.ctx.textAlign = 'left';
    }

    download(filename = 'elixir-thumbnail.png') {
        const link = document.createElement('a');
        link.download = filename;
        link.href = this.canvas.toDataURL('image/png');
        link.click();
    }
}

