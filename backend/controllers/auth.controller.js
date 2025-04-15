import Account from "../model/account.model.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = "super_secret_key"; 


const generateCompanyCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();



export const register = async (req, res) => {
  console.log("REGISTER BODY:", req.body);
  const { email, user_type, company_code } = req.body;

  try {

    const exists = await Account.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists." });

    const userData = {
      ...req.body,
      isApproved: false 
    };


    if (user_type === "employee") {
      const employer = await Account.findOne({ company_code, user_type: "employer" });
      if (!employer) return res.status(400).json({ message: "Invalid company code." });
      userData.isApproved = true;
    }


    if (user_type === "employer") {
      userData.company_code = generateCompanyCode();
    }

    const newUser = new Account(userData);
    await newUser.save();

    console.log("USER CREATED:", newUser);
    res.status(201).json({ message: "Account created", user: newUser });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Account.findOne({ email, password });

    if (!user) return res.status(404).json({ message: "Invalid credentials." });
    if (!user.isApproved) return res.status(403).json({ message: "Account not approved yet." });

    const token = jwt.sign(
      { id: user._id, role: user.user_type },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        role: user.user_type,
        first_name: user.first_name,
        company_code: user.company_code,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

export const validateCompanyCode = async (req, res) => {
  const { company_code } = req.body;

  try {
    const employer = await Account.findOne({
      company_code,
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
    const employee = await Account.findById(req.user.id);
    if (!employee || employee.user_type !== 'employee') {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const employer = await Account.findOne({
      company_code: employee.company_code,
      user_type: 'employer',
      isApproved: true
    });

    if (!employer || !employer.officeLocation) {
      return res.status(404).json({ message: 'Employer office location not found' });
    }

    res.status(200).json({
      first_name: employee.first_name,
      homeLocation: employee.homeLocation,
      officeLocation: employer.officeLocation,
      company: employer.company_name,
      role: employee.user_type
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
};
