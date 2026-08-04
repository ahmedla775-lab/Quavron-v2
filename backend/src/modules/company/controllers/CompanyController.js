import CompanyService from "../services/CompanyService.js";

class CompanyController {

  async feed(req, res, next) {

    try {

      const limit = Number(req.query.limit ?? 20);

      const { data, error } =
        await CompanyService.feed(limit);

      if (error) throw error;

      res.json({
        success: true,
        data,
      });

    } catch (error) {

      next(error);

    }

  }

  async details(req, res, next) {

    try {

      const { data, error } =
        await CompanyService.details(req.params.id);

      if (error) throw error;

      res.json({
        success: true,
        data,
      });

    } catch (error) {

      next(error);

    }

  }

  async publish(req, res, next) {

    try {

      const { data, error } =
        await CompanyService.publish(req.body);

      if (error) throw error;

      res.status(201).json({
        success: true,
        data,
      });

    } catch (error) {

      next(error);

    }

  }

  async update(req, res, next) {

    try {

      const { data, error } =
        await CompanyService.edit(
          req.params.id,
          req.body
        );

      if (error) throw error;

      res.json({
        success: true,
        data,
      });

    } catch (error) {

      next(error);

    }

  }

  async remove(req, res, next) {

    try {

      const { error } =
        await CompanyService.delete(req.params.id);

      if (error) throw error;

      res.json({
        success: true,
      });

    } catch (error) {

      next(error);

    }

  }

}

export default new CompanyController();
