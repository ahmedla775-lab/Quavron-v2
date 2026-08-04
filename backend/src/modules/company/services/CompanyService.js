import CompanyRepository from "../repositories/CompanyRepository.js";

class CompanyService {

  async feed(limit = 20) {

    return await CompanyRepository.getFeed(limit);

  }

  async details(id) {

    return await CompanyRepository.getById(id);

  }

  async publish(data) {

    const payload = {

      title: data.title,

      content: data.content,

      type: data.type,

      cover_url: data.cover_url ?? null,

      media_url: data.media_url ?? null,

      published: true,

    };

    return await CompanyRepository.create(payload);

  }

  async edit(id, data) {

    return await CompanyRepository.update(id, data);

  }

  async delete(id) {

    return await CompanyRepository.remove(id);

  }

}

export default new CompanyService();
