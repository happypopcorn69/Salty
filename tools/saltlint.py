#!/usr/bin/env python3
"""
saltlint - Quality gate for SALTY / saltworks

Scans src/ files for forbidden words that violate the brand voice.
No external dependencies. Pure compliance enforcement.
"""

import os
import re
import sys
from pathlib import Path

# Forbidden words (case-insensitive)
FORBIDDEN_WORDS = [
    "sweat",
    "sweaty",
    "perspire",
    "perspiration"
]

# File extensions to scan
SCAN_EXTENSIONS = {".html", ".css", ".js", ".md"}

def scan_file(file_path, forbidden_pattern):
    """
    Scan a single file for forbidden words.
    Returns list of (line_number, line_text, word) tuples.
    Raises exception if file cannot be read (security: no silent failures).
    """
    violations = []

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            for line_num, line in enumerate(f, start=1):
                # Find all forbidden words in the line
                matches = forbidden_pattern.finditer(line)
                for match in matches:
                    word = match.group()
                    violations.append((line_num, line.strip(), word))
    except UnicodeDecodeError:
        # Try with latin-1 as fallback for non-UTF-8 files
        try:
            with open(file_path, 'r', encoding='latin-1') as f:
                for line_num, line in enumerate(f, start=1):
                    matches = forbidden_pattern.finditer(line)
                    for match in matches:
                        word = match.group()
                        violations.append((line_num, line.strip(), word))
        except Exception as e:
            print(f"Error: Failed to read {file_path} with UTF-8 or Latin-1 encoding: {e}", file=sys.stderr)
            sys.exit(1)
    except Exception as e:
        print(f"Error: Could not read {file_path}: {e}", file=sys.stderr)
        sys.exit(1)

    return violations

def scan_directory(src_dir, forbidden_pattern):
    """
    Recursively scan directory for forbidden words.
    Returns dict of {file_path: [(line_num, line, word), ...]}
    """
    all_violations = {}

    src_path = Path(src_dir)
    if not src_path.exists():
        print(f"Error: Directory {src_dir} does not exist", file=sys.stderr)
        return all_violations

    # Recursively find all files with target extensions
    for file_path in src_path.rglob('*'):
        if file_path.is_file() and file_path.suffix in SCAN_EXTENSIONS:
            violations = scan_file(file_path, forbidden_pattern)
            if violations:
                all_violations[str(file_path)] = violations

    return all_violations

def format_report(violations):
    """Format violations into a readable report."""
    if not violations:
        return "[PASS] No forbidden words found. Site is compliant."

    report_lines = ["[FAIL] FORBIDDEN WORDS DETECTED", ""]
    total_count = sum(len(v) for v in violations.values())

    report_lines.append(f"Total violations: {total_count}")
    report_lines.append(f"Files affected: {len(violations)}")
    report_lines.append("")

    for file_path, file_violations in sorted(violations.items()):
        report_lines.append(f"File: {file_path}")
        for line_num, line_text, word in file_violations:
            report_lines.append(f"  Line {line_num}: '{word}' found")
            # Show the line with some context (truncate if too long)
            preview = line_text[:80] + "..." if len(line_text) > 80 else line_text
            report_lines.append(f"    {preview}")
        report_lines.append("")

    report_lines.append("Brand compliance FAILED. Remove all forbidden words before deploying.")

    return "\n".join(report_lines)

def main():
    """Main entry point."""
    # Get the project root (parent of tools/)
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    src_dir = project_root / "src"

    # Build case-insensitive regex pattern for forbidden words
    # Use word boundaries to avoid partial matches
    pattern_str = r'\b(' + '|'.join(re.escape(w) for w in FORBIDDEN_WORDS) + r')\b'
    forbidden_pattern = re.compile(pattern_str, re.IGNORECASE)

    print("saltlint: Scanning for forbidden words...")
    print(f"Target: {src_dir}")
    print(f"Forbidden words: {', '.join(FORBIDDEN_WORDS)}")
    print()

    # Scan the src directory
    violations = scan_directory(src_dir, forbidden_pattern)

    # Print report
    report = format_report(violations)
    print(report)

    # Exit with error code if violations found
    if violations:
        sys.exit(1)
    else:
        sys.exit(0)

if __name__ == "__main__":
    main()
