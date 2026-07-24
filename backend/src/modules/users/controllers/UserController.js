const UserService = require("../services/UserService");

class UserController {

  async profile(req, res) {

    try {

      const data = await UserService.getProfile(
        req.params.id
      );

      res.json(data);

    } catch (err) {

      res.status(500).json({
        error: err.message
      });

    }

  }

  async username(req, res) {

    try {

      const data =
        await UserService.getByUsername(
          req.params.username
        );

      res.json(data);

    } catch (err) {

      res.status(500).json({
        error: err.message
      });

    }

  }

}

module.exports = new UserController();
