import { ChatMessage, Conversation, NotificationItem, User } from '../types';
import { supabase } from '../lib/supabase';

class CommunicationService {
  private inMemoryNotifications: NotificationItem[] = [];
  private inMemoryConversations: Conversation[] = [];
  private inMemoryMessages: Record<string, ChatMessage[]> = {};

  async getNotifications(userId?: string): Promise<NotificationItem[]> {
    // Only query Supabase when there is an authenticated user (not guest, empty, or undefined)
    if (!userId || userId === 'guest') {
      return this.inMemoryNotifications.filter((n) => n.userId === userId);
    }

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false });

      if (error) {
        console.warn('Could not query notifications from Supabase:', error.message);
        return this.inMemoryNotifications.filter((n) => n.userId === userId);
      }

      if (data) {
        return data.map((n: any) => ({
          id: n.id,
          userId: n.user_id || userId,
          title: n.title,
          message: n.message || n.content || '',
          timestamp: n.timestamp || n.created_at
            ? new Date(n.timestamp || n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'Just now',
          date: n.timestamp || n.created_at ? new Date(n.timestamp || n.created_at).toLocaleDateString() : 'Today',
          read: Boolean(n.read ?? n.is_read),
          type: (['Challenge', 'Project', 'Collaboration', 'Approval', 'System'].includes(n.type)
            ? n.type
            : 'Challenge') as NotificationItem['type'],
          actionUrl: n.action_url || n.link,
        }));
      }
    } catch (err: any) {
      console.warn('Could not query notifications from Supabase:', err?.message || err);
    }

    return this.inMemoryNotifications.filter((n) => n.userId === userId);
  }

  async markNotificationRead(id: string): Promise<void> {
    try {
      await supabase.from('notifications').update({ read: true }).eq('id', id);
    } catch (err: any) {
      console.warn('Could not mark notification read in Supabase:', err?.message || err);
    }
    const item = this.inMemoryNotifications.find((n) => n.id === id);
    if (item) item.read = true;
  }

  async markAllNotificationsRead(userId?: string): Promise<void> {
    if (userId && userId !== 'guest') {
      try {
        await supabase
          .from('notifications')
          .update({ read: true })
          .eq('user_id', userId);
      } catch (err: any) {
        console.warn('Could not mark all notifications read in Supabase:', err?.message || err);
      }
    }
    this.inMemoryNotifications.forEach((n) => (n.read = true));
  }

  async createNotification(params: {
    userId: string;
    title: string;
    message: string;
    type?: NotificationItem['type'];
    actionUrl?: string;
  }): Promise<NotificationItem> {
    const item: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: params.userId,
      title: params.title,
      message: params.message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Just now',
      read: false,
      type: params.type || 'Challenge',
      actionUrl: params.actionUrl,
    };

    if (params.userId && params.userId !== 'guest') {
      try {
        await supabase.from('notifications').insert({
          user_id: params.userId,
          title: params.title,
          message: params.message,
          type: params.type || 'Challenge',
          action_url: params.actionUrl || null,
          read: false,
          timestamp: new Date().toISOString(),
        });
      } catch (err: any) {
        console.warn('Could not persist notification in Supabase:', err?.message || err);
      }
    }

    this.inMemoryNotifications.unshift(item);
    return item;
  }

  async getConversations(challengeId?: string): Promise<Conversation[]> {
    try {
      let query = supabase.from('conversations').select('*').order('updated_at', { ascending: false });
      if (challengeId) {
        query = query.eq('challenge_id', challengeId);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map((c: any) => ({
          id: c.id,
          title: c.title || c.project_title || 'Civic Collaboration',
          participants: c.participants || [],
          lastMessage: c.last_message || '',
          lastMessageTime: c.updated_at
            ? new Date(c.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'Recently',
          unreadCount: c.unread_count || 0,
          challengeId: c.challenge_id || challengeId,
        }));
      }
    } catch (err) {
      console.warn('Could not query conversations from Supabase:', err);
    }
    return [...this.inMemoryConversations];
  }

  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map((m: any) => ({
          id: m.id,
          conversationId: m.conversation_id,
          senderId: m.sender_id,
          senderName: m.sender_name || 'Participant',
          senderRole: m.sender_role || 'citizen',
          senderOrg: m.sender_org,
          timestamp: m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now',
          text: m.text || m.content || '',
        }));
      }
    } catch (err) {
      console.warn('Could not query messages from Supabase:', err);
    }
    return this.inMemoryMessages[conversationId] || [];
  }

  async sendMessage(
    conversationId: string,
    sender: User,
    text: string,
    challengeId?: string
  ): Promise<ChatMessage> {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: sender.id,
      senderName: sender.name,
      senderRole: sender.role,
      senderOrg: sender.organization || sender.designation,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text,
    };

    if (!this.inMemoryMessages[conversationId]) {
      this.inMemoryMessages[conversationId] = [];
    }
    this.inMemoryMessages[conversationId].push(newMsg);

    try {
      await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: sender.id,
        sender_name: sender.name,
        sender_role: sender.role,
        sender_org: sender.organization || sender.designation,
        content: text,
        challenge_id: challengeId || null,
        created_at: new Date().toISOString(),
      });
      await supabase.from('conversations').upsert({
        id: conversationId,
        last_message: text,
        challenge_id: challengeId || null,
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Could not persist message in Supabase:', err);
    }

    return newMsg;
  }
}

export const communicationService = new CommunicationService();
