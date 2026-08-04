const repository = require("../repositories/company.repository");

class CompanyService {
  async feed() {
    const { data, error } = await repository.getFeed();

    if (error) throw error;

    return data;
  }

  async create(post) {
    const { data, error } = await repository.create(post);

    if (error) throw error;

    return data;
  }

  async update(id, values) {
    const { data, error } = await repository.update(id, values);

    if (error) throw error;

    return data;
  }

  async remove(id) {
    const { error } = await repository.remove(id);

    if (error) throw error;

    return true;
  }
}

module.exports = new CompanyService();
