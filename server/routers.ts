import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  createConversation,
  getUserConversations,
  getConversation,
  addMessage,
  getConversationMessages,
  updateConversationTitle,
} from "./chat";
import { generateChatResponse } from "./huggingface";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  chat: router({
    // Create a new conversation
    createConversation: protectedProcedure
      .input(z.object({ title: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        return createConversation(ctx.user.id, input.title);
      }),

    // Get all user conversations
    getConversations: protectedProcedure.query(async ({ ctx }) => {
      return getUserConversations(ctx.user.id);
    }),

    // Get a specific conversation with messages
    getConversation: protectedProcedure
      .input(z.object({ conversationId: z.string() }))
      .query(async ({ input }) => {
        const conversation = await getConversation(input.conversationId);
        if (!conversation) throw new Error("Conversation not found");
        
        const messages = await getConversationMessages(input.conversationId);
        return { conversation, messages };
      }),

    // Send a message and get AI response
    sendMessage: protectedProcedure
      .input(
        z.object({
          conversationId: z.string(),
          content: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        // Add user message
        const userMessage = await addMessage(
          input.conversationId,
          "user",
          input.content
        );

        // Get conversation history
        const history = await getConversationMessages(input.conversationId);
        
        // Format messages for Hugging Face API
        const messages = history.map((msg) => ({
          role: msg.role as "user" | "assistant" | "system",
          content: msg.content,
        }));

        // Generate AI response
        const aiResponse = await generateChatResponse(messages);

        // Save AI response
        const assistantMessage = await addMessage(
          input.conversationId,
          "assistant",
          aiResponse
        );

        return {
          userMessage,
          assistantMessage,
        };
      }),

    // Update conversation title
    updateTitle: protectedProcedure
      .input(
        z.object({
          conversationId: z.string(),
          title: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        await updateConversationTitle(input.conversationId, input.title);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
