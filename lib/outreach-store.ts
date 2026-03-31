import type { OutreachContact } from "@/types";

const STORAGE_KEY = "gtm-outreach-contacts";

export function getContacts(): OutreachContact[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveContacts(contacts: OutreachContact[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
}

export function addContacts(newContacts: OutreachContact[]): void {
  const existing = getContacts();
  // Deduplicate by name+company
  const deduped = [...existing];
  for (const c of newContacts) {
    const exists = deduped.some(e => e.name === c.name && e.company === c.company);
    if (!exists) deduped.push(c);
  }
  saveContacts(deduped);
}

export function removeContact(id: string): void {
  saveContacts(getContacts().filter(c => c.id !== id));
}

export function clearContacts(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function parseContactsFromText(
  text: string,
  company: string,
  briefContext: { signals: string; painPoints: string; solutionFit: string }
): OutreachContact[] {
  const contacts: OutreachContact[] = [];
  // Split on numbered list items
  const items = text.split(/\n(?=\d+\.)/).filter(l => l.trim());

  for (const item of items) {
    const nameMatch = item.match(/\*\*([^*]+)\*\*/);
    if (!nameMatch) continue;

    const name = nameMatch[1].trim();
    // Remove the "1. **Name**," prefix to get rest
    const rest = item.replace(/^\d+\.\s+\*\*[^*]+\*\*,?\s*/, "");
    const dashIdx = rest.search(/[—–]/);
    const title = dashIdx > 0 ? rest.slice(0, dashIdx).trim().replace(/,$/, "") : "";
    const description = dashIdx >= 0 ? rest.slice(dashIdx + 1).trim() : rest.trim();

    contacts.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name,
      title,
      company,
      description,
      addedAt: new Date().toISOString(),
      briefContext,
    });
  }

  return contacts;
}
