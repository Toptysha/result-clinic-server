const Application = require("../models/Application");

async function addApplication(date, name, phone, problem) {
  return await Application.create({ date, name, phone, problem });
}

async function getApplications(search = "", limit = 10, page = 1) {
  const [applications, countApplications] = await Promise.all([
    Application.find({
      $or: [
        { date: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { problem: { $regex: search, $options: "i" } },
      ],
    })
      .limit(limit)
      .skip(limit * (page - 1))
      .sort({ createdAt: -1 }),
    Application.countDocuments(
      { date: { $regex: search, $options: "i" } } || {
          name: { $regex: search, $options: "i" },
        } || { phone: { $regex: search, $options: "i" } } || {
          problem: { $regex: search, $options: "i" },
        }
    ),
  ]);

  return {
    applications,
    lastPage: Math.ceil(countApplications / limit),
  };
}

module.exports = { addApplication, getApplications };
