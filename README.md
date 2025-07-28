# 🚀 MCP Servers Collection  
_A one-stop repository of ready-to-use Model Context Protocol servers for Coding AI Agents ._

---

## 📂 What’s Inside



### 1. Sequential Thinking MCP  
*A reflective “whiteboard” that lets an AI think step-by-step, revise branches, and back-track.*

- `sequential_thinking` – multi-step reasoning with revision & branching support.

---

### 2. Filesystem MCP  
*Safe, scoped file-system CRUD and search.*

- `read_text_file` – read any UTF-8 file (with head/tail).  
- `read_media_file` – stream images/audio as base64.  
- `read_multiple_files` – batch read.  
- `write_file` – create or overwrite.  
- `edit_file` – smart, preview-able text replacement.  
- `create_directory` – mkdir -p.  
- `list_directory` – dir with [FILE]/[DIR] tags.  
- `move_file` – rename / relocate.  
- `search_files` – recursive glob search.  
- `get_file_info` – metadata (size, dates, perms).  
- `list_allowed_directories` – show sandbox roots.

---

### 3. Knowledge Graph Memory Server  
*Persistent memory as a tiny local knowledge graph.*

- `create_entities` – add nodes (person, org, event…).  
- `create_relations` – add directed edges.  
- `add_observations` – append facts to entities.  
- `delete_entities` – remove nodes & edges.  
- `delete_observations` – remove specific facts.  
- `delete_relations` – remove edges.  
- `read_graph` – dump entire graph.  
- `search_nodes` – fuzzy search across names/types/facts.  
- `open_nodes` – fetch specific nodes + their edges.

---

### 4. Firecrawl MCP  
*High-performance web scraping, crawling & research.*

- `firecrawl_scrape` – single-page markdown/HTML.  
- `firecrawl_batch_scrape` – many URLs in parallel.  
- `firecrawl_check_batch_status` – monitor batch job.  
- `firecrawl_map` – discover all URLs on a domain.  
- `firecrawl_search` – web search + optional scrape.  
- `firecrawl_crawl` – deep site crawl.  
- `firecrawl_check_crawl_status` – monitor crawl job.  
- `firecrawl_extract` – LLM-powered structured data.  
- `firecrawl_deep_research` – autonomous multi-source research.  
- `firecrawl_generate_llmstxt` – create llms.txt permission files.

---

### 5. DocGen MCP  
*Auto-create docs from code, slides, or Google Drive.*

- `create_documentation` – generate doc from template + sources.  
- `list_templates` – show available doc templates.  
- `view_document_history` – list previously generated docs.

---

### 6. Slack MCP  
*Full Slack workspace interaction.*

- `slack_list_channels` – list public channels.  
- `slack_post_message` – send new message.  
- `slack_reply_to_thread` – reply in thread.  
- `slack_add_reaction` – add emoji reaction.  
- `slack_get_channel_history` – recent messages.  
- `slack_get_thread_replies` – full thread.  
- `slack_get_users` – workspace roster.  
- `slack_get_user_profile` – detailed user info.

---

### 7. Mermaid MCP  
*Render Mermaid diagrams to PNG or SVG.*

- `generate` – convert Mermaid code → PNG/SVG, with themes & colors.

---

### 8. Mem0 Memory MCP  
*Lightweight user-centric memory with semantic search.*

- `add-memory` – store a new memory for a user.  
- `search-memories` – retrieve relevant memories by query.

---

### 9. GitHub MCP  
*Full GitHub API surface for repos, issues, PRs.*

- `create_or_update_file` – write/overwrite file in repo.  
- `push_files` – multi-file commit.  
- `search_repositories` – GitHub repo search.  
- `create_repository` – new repo.  
- `get_file_contents` – read file/dir.  
- `create_issue` / `update_issue` / `add_issue_comment` – issue lifecycle.  
- `create_pull_request` – open PR.  
- `fork_repository` – fork repo.  
- `create_branch` – new branch.  
- `list_issues` / `list_pull_requests` – filterable lists.  
- `search_code` / `search_issues` / `search_users` – global search.  
- `list_commits` – branch commit log.  
- `get_issue` / `get_pull_request` – full details.  
- `create_pull_request_review` – review & line comments.  
- `merge_pull_request` – merge with options.  
- `get_pull_request_files` – changed files list.  
- `get_pull_request_status` – CI status.  
- `update_pull_request_branch` – “Update branch” button.  
- `get_pull_request_comments` – review comments.  
- `get_pull_request_reviews` – all reviews.

