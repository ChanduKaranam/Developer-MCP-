# Mem0 Memory MCP Server

A Model Context Protocol (MCP) server that provides memory storage and retrieval capabilities using Mem0 , This tool allows you to store and search through memories, making it useful for maintaining context and making informed decisions based on past interactions.

## Features

- Store memories with user-specific context
- Search through stored memories with relevance scoring
- Simple and intuitive API
- Built on the Model Context Protocol
- Automatic error handling
- Support for multiple user contexts


## Tools

### 1. Add Memory Tool (add-memory)

Store new memories with user-specific context.

```json
{
  "name": "add-memory",
  "arguments": {
    "content": "User prefers dark mode interface",
    "userId": "user123"
  }
}
```

### 2. Search Memories Tool (search-memories)

Search through stored memories to retrieve relevant information.

```json
{
  "name": "search-memories",
  "arguments": {
    "query": "What are the user's interface preferences?",
    "userId": "user123"
  }
}
```

## Response Format

### Add Memory Response

```json
{
  "content": [
    {
      "type": "text",
      "text": "Memory added successfully"
    }
  ],
  "isError": false
}
```

### Search Memory Response

```json
{
  "content": [
    {
      "type": "text",
      "text": "Memory: User prefers dark mode interface\nRelevance: 0.95\n---\nMemory: User mentioned liking minimal UI\nRelevance: 0.82\n---"
    }
  ],
  "isError": false
}
```



# Setup


```bash
## Installation
#go to development Commander folder
cd .\MCP-Servers\MEM0
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
"Mem0-MCP": {
"command": "node",
"args": ["C:\\Users\\chandu\\OneDrive\\Documents\\Hackathon\\MCP\\MEM0\\dist\\index.js"],
"env": {
"MEM0_API_KEY": "<MEM0 API Key>"
},
}
}

```
## Configuration

### Environment Variables

- `MEM0_API_KEY`: Your Mem0 API key (required)
  - Required for operation
  - Can be obtained from [Mem0 Dashboard](https://app.mem0.ai/dashboard/api-keys)

