export const checkKeywords = (
  parameters: { keywords: string[], labels: string[], assignees: string[], milestone: string }[],
  content: string
): { keywords: string[], labels: string[], assignees: string[], milestone: string }[] | null => {
  console.log('issue content:', content);

  let matchingKeywords: { keywords: string[], labels: string[], assignees: string[], milestone: string }[] = [];

  parameters.forEach(obj => {
    return obj.keywords.forEach(keyword => {
      if (RegExp(`(?!-)\\b${keyword.toLowerCase()}\\b(?!-)`, 'g').test(content.toLowerCase())) {
        matchingKeywords.push(obj);
      }
    })
  })
  
  if (matchingKeywords.length !== 0) {
    return matchingKeywords;
  } else {
    return null;
  }
  
};