---

### 10. Development Commander MCP  
*Terminal, process, and file ops inside the chat.*

- `get_config` / `set_config_value` – runtime settings.  
- `start_process` – launch long-running CLI apps.  
- `interact_with_process` – send input to running process.  
- `read_process_output` – stream stdout/stderr.  
- `force_terminate` – kill session.  
- `list_sessions` / `list_processes` – active shells & OS PIDs.  
- `kill_process` – terminate by PID.  
- `read_file` / `read_multiple_files` – local or URL files.  
- `write_file` – create/append/overwrite.  
- `create_directory` / `list_directory` / `move_file` / `search_files` / `get_file_info` – classic fs tools.  
- `search_code` – ripgrep-powered recursive search.  
- `edit_block` – surgical text replacement with fuzzy fallback.  
- `get_usage_stats` – telemetry.  
- `give_feedback_to_desktop_commander` – open feedback form.

---

## ⚡ Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/ChanduKaranam/Developer-MCP-.git
cd MCP-Servers

# 2. Pick the server you need
cd MCP-Severs/<server-folder>

# 3. Install & build
npm install
npm run build

# 4. Copy the absolute path to the generated index.js
realpath dist/index.js   # or build/index.js
```

---

## 🔌 MCP Client Configuration (Trae / Claude Desktop / etc.)

Create or edit your `mcp.json` (or equivalent) and add the server block.  
Replace the **absolute path** and **environment variables** as instructed in each server’s README.

```jsonc
{

"mcpServers": {

"Git_MCP": {

"command": "node",

"args": ["{Absolute path}\\MCP\\Github\\dist\\index.js"],

"env": {

"GITHUB_PERSONAL_ACCESS_TOKEN": "<Githube Token>"

}

},

"Mem0-MCP": {

"command": "node",

"args": ["{Absolute path}\\MEM0\\dist\\index.js"],

"env": {

"MEM0_API_KEY": "<MEM0 API Key>"

}

},

"Mermaid-MCP": {

"command": "node",

"args": ["{Absolute path}\\Mermaid\\dist\\index.js"]

},

"Sequential-Thinking": {

"command": "node",

"args": ["{Absolute path}\\servers\\src\\sequentialthinking\\dist\\index.js"]

},

  

"Docment generator MCP": {

"command": "node",

"args": ["{Absolute path}\\docgen-mcp\\build\\index.js"],

"env": {},

"disabled": false,

"autoApprove": []

},

"File_Access- MCP": {

"command": "node",

"args": [

"{Absolute path}\\servers\\src\\filesystem\\dist\\index.js",

"{Path to the Folder with access}"

]

},

"Slack MCP": {

"command": "node",

"args": ["{Absolute path}\\Slack\\dist\\index.js"],

"env": {

"SLACK_BOT_TOKEN": "<BOT Token>",

"SLACK_TEAM_ID": "<Team ID>",

"SLACK_CHANNEL_IDS": "<Channel ID>"

}

},

"Knowledege Graph Memory": {

"command": "node",

"args": ["{Absolute path}\\memory\\dist\\index.js"]

},

"Firecrawl-MCP": {

"command": "node",

"args": ["{Absolute path}\\firecrawl-mcp-server\\dist\\index.js"],

"env": {

"FIRECRAWL_API_KEY": "<Firecrawl API KEY>"

}

},

"Developmet MCP": {

"command": "node",

"args": ["{Absolute path}\\DesktopCommanderMCP\\dist\\index.js"]

}

}

}
```

---

## 🛠️ Development Tips

1. **Always** run `npm install && npm run build` inside each server folder after cloning.  
2. Use `realpath` (Linux/macOS) or `Resolve-Path` (PowerShell) to get the absolute path to `index.js`.  
3. Check the individual README inside each server folder for any **extra environment variables** or **special arguments**.  
4. Restart your MCP client after editing `mcp.json`.

---

## 🤝 Contributing

Found a bug or want a new MCP?  
Open an issue or PR—each server lives in its own folder, so changes stay tidy.
