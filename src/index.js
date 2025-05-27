#!/usr/bin/env node
const { sendFormattedEvents } = require("./handlers/formatedEvents");
const { program } = require("commander");
const { getUserActivity } = require("./handlers/getActivityUser");
const { handleManagerError } = require("./handlers/errorHandler");

program
  .version("0.0.1")
  .description("A command line tool for viewing user activity in GitHub");

program
  .command("github-activity <username>")
  .description("Fetch and display GitHub user activity")
  .action(async (username) => {
    if (!username || username.trim() === "") {
      console.error("Error: GitHub username is required");
      process.exit(1);
    }

    try {
      console.log(`Fetching activity for ${username}...\n`);

      const activity = await getUserActivity(username);

      if (!activity || activity.length === 0) {
        console.log("No recent activity found for this user");
        return;
      }

      const formattedActivity = sendFormattedEvents(activity);

      console.log(`Recent activity for ${username}:\n`);

      formattedActivity.forEach((event) => {
        const repoName = event.name.split("/")[1];
        switch (event.type) {
          case "PushEvent":
            console.log(`✓ Pushed ${event.value} commit(s) to ${repoName}`);
            break;
          case "CreateEvent":
            console.log(`✓ Created repository: ${repoName}`);
            break;
          case "DeleteEvent":
            console.log(`× Deleted repository: ${repoName}`);
            break;
          case "ForkEvent":
            console.log(`⎘ Forked repository: ${repoName}`);
            break;
          case "WatchEvent":
            console.log(`★ Starred repository: ${repoName}`);
            break;
          case "IssueCommentEvent":
            console.log(`💬 Commented on issue in: ${repoName}`);
            break;
          case "IssuesEvent":
            console.log(
              `❗ ${event.action || "Action"} on issue in: ${repoName}`
            );
            break;
          case "PullRequestEvent":
            console.log(
              `⇆ Pull request ${event.action || "action"} in: ${repoName}`
            );
            break;
          default:
            console.log(`⚡ ${event.type} action in: ${repoName}`);
        }
      });

      console.log(`\nTotal activities: ${formattedActivity.length}`);
    } catch (error) {
      handleManagerError(error);
      process.exit(1);
    }
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
  process.exit(1);
}
