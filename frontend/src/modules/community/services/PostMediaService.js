import { supabase } from "../../../lib/supabase";

class PostMediaService {

  async upload(file, userId) {

    const extension = file.name.split(".").pop();

    const fileName = `${userId}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${extension}`;

    const { error } = await supabase.storage
      .from("post-media")
      .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from("post-media")
      .getPublicUrl(fileName);

    return {
      url: data.publicUrl,
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type,
    };

  }

  async attachMedia(postId, media) {

    let type = "file";

    if (media.mime_type?.startsWith("image/")) {
      type = "image";
    } else if (media.mime_type?.startsWith("video/")) {
      type = "video";
    } else if (media.mime_type?.startsWith("audio/")) {
      type = "audio";
    }

    const { data, error } = await supabase
      .from("post_media")
      .insert({
        post_id: postId,
        type,
        url: media.url,
        file_name: media.file_name,
        file_size: media.file_size,
        mime_type: media.mime_type,
      })
      .select()
      .single();

    if (error) throw error;

    return data;

  }

  async uploadAll(postId, files, userId) {

    const uploadedMedia = [];

    for (const file of files) {

      const media = await this.upload(file, userId);

      console.log("UPLOADED:", media);

      const record = await this.attachMedia(postId, media);

      console.log("ATTACHED:", record);

      uploadedMedia.push(record);

    }

    return uploadedMedia;

  }

}

export default new PostMediaService();
