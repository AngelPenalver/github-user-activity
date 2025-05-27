# GitHub User Activity CLI

A command-line tool to fetch and display the recent public activity of any GitHub user.

## Features

- Fetches recent public events for a GitHub user.
- Groups and formats events (commits, repo creation, stars, forks, etc.).
- Error handling for not found users or network/API issues.

## Installation

1. Clone this repository:
   ```sh
   git clone https://github.com/your-username/github-user-activity.git
   cd github-user-activity
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

## Usage

Run the main command from your terminal:

```sh
node src/index.js github-activity <github-username>
```

Or, if installed globally as a CLI:

```sh
task-cli github-activity <github-username>
```

### Example

```sh
task-cli github-activity octocat
```

Expected output:

```
Fetching activity for octocat...

Recent activity for octocat:
✓ Pushed 2 commit(s) to repo1
★ Starred repository: repo2
⎘ Forked repository: repo3

Total activities: 3
```

## Available Scripts

- `npm test` — Run tests with Jest.

## Project Structure

- `src/handlers/` — Main logic for fetching and formatting events.
- `src/index.js` — CLI entry point.
- `src/test/` — Unit tests.

## License

Developer by Angel Penalver
