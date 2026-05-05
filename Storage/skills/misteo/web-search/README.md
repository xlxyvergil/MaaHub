# Web Search Skill

This skill allows an AI agent to perform web searches using the Google Custom Search API.

## Installation

1. Download the `skill.json` file.
2. Add it to your agent's skill directory.
3. Configure your `GOOGLE_API_KEY` and `GOOGLE_CX` in your environment variables.

## Usage

When the user asks for current information, use this skill to fetch it from the web.

```json
{
  "name": "web_search",
  "arguments": {
    "query": "latest news today",
    "num_results": 3
  }
}
```