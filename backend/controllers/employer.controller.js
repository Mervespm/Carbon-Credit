import Account from "../model/account.model.js";

export const getPendingEmployers = async (req, res) => {
  try {
    const employers = await Account.find({ user_type: "employer", isApproved: false });
    res.status(200).json(employers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const approveEmployer = async (req, res) => {
  try {
    const updated = await Account.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!updated || updated.user_type !== "employer") {
      return res.status(404).json({ message: "Employer not found." });
    }

    res.status(200).json({ message: "Employer approved successfully", employer: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const disapproveEmployer = async (req, res) => {
  try {
    const updated = await Account.findByIdAndUpdate(
      req.params.id,
      { approvalStatus: "rejected" },
      { new: true }
    );

    if (!updated || updated.user_type !== "employer") {
      return res.status(404).json({ message: "Employer not found." });
    }

    res.status(200).json({ message: "Employer rejected", employer: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const getEmployees = async (req, res) => {
  try {
    const employer = await Account.findById(req.session.user.user_id);
    const employees = await Account.find({ company_code: employer.company_code, user_type: "employee" });
    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ message: "Failed to get employees" });
  }
};


export const approveEmployee = async (req, res) => {
  try {
    await Account.findByIdAndUpdate(req.params.id, { isApproved: true });
    res.status(200).json({ message: "Employee approved" });
  } catch (err) {
    res.status(500).json({ message: "Failed to approve employee" });
  }
};

export const disapproveEmployee = async (req, res) => {
  try {
    await Account.findByIdAndUpdate(req.params.id, { isApproved: false });
    res.status(200).json({ message: "Employee disapproved" });
  } catch (err) {
    res.status(500).json({ message: "Failed to disapprove employee" });
  }
};
