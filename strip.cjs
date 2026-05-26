const fs = require('fs');
const path = require('path');
const ts = require('typescript');

function getFiles(dir, files = []) {
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const name = path.join(dir, file);
        if (fs.statSync(name).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
                getFiles(name, files);
            }
        } else {
            if (name.endsWith('.ts') || name.endsWith('.tsx')) {
                files.push(name);
            }
        }
    }
    return files;
}

function removeComments(filePath) {
    const text = fs.readFileSync(filePath, 'utf8');
    const scanner = ts.createScanner(ts.ScriptTarget.Latest, false, ts.LanguageVariant.JSX, text);
    
    const tokens = [];
    let token = scanner.scan();
    while (token !== ts.SyntaxKind.EndOfFileToken) {
        tokens.push({
            kind: token,
            start: scanner.getTokenStart(),
            end: scanner.getTokenEnd(),
            text: text.substring(scanner.getTokenStart(), scanner.getTokenEnd())
        });
        token = scanner.scan();
    }

    let result = '';
    let i = 0;
    let lastCopiedPos = 0;

    while (i < tokens.length) {
        const current = tokens[i];

        if (current.kind === ts.SyntaxKind.OpenBraceToken) {
            let j = i + 1;
            let onlyCommentsAndWhitespace = true;
            let hasComment = false;
            while (j < tokens.length) {
                const next = tokens[j];
                if (next.kind === ts.SyntaxKind.CloseBraceToken) {
                    break;
                }
                if (next.kind === ts.SyntaxKind.SingleLineCommentTrivia || next.kind === ts.SyntaxKind.MultiLineCommentTrivia) {
                    hasComment = true;
                } else if (next.kind === ts.SyntaxKind.WhitespaceTrivia || next.kind === ts.SyntaxKind.NewLineTrivia) {
                    // whitespace is fine
                } else {
                    onlyCommentsAndWhitespace = false;
                    break;
                }
                j++;
            }

            if (j < tokens.length && onlyCommentsAndWhitespace && hasComment) {
                result += text.substring(lastCopiedPos, current.start);
                lastCopiedPos = tokens[j].end;
                i = j + 1;
                continue;
            }
        }

        if (current.kind === ts.SyntaxKind.SingleLineCommentTrivia || current.kind === ts.SyntaxKind.MultiLineCommentTrivia) {
            result += text.substring(lastCopiedPos, current.start);
            lastCopiedPos = current.end;
        }

        i++;
    }
    result += text.substring(lastCopiedPos);
    return result;
}

const srcDir = path.join(__dirname, 'src');
const files = getFiles(srcDir);
console.log(`Found ${files.length} files to clean up...`);

for (const file of files) {
    try {
        const cleaned = removeComments(file);
        fs.writeFileSync(file, cleaned, 'utf8');
        console.log(`Cleaned: ${file}`);
    } catch (e) {
        console.error(`Error cleaning ${file}:`, e);
    }
}
console.log('All comments removed successfully!');
