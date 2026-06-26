import User from "../models/user.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    await whook.verify(JSON.stringify(req.body), headers);

    const { data, type } = req.body;

    console.log("Webhook Type:", type);
    console.log("Webhook Data:", data);

    const userData = {
      _id: data.id,
      username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
      email: data.email_addresses?.[0]?.email_address,
      image: data.image_url,
    };

    console.log("User Data:", userData);

    switch (type) {
      case "user.created":
        const user = await User.create(userData);
        console.log("User Saved:", user);
        break;

      case "user.updated":
        await User.findByIdAndUpdate(data.id, userData);
        break;

      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        break;

      default:
        console.log(type);
    }

    res.json({
      success: true,
      message: "Webhook Success",
    });
  } catch (error) {
    console.log("WEBHOOK ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default clerkWebhooks;