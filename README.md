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

You need to serve the files from an HTTP server. You can use any server such as `nginx`, or to serve the files from your local machine use a lightweight static HTTP server such as [http-server](https://www.npmjs.com/package/http-server):

1. Install http-server globally: `npm i -g http-server` (or use your preferred HTTP server)
2. Navigate to the directory containing `index.html` in your terminal
3. Run `http-server` to start the local server
4. Open your browser and navigate to the URL shown (typically `http://localhost:8080`)
5. Select your preferred layout from the dropdown
6. Enter your presentation title
7. Adjust the font size using the slider
8. Select the month and enter the year
9. (Optional) Upload a headshot image - it will appear as a circular image
10. (Optional) Upload a screenshot image
11. Click and drag images to reposition them
12. Click and drag corner/edge handles to resize images
13. Click "Download Thumbnail" to save your image

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


