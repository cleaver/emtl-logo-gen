// Drag and Resize Handler for Canvas Images
class DragResizeHandler {
    constructor(canvas, renderer, updateCallback) {
        this.canvas = canvas;
        this.renderer = renderer;
        this.updateCallback = updateCallback;
        this.isDragging = false;
        this.isResizing = false;
        this.currentElement = null;
        this.resizeHandle = null;
        this.startX = 0;
        this.startY = 0;
        this.startElementX = 0;
        this.startElementY = 0;
        this.startElementWidth = 0;
        this.startElementHeight = 0;
        this.maintainAspectRatio = true;
        
        this.headshotPos = { x: 1000, y: 500, width: 200, height: 200 };
        this.screenshotPos = { x: 600, y: 300, width: 400, height: 300 };
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('mouseleave', this.handleMouseUp.bind(this));
        
        // Touch events for mobile
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
    }

    getCanvasCoordinates(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        if (e.touches) {
            return {
                x: (e.touches[0].clientX - rect.left) * scaleX,
                y: (e.touches[0].clientY - rect.top) * scaleY
            };
        }
        
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }

    isPointInElement(x, y, element) {
        return x >= element.x && x <= element.x + element.width &&
               y >= element.y && y <= element.y + element.height;
    }

    getResizeHandle(x, y, element) {
        const handleSize = 20;
        const handles = [
            { name: 'nw', x: element.x, y: element.y },
            { name: 'ne', x: element.x + element.width, y: element.y },
            { name: 'sw', x: element.x, y: element.y + element.height },
            { name: 'se', x: element.x + element.width, y: element.y + element.height },
            { name: 'n', x: element.x + element.width / 2, y: element.y },
            { name: 's', x: element.x + element.width / 2, y: element.y + element.height },
            { name: 'e', x: element.x + element.width, y: element.y + element.height / 2 },
            { name: 'w', x: element.x, y: element.y + element.height / 2 }
        ];

        for (const handle of handles) {
            if (Math.abs(x - handle.x) < handleSize && Math.abs(y - handle.y) < handleSize) {
                return handle.name;
            }
        }
        return null;
    }

    handleMouseDown(e) {
        const coords = this.getCanvasCoordinates(e);
        this.startX = coords.x;
        this.startY = coords.y;

        // Check if clicking on resize handle
        if (this.renderer.headshotImage) {
            const handle = this.getResizeHandle(coords.x, coords.y, this.headshotPos);
            if (handle) {
                this.isResizing = true;
                this.currentElement = 'headshot';
                this.resizeHandle = handle;
                this.startElementX = this.headshotPos.x;
                this.startElementY = this.headshotPos.y;
                this.startElementWidth = this.headshotPos.width;
                this.startElementHeight = this.headshotPos.height;
                this.canvas.style.cursor = this.getCursorForHandle(handle);
                return;
            }
        }

        if (this.renderer.screenshotImage) {
            const handle = this.getResizeHandle(coords.x, coords.y, this.screenshotPos);
            if (handle) {
                this.isResizing = true;
                this.currentElement = 'screenshot';
                this.resizeHandle = handle;
                this.startElementX = this.screenshotPos.x;
                this.startElementY = this.screenshotPos.y;
                this.startElementWidth = this.screenshotPos.width;
                this.startElementHeight = this.screenshotPos.height;
                this.canvas.style.cursor = this.getCursorForHandle(handle);
                return;
            }
        }

        // Check if clicking on element to drag
        if (this.renderer.headshotImage && this.isPointInElement(coords.x, coords.y, this.headshotPos)) {
            this.isDragging = true;
            this.currentElement = 'headshot';
            this.startElementX = this.headshotPos.x;
            this.startElementY = this.headshotPos.y;
            this.canvas.style.cursor = 'move';
            return;
        }

        if (this.renderer.screenshotImage && this.isPointInElement(coords.x, coords.y, this.screenshotPos)) {
            this.isDragging = true;
            this.currentElement = 'screenshot';
            this.startElementX = this.screenshotPos.x;
            this.startElementY = this.screenshotPos.y;
            this.canvas.style.cursor = 'move';
            return;
        }
    }

