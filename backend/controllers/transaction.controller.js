// backend/controllers/transaction.controller.js
import Account from "../model/account.model.js";
import Transaction from "../model/transaction.model.js";

export const sellCredits = async (req, res) => {
  try {
    const sellerId = req.session.user.user_id;
    const { buyerEmail, credits } = req.body;

    if (!buyerEmail || !credits || credits <= 0) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const seller = await Account.findById(sellerId);
    const buyer = await Account.findOne({ email: buyerEmail });

    if (!buyer || buyer.user_type !== 'employer') {
      return res.status(404).json({ message: "Buyer not found or not an employer" });
    }

    const sellerTrips = await Account.find({ company_code: seller.company_code, user_type: 'employee' });
    const allTrips = await Promise.all(sellerTrips.map(emp => Trip.find({ userId: emp._id })));
    const sellerCredits = allTrips.flat().reduce((sum, t) => sum + (t.creditsEarned || 0), 0);

    const sellerTransactions = await Transaction.find({ sellerId });
    const soldCredits = sellerTransactions.reduce((sum, tx) => sum + tx.credits, 0);
    const availableCredits = sellerCredits - soldCredits;

    if (availableCredits < credits) {
      return res.status(400).json({ message: "Not enough available credits to sell" });
    }

    const tx = new Transaction({ sellerId, buyerId: buyer._id, credits });
    await tx.save();

    return res.status(201).json({ message: "Credits sold successfully", tx });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Trade failed" });
  }
};
