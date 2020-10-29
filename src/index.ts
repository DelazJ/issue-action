import * as core from "@actions/core";
import { getIssueContent } from "./getIssueContent";
import { checkKeywords } from "./checkKeywords";
import { setIssueLabel } from "./setIssueLabel";
import { setIssueAssignee } from "./setIssueAssignee";
import { setIssueMilestone } from "./setIssueMilestone";

async function run() {
  try {
    core.setOutput("labeled", false.toString());
    core.setOutput("assigned", false.toString());
    core.setOutput("milestoned", false.toString());
    const titleOrBody: string = core.getInput("title-or-body");
    const token = core.getInput("github-token");
    const content = await getIssueContent(token, titleOrBody);
    const parameters: { keywords: string[], labels: string[], assignees: string[], milestone: string }[] = JSON.parse(
      core.getInput("parameters", {required: true})
    );
    if (!parameters) {
      core.setFailed(
        `parameters input not found. Make sure your ".yml" file contains a "parameters" JSON array like this:
        parameters: '[ {"keywords": ["bug", "error"], "labels": ["BUG"], "assignees": ["username"], "milestone": "2"}, {"keywords": ["help", "guidance"], "labels": ["help-wanted"], "assignees": ["username"], "milestone": "2"}]'`
      );
    }

    const matchingKeywords = checkKeywords(parameters, content);

    if (matchingKeywords === null) {
      console.log("Keywords not included in this issue");
      return;
    } else {
      setIssueLabel(token, matchingKeywords);
      core.setOutput("labeled", true.toString());

      setIssueAssignee(token, matchingKeywords);
      core.setOutput("assigned", true.toString());

      setIssueMilestone(token, matchingKeywords);
      core.setOutput("milestoned", true.toString());
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