    handleMouseMove(e) {
        const coords = this.getCanvasCoordinates(e);

        if (this.isResizing && this.currentElement) {
            this.handleResize(coords.x, coords.y);
            return;
        }

        if (this.isDragging && this.currentElement) {
            const deltaX = coords.x - this.startX;
            const deltaY = coords.y - this.startY;
            
            if (this.currentElement === 'headshot') {
                this.headshotPos.x = Math.max(0, Math.min(this.canvas.width - this.headshotPos.width, this.startElementX + deltaX));
                this.headshotPos.y = Math.max(0, Math.min(this.canvas.height - this.headshotPos.height, this.startElementY + deltaY));
            } else if (this.currentElement === 'screenshot') {
                this.screenshotPos.x = Math.max(0, Math.min(this.canvas.width - this.screenshotPos.width, this.startElementX + deltaX));
                this.screenshotPos.y = Math.max(0, Math.min(this.canvas.height - this.screenshotPos.height, this.startElementY + deltaY));
            }
            
            this.updateCallback();
            return;
        }

        // Update cursor based on hover
        if (this.renderer.headshotImage) {
            const handle = this.getResizeHandle(coords.x, coords.y, this.headshotPos);
            if (handle) {
                this.canvas.style.cursor = this.getCursorForHandle(handle);
                return;
            }
            if (this.isPointInElement(coords.x, coords.y, this.headshotPos)) {
                this.canvas.style.cursor = 'move';
                return;
            }
        }

        if (this.renderer.screenshotImage) {
            const handle = this.getResizeHandle(coords.x, coords.y, this.screenshotPos);
            if (handle) {
                this.canvas.style.cursor = this.getCursorForHandle(handle);
                return;
            }
            if (this.isPointInElement(coords.x, coords.y, this.screenshotPos)) {
                this.canvas.style.cursor = 'move';
                return;
            }
        }

        this.canvas.style.cursor = 'default';
    }

    handleResize(x, y) {
        const deltaX = x - this.startX;
        const deltaY = y - this.startY;
        let newX = this.startElementX;
        let newY = this.startElementY;
        let newWidth = this.startElementWidth;
        let newHeight = this.startElementHeight;

        const element = this.currentElement === 'headshot' ? this.headshotPos : this.screenshotPos;

        // Handle different resize handles
        if (this.resizeHandle.includes('w')) {
            newX = Math.max(0, this.startElementX + deltaX);
            newWidth = this.startElementWidth - deltaX;
        }
        if (this.resizeHandle.includes('e')) {
            newWidth = Math.max(50, this.startElementWidth + deltaX);
        }
        if (this.resizeHandle.includes('n')) {
            newY = Math.max(0, this.startElementY + deltaY);
            newHeight = this.startElementHeight - deltaY;
        }
        if (this.resizeHandle.includes('s')) {
            newHeight = Math.max(50, this.startElementHeight + deltaY);
        }

        // Maintain aspect ratio if enabled
        if (this.maintainAspectRatio) {
            const aspectRatio = this.startElementWidth / this.startElementHeight;
            if (this.resizeHandle.includes('w') || this.resizeHandle.includes('e')) {
                newHeight = newWidth / aspectRatio;
                if (this.resizeHandle.includes('n')) {
                    newY = this.startElementY + this.startElementHeight - newHeight;
                }
            } else if (this.resizeHandle.includes('n') || this.resizeHandle.includes('s')) {
                newWidth = newHeight * aspectRatio;
                if (this.resizeHandle.includes('w')) {
                    newX = this.startElementX + this.startElementWidth - newWidth;
                }
            }
        }

        // Constrain to canvas bounds
        if (newX < 0) {
            newWidth += newX;
            newX = 0;
        }
        if (newY < 0) {
            newHeight += newY;
            newY = 0;
        }
        if (newX + newWidth > this.canvas.width) {
            newWidth = this.canvas.width - newX;
        }
        if (newY + newHeight > this.canvas.height) {
            newHeight = this.canvas.height - newY;
        }

        // Update position
        element.x = newX;
        element.y = newY;
        element.width = Math.max(50, newWidth);
        element.height = Math.max(50, newHeight);

        this.updateCallback();
    }

    handleMouseUp(e) {
        this.isDragging = false;
        this.isResizing = false;
        this.currentElement = null;
        this.resizeHandle = null;
        this.canvas.style.cursor = 'default';
    }

    handleTouchStart(e) {
        e.preventDefault();
        this.handleMouseDown(e);
    }

    handleTouchMove(e) {
        e.preventDefault();
        this.handleMouseMove(e);
    }

    handleTouchEnd(e) {
        e.preventDefault();
        this.handleMouseUp(e);
    }

    getCursorForHandle(handle) {
        const cursors = {
            'nw': 'nw-resize',
            'ne': 'ne-resize',
            'sw': 'sw-resize',
            'se': 'se-resize',
            'n': 'n-resize',
            's': 's-resize',
            'e': 'e-resize',
            'w': 'w-resize'
        };
        return cursors[handle] || 'default';
    }

    setMaintainAspectRatio(value) {
        this.maintainAspectRatio = value;
    }

    getHeadshotPos() {
        return this.headshotPos;
    }

    getScreenshotPos() {
        return this.screenshotPos;
    }

    setHeadshotPos(pos) {
        this.headshotPos = pos;
    }

    setScreenshotPos(pos) {
        this.screenshotPos = pos;
    }
}


