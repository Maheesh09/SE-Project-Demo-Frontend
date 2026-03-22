import sys

filepath = r'd:\Lec\Y2 S2\SE\SE Project\SE Project\SE-Project-Demo-Frontend\src\pages\QuizPlayPage.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Remove Trophy, CheckCircle2, XCircle imports
text = text.replace('import { Trophy, ChevronLeft, ChevronRight, Timer, CheckCircle2, XCircle } from "lucide-react";', 'import { ChevronLeft, ChevronRight, Timer } from "lucide-react";')

# 2. Remove containerRef and result
text = text.replace('    // Result object from backend after submission\n    const [result, setResult] = useState<any>(null);\n', '')
text = text.replace('    // Ref to scroll to top smoothly when entering review mode\n    const containerRef = useRef<HTMLDivElement>(null);\n', '')

# 3. Remove the entire review UI block
start_marker = '    // ── Review Mode UI ──'
end_marker = '    // ── Playing Mode UI ──'

start_idx = text.find(start_marker)
end_idx = text.find(end_marker)

if start_idx != -1 and end_idx != -1:
    text = text[:start_idx] + text[end_idx:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)
