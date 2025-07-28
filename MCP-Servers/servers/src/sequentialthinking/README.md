# Sequential Thinking MCP Server

An MCP server implementation that provides a tool for dynamic and reflective problem-solving through a structured thinking process.

## Features

- Break down complex problems into manageable steps
- Revise and refine thoughts as understanding deepens
- Branch into alternative paths of reasoning
- Adjust the total number of thoughts dynamically
- Generate and verify solution hypotheses

## Tool

### sequential_thinking

Facilitates a detailed, step-by-step thinking process for problem-solving and analysis.

**Inputs:**
- `thought` (string): The current thinking step
- `nextThoughtNeeded` (boolean): Whether another thought step is needed
- `thoughtNumber` (integer): Current thought number
- `totalThoughts` (integer): Estimated total thoughts needed
- `isRevision` (boolean, optional): Whether this revises previous thinking
- `revisesThought` (integer, optional): Which thought is being reconsidered
- `branchFromThought` (integer, optional): Branching point thought number
- `branchId` (string, optional): Branch identifier
- `needsMoreThoughts` (boolean, optional): If more thoughts are needed

## Usage

The Sequential Thinking tool is designed for:
- Breaking down complex problems into steps
- Planning and design with room for revision
- Analysis that might need course correction
- Problems where the full scope might not be clear initially
- Tasks that need to maintain context over multiple steps
- Situations where irrelevant information needs to be filtered out


# Setup
```bash
## Installation
#go to development Commander folder
cd .\MCP-Servers\servers\src\sequentialthinking
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
"Sequential-Thinking": {
"command": "node",
"args": ["C:\\Users\\chandu\\OneDrive\\Documents\\Hackathon\\MCP\\servers\\src\\sequentialthinking\\dist\\index.js"]
},
}
}
```