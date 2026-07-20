const QCEService = require("../services/QCEService");

class QCEController {
  async feed(req, res) {
    const data = await QCEService.getFeed(req.query);

    res.json({
      success: true,
      data,
    });
  }

  async trending(req, res) {
    const data = await QCEService.getTrending(req.query);

    res.json({
      success: true,
      data,
    });
  }

  async search(req, res) {
    const data = await QCEService.search(
      req.query.q || "",
      req.query
    );

    res.json({
      success: true,
      data,
    });
  }
}

module.exports = new QCEController();
