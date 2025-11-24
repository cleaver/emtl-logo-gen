# Elixir Montréal YouTube Thumbnail Generator

A customizable web application for generating YouTube thumbnails for Elixir Montréal meetup videos.

## Features

- **Three Layout Templates**: Choose from Classic Gradient, Modern Split-Screen, or Centered Hero layouts
- **Customizable Text**: Add your presentation title with adjustable font size (24-120px)
- **Date Selection**: Choose month and year for the meetup
- **Image Support**: Upload optional headshot (circular) and screenshot images
- **Drag & Resize**: Click and drag images to reposition, use corner/edge handles to resize
- **Aspect Ratio Control**: Toggle to maintain or allow free aspect ratio changes
- **Export**: Download your thumbnail as a PNG file (1280×720px, YouTube's recommended size)

## Usage

1. Open `index.html` in a web browser
2. Select your preferred layout from the dropdown
3. Enter your presentation title
4. Adjust the font size using the slider
5. Select the month and enter the year
6. (Optional) Upload a headshot image - it will appear as a circular image
7. (Optional) Upload a screenshot image
8. Click and drag images to reposition them
9. Click and drag corner/edge handles to resize images
10. Click "Download Thumbnail" to save your image

## Technical Details

- Pure vanilla JavaScript (no dependencies)
- Canvas API for rendering
- Responsive design that works on desktop and mobile
- Uses official Elixir brand colors and logo

## File Structure

```
emtl-logo-gen/
├── elixir-logo.svg    # Official Elixir logo
├── index.html         # Main HTML structure
├── style.css          # Styling and Elixir color scheme
├── app.js             # Main application logic
├── canvas-renderer.js # Canvas rendering and layout templates
└── drag-resize.js     # Drag and resize functionality
```

## Browser Compatibility

Works in all modern browsers that support:
- Canvas API
- FileReader API
- ES6 classes

## Notes

- The canvas maintains a 1280:720 aspect ratio for YouTube compatibility
- Images are positioned with default locations based on the selected layout
- Headshots are automatically cropped to circular shape
- All thumbnails are exported at exactly 1280×720 pixels


