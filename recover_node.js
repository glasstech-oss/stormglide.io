const fs = require('fs');
const lines = fs.readFileSync('/Users/truth/.gemini/antigravity/brain/9e1568a3-68f2-4630-af8e-61264a1eb142/.system_generated/logs/transcript.jsonl', 'utf8').split('\n');

const files = {};

for (const line of lines) {
  if (!line) continue;
  try {
    const step = JSON.parse(line);
    if (step.type === 'TOOL_RESPONSE' && step.content) {
      if (step.content.includes('The above content shows the entire, complete file contents') || step.content.includes('Showing lines 1 to')) {
        const match = step.content.match(/File Path: `file:\/\/([^`]+)`/);
        if (match) {
          const filePath = match[1];
          // We only want the first time it was viewed (before any modifications)
          if (!files[filePath]) {
            const contentLines = step.content.split('\n');
            let capture = false;
            let recovered = [];
            for (let i = 0; i < contentLines.length; i++) {
              const cLine = contentLines[i];
              if (cLine.includes('The following code has been modified') || cLine.includes('Showing lines 1 to')) {
                capture = true;
                continue;
              }
              if (cLine.includes('The above content shows the entire') || cLine.includes('Use the view_file tool')) {
                capture = false;
                continue;
              }
              if (capture) {
                // remove the leading "1: ", "123: "
                const lineMatch = cLine.match(/^\d+:\s?(.*)$/);
                if (lineMatch) {
                  recovered.push(lineMatch[1]);
                } else if (cLine.trim() === '') {
                   // Some empty lines might just be empty strings without numbers depending on view_file output? 
                   // Wait, view_file puts "12: " even on empty lines.
                }
              }
            }
            if (recovered.length > 0) {
              files[filePath] = recovered.join('\n');
            }
          }
        }
      }
    }
  } catch (e) {
    // ignore json parse errors
  }
}

for (const [path, content] of Object.entries(files)) {
  fs.writeFileSync(path, content);
  console.log('Recovered ' + path);
}
