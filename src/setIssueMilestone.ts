import * as github from "@actions/github";
import { getRepo, getIssueNumber, getPrNumber } from "./github";

export const setIssueMilestone = async (token: string,  matchingKeywords: { keywords: string[], labels: string[], assignees: string[], milestone: string }[]) => {
  const octokit = new github.GitHub(token);

  let issue_number;

  if (getIssueNumber() !== undefined) {
    issue_number = getIssueNumber();
  } else if (getPrNumber() !== undefined) {
    issue_number = getPrNumber();
  } else {
    throw new Error("No Issue Provided");
  }

  let milestones: string[]= [];

  matchingKeywords.forEach(obj => {
    milestones.forEach(label => {
      milestones.push(label);
    })
  })

  let milestone_number = findMostFrequent(milestones)

  await octokit.issues.getMilestone({
    ...getRepo(),
    milestone_number
  });
};

function findMostFrequent(arr) {
  let mf = 1;
  let m = 0;
  let item;

  for (let i = 0; i < arr.length; i++) {
    for (let j = i; j < arr.length; j++) {
      if (arr[i] == arr[j]) {
        m++;
        if (m > mf) {
          mf = m;
          item = arr[i];
        }
      }
    }
    m = 0;
  }

  return item;
}
