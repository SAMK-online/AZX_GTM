"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getContacts, removeContact, clearContacts } from "@/lib/outreach-store";
import type { OutreachContact, OutreachMessageType } from "@/types";

function useOutreachStream() {
  const [content, setContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = useCallback(async (contact: OutreachContact, messageType: OutreachMessageType) => {
    setContent("");
    setIsGenerating(true);
    try {
      const res = await fetch("/api/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contact.name,
          title: contact.title,
          company: contact.company,
          description: contact.description,
          messageType,
          briefContext: contact.briefContext,
        }),
      });
      const reader = res.body?.getReader();
      if (!reader) return;
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setContent(acc);
      }
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { content, isGenerating, generate, reset: () => setContent("") };
}

function ContactCard({
  contact,
  isSelected,
  onClick,
  onRemove,
}: {
  contact: OutreachContact;
  isSelected: boolean;
  onClick: () => void;
  onRemove: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`group relative p-3 rounded-lg border cursor-pointer transition-all duration-150 ${
        isSelected
          ? "border-white/30 bg-white/5"
          : "border-azx-border hover:border-white/15 hover:bg-white/[0.02]"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-mono text-sm text-white truncate">{contact.name}</div>
          <div className="font-mono text-[11px] text-azx-muted truncate mt-0.5">{contact.title}</div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="opacity-0 group-hover:opacity-100 text-azx-muted hover:text-white transition-all text-xs shrink-0 mt-0.5"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export function OutreachModule() {
  const [contacts, setContacts] = useState<OutreachContact[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<OutreachMessageType>("email");
  const [copied, setCopied] = useState(false);
  const { content, isGenerating, generate, reset } = useOutreachStream();

  useEffect(() => {
    const loaded = getContacts();
    setContacts(loaded);
    if (loaded.length > 0) setSelectedId(loaded[0].id);
  }, []);

  const selectedContact = contacts.find(c => c.id === selectedId) ?? null;

  const handleSelect = (contact: OutreachContact) => {
    setSelectedId(contact.id);
    reset();
  };

  const handleRemove = (id: string) => {
    removeContact(id);
    const updated = contacts.filter(c => c.id !== id);
    setContacts(updated);
    if (selectedId === id) {
      setSelectedId(updated[0]?.id ?? null);
      reset();
    }
  };

  const handleClear = () => {
    clearContacts();
    setContacts([]);
    setSelectedId(null);
    reset();
  };

  const handleGenerate = () => {
    if (selectedContact) generate(selectedContact, messageType);
  };

  const handleCopy = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Group contacts by company
  const grouped = contacts.reduce<Record<string, OutreachContact[]>>((acc, c) => {
    (acc[c.company] = acc[c.company] || []).push(c);
    return acc;
  }, {});

  if (contacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="font-mono text-4xl mb-4 text-azx-muted">◈</div>
        <h2 className="text-xl font-bold text-white mb-2">No contacts yet</h2>
        <p className="text-slate-400 text-sm max-w-sm mb-6">
          Run the Prospect Intelligence Engine on a company — contacts from the brief are automatically added here.
        </p>
        <Link
          href="/intelligence"
          className="px-5 py-2.5 rounded-lg bg-white text-black font-mono text-sm font-bold hover:bg-white/90 transition-colors"
        >
          Run Intelligence Engine →
        </Link>
      </div>
    );
  }

  return (
    <div className="flex gap-4 h-[calc(100vh-200px)] min-h-[500px]">
      {/* Left: Contacts list */}
      <div className="w-64 shrink-0 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-azx-muted tracking-widest uppercase">
            {contacts.length} Contact{contacts.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={handleClear}
            className="font-mono text-[10px] text-azx-muted hover:text-white transition-colors"
          >
            Clear all
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {Object.entries(grouped).map(([company, companyContacts]) => (
            <div key={company}>
              <div className="font-mono text-[10px] text-white/30 tracking-widest uppercase mb-2 px-1">
                {company}
              </div>
              <div className="space-y-1">
                {companyContacts.map(contact => (
                  <ContactCard
                    key={contact.id}
                    contact={contact}
                    isSelected={selectedId === contact.id}
                    onClick={() => handleSelect(contact)}
                    onRemove={() => handleRemove(contact.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Message generator */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {selectedContact ? (
          <>
            {/* Contact header */}
            <div className="p-4 rounded-lg border border-azx-border bg-azx-card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedContact.name}</h3>
                  <p className="font-mono text-xs text-azx-muted mt-0.5">
                    {selectedContact.title} · {selectedContact.company}
                  </p>
                  <p className="text-slate-400 text-sm leading-relaxed mt-2 max-w-2xl">
                    {selectedContact.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <div className="flex rounded-lg border border-azx-border overflow-hidden">
                {(["email", "linkedin"] as OutreachMessageType[]).map(type => (
                  <button
                    key={type}
                    onClick={() => { setMessageType(type); reset(); }}
                    className={`px-4 py-2 font-mono text-xs capitalize transition-colors ${
                      messageType === type
                        ? "bg-white text-black"
                        : "text-azx-muted hover:text-white"
                    }`}
                  >
                    {type === "email" ? "✉ Email" : "◈ LinkedIn"}
                  </button>
                ))}
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-5 py-2 rounded-lg bg-white text-black font-mono text-sm font-bold
                           hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? "Generating..." : `Generate ${messageType === "email" ? "Email" : "LinkedIn"} →`}
              </button>

              {content && !isGenerating && (
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 rounded-lg border border-azx-border font-mono text-xs text-azx-muted hover:text-white transition-colors"
                >
                  {copied ? "✓ Copied" : "⎘ Copy"}
                </button>
              )}
            </div>

            {/* Generated message */}
            <div className={`flex-1 rounded-lg border p-5 font-mono text-sm leading-relaxed transition-all duration-300 overflow-y-auto ${
              content
                ? "border-white/15 bg-azx-card text-slate-300"
                : "border-azx-border bg-azx-card/50 flex items-center justify-center"
            }`}>
              {content ? (
                <pre className="whitespace-pre-wrap font-mono text-sm text-slate-300 leading-relaxed">
                  {content}
                  {isGenerating && <span className="streaming-cursor" />}
                </pre>
              ) : (
                <div className="text-center text-azx-muted">
                  <div className="text-2xl mb-2">✉</div>
                  <div className="font-mono text-xs tracking-widest">
                    {isGenerating ? "GENERATING..." : "CLICK GENERATE TO CREATE MESSAGE"}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-azx-muted font-mono text-sm">
            Select a contact to generate a message
          </div>
        )}
      </div>
    </div>
  );
}
