# Mermaid MCP Server

A Model Context Protocol (MCP) server that converts Mermaid diagrams to PNG images or SVG files. This server allows AI assistants and other applications to generate visual diagrams from textual descriptions using the Mermaid markdown syntax.

## Features

- Converts Mermaid diagram code to PNG images or SVG files
- Supports multiple diagram themes (default, forest, dark, neutral)
- Customizable background colors
- Uses Puppeteer for high-quality headless browser rendering
- Implements the MCP protocol for seamless integration with AI assistants
- Flexible output options: return images/SVG directly or save to disk
- Error handling with detailed error messages

## How It Works

The server uses Puppeteer to launch a headless browser, render the Mermaid diagram to SVG, and optionally capture a screenshot of the rendered diagram. The process involves:

1. Launching a headless browser instance
2. Creating an HTML template with the Mermaid code
3. Loading the Mermaid.js library
4. Rendering the diagram to SVG
5. Either saving the SVG directly or taking a screenshot as PNG
6. Either returning the image/SVG directly or saving it to disk


You can find a list of mermaid diagrams under `./diagrams`, they are created using the Agent with prompt: "generate mermaid diagrams and save them in a separate diagrams folder explaining how renderMermaidPng work"

# Setup



```bash
## Installation
#go to development Commander folder
cd .\MCP-Servers\Mermaid
# Install the dependences 
npm install
# Run the build
npm run build
``` 
### How to Use with Trae 
```bash
# Find the dist folder inside is index.js Inside The MCP.jason folder use 

{
"mcpServers": {
"Mermaid-MCP": {
"command": "node",
"args": ["C:\\Users\\chandu\\OneDrive\\Documents\\Hackathon\\MCP\\Mermaid\\dist\\index.js"]

},
}
}

```



### Tool
The server exposes a single tool:

- `generate`: Converts Mermaid diagram code to a PNG image or SVG file
  - Parameters:
    - `code`: The Mermaid diagram code to render
    - `theme`: (optional) Theme for the diagram. Options: "default", "forest", "dark", "neutral"
    - `backgroundColor`: (optional) Background color for the diagram, e.g. 'white', 'transparent', '#F0F0F0'
    - `outputFormat`: (optional) Output format for the diagram. Options: "png", "svg" (defaults to "png")
    - `name`: Name for the generated file (required when CONTENT_IMAGE_SUPPORTED=false)
    - `folder`: Absolute path to save the image/SVG to (required when CONTENT_IMAGE_SUPPORTED=false)

The behavior of the `generate` tool depends on the `CONTENT_IMAGE_SUPPORTED` environment variable:

- When `CONTENT_IMAGE_SUPPORTED=true` (default): The tool returns the image/SVG directly in the response
- When `CONTENT_IMAGE_SUPPORTED=false`: The tool saves the image/SVG to the specified folder and returns the file path

## Environment Variables

- `CONTENT_IMAGE_SUPPORTED`: Controls whether images are returned directly in the response or saved to disk
  - `true` (default): Images are returned directly in the response
  - `false`: Images are saved to disk, requiring `name` and `folder` parameters

## Examples

### Basic Usage

```javascript
// Generate a flowchart with default settings
{
  "code": "flowchart TD\n    A[Start] --> B{Is it?}\n    B -->|Yes| C[OK]\n    B -->|No| D[End]"
}
```

### With Theme and Background Color

```javascript
// Generate a sequence diagram with forest theme and light gray background
{
  "code": "sequenceDiagram\n    Alice->>John: Hello John, how are you?\n    John-->>Alice: Great!",
  "theme": "forest",
  "backgroundColor": "#F0F0F0"
}
```

### Saving to Disk (when CONTENT_IMAGE_SUPPORTED=false)

```javascript
// Generate a class diagram and save it to disk as PNG
{
  "code": "classDiagram\n    Class01 <|-- AveryLongClass\n    Class03 *-- Class04\n    Class05 o-- Class06",
  "theme": "dark",
  "name": "class_diagram",
  "folder": "/path/to/diagrams"
}
```

### Generating SVG Output

```javascript
// Generate a state diagram as SVG
{
  "code": "stateDiagram-v2\n    [*] --> Still\n    Still --> [*]\n    Still --> Moving\n    Moving --> Still\n    Moving --> Crash\n    Crash --> [*]",
  "outputFormat": "svg",
  "name": "state_diagram",
  "folder": "/path/to/diagrams"
}
```

