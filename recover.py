import json
import re

log_path = '/Users/truth/.gemini/antigravity/brain/9e1568a3-68f2-4630-af8e-61264a1eb142/.system_generated/logs/transcript.jsonl'

files_recovered = 0
with open(log_path, 'r') as f:
    for line in f:
        step = json.loads(line)
        content = step.get('content', '')
        if 'File Path: `file://' in content:
            # Extract file path
            path_match = re.search(r'File Path: `file://([^`]+)`', content)
            if not path_match:
                continue
            file_path = path_match.group(1)
            
            # Extract content lines
            # Format: <line_number>: <original_line>
            lines = []
            capture = False
            for c_line in content.split('\n'):
                if c_line.startswith('The following code has been modified'):
                    capture = True
                    continue
                if c_line.startswith('The above content shows the entire'):
                    capture = False
                    continue
                
                if capture:
                    # Match '1: something' or '12: something'
                    match = re.match(r'^\d+:\s?(.*)$', c_line)
                    if match:
                        lines.append(match.group(1))
            
            if lines:
                with open(file_path, 'w') as out:
                    out.write('\n'.join(lines) + '\n')
                print(f"Recovered {file_path}")
                files_recovered += 1

print(f"Total files recovered: {files_recovered}")
