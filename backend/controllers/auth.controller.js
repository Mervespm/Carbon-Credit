import Account from "../model/account.model.js";

const generateCompanyCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

export const register = async (req, res) => {
  
  const { email, user_type, company_code } = req.body;
  if (!email || !req.body.password || !req.body.first_name || !req.body.last_name) {
    return res.status(400).json({ message: "All fields are required." });
  }
  

  try {
    const exists = await Account.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists." });

    const userData = {
      ...req.body,
      isApproved: false
    };

    if (user_type === "employee") {
      const employer = await Account.findOne({ company_code, user_type: "employer" });
      if (!employer || employer.approvalStatus !== 'approved') {
        return res.status(400).json({ message: "Invalid or unapproved company code." });
      }
      userData.isApproved = true;
    }

    if (user_type === "employer") {
      userData.company_code = generateCompanyCode();
    }

    const newUser = new Account(userData);
    await newUser.save();
    res.status(201).json({ message: "Account created", user: newUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Account.findOne({ email, password });

    if (!user) {
      return res.status(404).json({ message: "Invalid credentials." });
    }

    // Employer check approvalStatus
    if (user.user_type === "employer") {
      if (user.approvalStatus === "pending") {
        return res.status(403).json({ message: "Your account is awaiting approval." });
      }
      if (user.approvalStatus === "rejected") {
        return res.status(403).json({ message: "Your registration was rejected." });
      }
    }

    // Employee must be approved by employer
    if (user.user_type === "employee" && !user.isApproved) {
      return res.status(403).json({ message: "Your account is not yet approved by your employer." });
    }

    req.session.user = {
      user_id: user._id,
      role: user.user_type
    };
    user.cookie = req.session.id;
    await user.save();

    res.status(200).json({ message: "Login successful", role: user.user_type });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Failed to log out" });
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out" });
  });
};

export const validateCompanyCode = async (req, res) => {
  try {
    const employer = await Account.findOne({
      company_code: req.body.company_code,
      user_type: 'employer',
      isApproved: true,
    });

    if (!employer) {
      return res.status(400).json({ message: 'Invalid or unapproved company code.' });
    }

    res.status(200).json({ message: 'Company code is valid.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await Account.findById(req.session.user.user_id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.user_type === 'employee') {
      const employer = await Account.findOne({
        company_code: user.company_code,
        user_type: 'employer',
        isApproved: true
      });

      if (!employer || !employer.officeLocation) {
        return res.status(404).json({ message: 'Employer office location not found' });
      }

      return res.status(200).json({
        first_name: user.first_name,
        homeLocation: user.homeLocation,
        officeLocation: employer.officeLocation,
        company: employer.company_name,
        role: user.user_type
      });
    }

    res.status(200).json({
      first_name: user.first_name,
      officeLocation: user.officeLocation,
      role: user.user_type,
      company_code: user.company_code,
      isApproved: user.isApproved
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get profile' });
  }
};
