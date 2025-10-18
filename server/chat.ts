import { eq, desc } from "drizzle-orm";
import { conversations, messages, InsertConversation, InsertMessage } from "../drizzle/schema";
import { getDb } from "./db";
import { randomBytes } from "crypto";

/**
 * Generate a unique ID for database records
 */
function generateId(): string {
  return randomBytes(16).toString("hex");
}

/**
 * Create a new conversation
 */
export async function createConversation(userId: string, title?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const id = generateId();
  const conversation: InsertConversation = {
    id,
    userId,
    title: title || "New conversation",
  };

  await db.insert(conversations).values(conversation);
  return conversation;
}

/**
 * Get all conversations for a user
 */
export async function getUserConversations(userId: string) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(conversations)
    .where(eq(conversations.userId, userId))
    .orderBy(desc(conversations.updatedAt));
}

/**
 * Get a specific conversation
 */
export async function getConversation(conversationId: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, conversationId))
    .limit(1);

  return result[0] || null;
}

/**
 * Add a message to a conversation
 */
export async function addMessage(
  conversationId: string,
  role: "user" | "assistant" | "system",
  content: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const id = generateId();
  const message: InsertMessage = {
    id,
    conversationId,
    role,
    content,
  };

  await db.insert(messages).values(message);

  // Update conversation's updatedAt timestamp
  await db
    .update(conversations)
    .set({ updatedAt: new Date() })
    .where(eq(conversations.id, conversationId));

  return message;
}

/**
 * Get all messages for a conversation
 */
export async function getConversationMessages(conversationId: string) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(messages.createdAt);
}

/**
 * Update conversation title
 */
export async function updateConversationTitle(conversationId: string, title: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(conversations)
    .set({ title, updatedAt: new Date() })
    .where(eq(conversations.id, conversationId));
}

