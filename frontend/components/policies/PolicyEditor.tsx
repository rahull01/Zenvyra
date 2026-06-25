"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
    Bold, Italic, Underline, Link, List, ListOrdered,
    Heading1, Heading2, Quote, Code, Save, Eye,
    Undo, Redo, Type
} from "lucide-react";
import toast from "react-hot-toast";

interface PolicyEditorProps {
    initialContent?: string;
    onSave?: (content: string) => void;
}

export default function PolicyEditor({ initialContent = "", onSave }: PolicyEditorProps) {
    const [content, setContent] = useState(initialContent);
    const [isPreview, setIsPreview] = useState(false);
    const [history, setHistory] = useState<string[]>([initialContent]);
    const [historyIndex, setHistoryIndex] = useState(0);

    const handleSave = () => {
        onSave?.(content);
        toast.success("Policy saved successfully!");
    };

    const handleUndo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setContent(history[historyIndex - 1]);
        }
    };

    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            setContent(history[historyIndex + 1]);
        }
    };

    const updateContent = (newContent: string) => {
        setContent(newContent);
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newContent);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const toolbarButtons = [
        { icon: Bold, label: "Bold", action: () => { } },
        { icon: Italic, label: "Italic", action: () => { } },
        { icon: Underline, label: "Underline", action: () => { } },
        { icon: Link, label: "Link", action: () => { } },
        { icon: List, label: "Bullet List", action: () => { } },
        { icon: ListOrdered, label: "Numbered List", action: () => { } },
        { icon: Heading1, label: "Heading 1", action: () => { } },
        { icon: Heading2, label: "Heading 2", action: () => { } },
        { icon: Quote, label: "Quote", action: () => { } },
        { icon: Code, label: "Code", action: () => { } },
    ];

    return (
        <div className="glass-card rounded-2xl overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-4 border-b border-surface-800/50 bg-surface-900/50">
                <div className="flex items-center gap-1">
                    <button
                        onClick={handleUndo}
                        disabled={historyIndex === 0}
                        className="p-2 hover:bg-surface-800 rounded-lg transition-colors disabled:opacity-30"
                    >
                        <Undo className="w-4 h-4 text-surface-400" />
                    </button>
                    <button
                        onClick={handleRedo}
                        disabled={historyIndex === history.length - 1}
                        className="p-2 hover:bg-surface-800 rounded-lg transition-colors disabled:opacity-30"
                    >
                        <Redo className="w-4 h-4 text-surface-400" />
                    </button>
                    <div className="w-px h-6 bg-surface-800 mx-2" />
                    {toolbarButtons.map((btn) => (
                        <button
                            key={btn.label}
                            onClick={btn.action}
                            className="p-2 hover:bg-surface-800 rounded-lg transition-colors"
                            title={btn.label}
                        >
                            <btn.icon className="w-4 h-4 text-surface-400" />
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsPreview(!isPreview)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isPreview ? "bg-brand-500/20 text-brand-400" : "text-surface-400 hover:bg-surface-800"
                            }`}
                    >
                        <Eye className="w-4 h-4" />
                        Preview
                    </button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-400 text-white text-sm font-medium rounded-lg transition-all"
                    >
                        <Save className="w-4 h-4" />
                        Save
                    </motion.button>
                </div>
            </div>

            {/* Editor / Preview */}
            <div className="p-6 min-h-[500px]">
                {isPreview ? (
                    <div className="prose prose-invert max-w-none">
                        <div className="whitespace-pre-wrap">{content}</div>
                    </div>
                ) : (
                    <textarea
                        value={content}
                        onChange={(e) => updateContent(e.target.value)}
                        placeholder="Start writing your policy..."
                        className="w-full h-full min-h-[500px] bg-transparent text-surface-100 placeholder-surface-600 resize-none focus:outline-none font-mono text-sm leading-relaxed"
                    />
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-surface-800/50 bg-surface-900/50 text-xs text-surface-500">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                        <Type className="w-3 h-3" />
                        {content.length} characters
                    </span>
                    <span>{content.split(/\s+/).length} words</span>
                </div>
                <span>Last saved: Just now</span>
            </div>
        </div>
    );
}
