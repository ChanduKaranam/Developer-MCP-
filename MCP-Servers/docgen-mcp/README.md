# DocGen MCP Server

Documentation Generator MCP Server for automated documentation creation from source files.

## Overview

The DocGen MCP server automates the creation of standardized documentation by extracting information from source files and applying templates. It seamlessly integrates with other MCP servers to provide a comprehensive solution.

## Features

- Extract information from GitHub repositories and Google Drive files
- Process multiple source types (scripts, presentations, code, reference documents)
- Template-based document generation
- Document history tracking


## Installation


# Setup



```bash
## Installation
#go to development Commander folder
cd .\MCP-Servers\docgen-mcp
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
"Docment generator MCP": {
"command": "node",
"args": ["C:\\Users\\chandu\\OneDrive\\Documents\\Hackathon\\MCP\\docgen-mcp\\build\\index.js"],
"env": {},
"disabled": false,
"autoApprove": []
},
}
}

```


## Tools

The DocGen MCP server exposes the following tools:

### create_documentation
Generate documentation from source files using a template.

### list_templates

List available documentation templates.

### view_document_history

View history of previously generated documents.

## Templates

Templates are stored in the `templates` directory and use a simple marker system for content generation:

- `{{projectId}}` - Replaced with the project identifier
- `{{date}}` - Current date
- `{{section:NAME}}` - Replaced with generated content for the named section

Custom templates can be added by creating new `.template` files in the templates directory.

