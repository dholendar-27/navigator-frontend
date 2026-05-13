import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, X, History } from "lucide-react";
import { 
    Sheet, 
    SheetContent, 
    SheetHeader, 
    SheetTitle 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { vectorSearch } from "@/lib/api";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
};

type AskAiDrawerProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    folderId?: string;
};

export default function AskAiDrawer({ open, onOpenChange, folderId }: AskAiDrawerProps) {
    const { getToken } = useKindeAuth();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content: "Hello! I can search through your knowledge base and answer questions. What would you like to know?",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
        };

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const token = await getToken();
            if (!token) throw new Error("No token");

            // 1. Vector Search
            // For now, we search in the provided folder or globally if no folderId
            // The API requires folder_id, so we'll use a placeholder or handle null
            const searchResults = folderId 
                ? await vectorSearch(folderId, input, token)
                : { results: [] };

            // 2. Simulate AI response based on search results
            setTimeout(() => {
                const assistantMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: searchResults.results.length > 0
                        ? `Based on your search, I found ${searchResults.results.length} relevant documents. Here's what I found: ...`
                        : "I couldn't find any specific information in your knowledge base regarding that. Would you like me to try a broader search?",
                };
                setMessages(prev => [...prev, assistantMsg]);
                setIsLoading(false);
            }, 1000);

        } catch (error) {
            console.error("AI Error:", error);
            setMessages(prev => [...prev, {
                id: "err",
                role: "assistant",
                content: "Sorry, I encountered an error while searching your knowledge base.",
            }]);
            setIsLoading(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="sm:max-w-md p-0 flex flex-col h-full border-l border-zinc-200">
                <SheetHeader className="p-6 border-b border-zinc-100 flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <div>
                            <SheetTitle className="text-base font-semibold">Ask Navigator AI</SheetTitle>
                            <p className="text-xs text-zinc-500">Querying your Knowledge Base</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="rounded-full h-8 w-8">
                        <X className="h-4 w-4 text-zinc-500" />
                    </Button>
                </SheetHeader>

                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#FAFAFA]">
                    {messages.map((m) => (
                        <div key={m.id} className={cn("flex gap-3", m.role === "user" ? "flex-row-reverse" : "flex-row")}>
                            <div className={cn(
                                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border shadow-sm",
                                m.role === "assistant" ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-white text-zinc-600 border-zinc-200"
                            )}>
                                {m.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                            </div>
                            <div className={cn(
                                "rounded-2xl px-4 py-2.5 text-sm leading-relaxed max-w-[85%] shadow-sm",
                                m.role === "user" ? "bg-blue-600 text-white" : "bg-white text-zinc-900 border border-zinc-100"
                            )}>
                                {m.content}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-blue-50 text-blue-600 border-blue-100">
                                <Bot className="h-4 w-4" />
                            </div>
                            <div className="bg-white border border-zinc-100 rounded-2xl px-4 py-2.5 flex gap-1 items-center shadow-sm">
                                <div className="h-1.5 w-1.5 rounded-full bg-zinc-300 animate-bounce" />
                                <div className="h-1.5 w-1.5 rounded-full bg-zinc-300 animate-bounce [animation-delay:0.2s]" />
                                <div className="h-1.5 w-1.5 rounded-full bg-zinc-300 animate-bounce [animation-delay:0.4s]" />
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-zinc-100 bg-white">
                    <div className="relative flex items-center">
                        <textarea
                            rows={1}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder="Type your question..."
                            className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all max-h-32"
                        />
                        <Button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            size="icon"
                            className="absolute right-2 h-8 w-8 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-all"
                        >
                            <Send className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
