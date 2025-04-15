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
  
      console.log("Employer approved:", updated.email);
      res.status(200).json({ message: "Employer approved successfully.", employer: updated });
    } catch (err) {
      console.error("Approve Employer Error:", err);
      res.status(500).json({ message: err.message });
    }
  };
  