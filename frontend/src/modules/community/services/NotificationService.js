import { supabase } from "../../../lib/supabase";

class NotificationService {

  async getNotifications(userId) {

    return await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", {
        ascending: false,
      });

  }

  async createNotification(values) {

    return await supabase
      .from("notifications")
      .insert(values)
      .select()
      .single();

  }

  async markAsRead(id) {

    return await supabase
      .from("notifications")
      .update({
        is_read: true,
      })
      .eq("id", id);

  }

  async markAllAsRead(userId) {

    return await supabase
      .from("notifications")
      .update({
        is_read: true,
      })
      .eq("user_id", userId)
      .eq("is_read", false);

  }

  async deleteNotification(id) {

    return await supabase
      .from("notifications")
      .delete()
      .eq("id", id);

  }

}

export default new NotificationService();
