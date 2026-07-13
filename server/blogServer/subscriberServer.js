"use server";

import { connect } from "@/db/db";
import BlogPostModel from "@/models/blogModel";
import LeadMagnetModel from "@/models/leadMagnetModel";
import SubscriberModel from "@/models/subscriberModel";
import { sendWelcomeEmail } from "../emailServer";
import { generatePrivateGuide } from "../aiServer/ai-genetor";
import { requireRole } from "@/lib/require-role";
import { TEAM_ROLES } from "@/lib/permissions";

export async function subscribeUser(email, category, slug) {
  try {
    await connect();
    await SubscriberModel.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      {
        $setOnInsert: {
          email: email.toLowerCase().trim(),
          interests: category ? [category] : [],
          status: "subscribed",
          isActive: true,
          source: slug ? `blog:${slug}` : "website",
          subscribedAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );
    return { success: true, message: "Subscription successful" };
  } catch (error) {
    console.error("Error subscribing user:", error);
    return { success: false, error: error.message };
  }
}

export async function handleSubscription({ id, email, source, postTitle }) {
  await connect();

  // 1. Get the blog content to feed the AI
  const blog = await BlogPostModel.findById(id);

  // 2. Create the subscriber
  const sub = await SubscriberModel.findOneAndUpdate(
    { email },
    {
      $set: { email },
      $addToSet: { interests: blog.category },
      $setOnInsert: {
        source,
        status: "subscribed",
        isActive: true,
        subscribedAt: new Date(),
      },
    },
    { upsert: true, new: true }
  );

  // 3. Generate the Custom Guide via AI
  //   const guideContent = await generatePrivateGuide(blog.title, blog.contentHtml);
  const accessKey = crypto.randomUUID();

  // 4. Save the Lead Magnet
  await LeadMagnetModel.create({
    subscriberId: sub._id,
    title: `The Ultimate Guide to ${blog.category}`,
    contentHtml: "<!-- AI Generated Content Placeholder -->",
    accessKey: accessKey,
    category: blog.category,
  });

  // 5. Email it to them!
  await sendWelcomeEmail(email, postTitle, accessKey);
}

export async function isEmailSubscribed(email) {
  try {
    await connect();
    const subscriber = await SubscriberModel.findOne({
      email: email.toLowerCase().trim(),
      status: "subscribed",
      isActive: true,
    });
    return subscriber ? true : false;
  } catch (error) {
    console.error("Error checking subscription status:", error);
    return false;
  }
}
export async function unsubscribeUser(email) {
  try {
    await connect();
    const result = await SubscriberModel.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { status: "unsubscribed", isActive: false },
      { new: true }
    );
    if (result) {
      return { success: true, message: "Unsubscription successful" };
    } else {
      return { success: false, message: "Email not found" };
    }
  } catch (error) {
    console.error("Error unsubscribing user:", error);
    return { success: false, error: error.message };
  }
}
export async function getSubscriberCount() {
  try {
    await requireRole(TEAM_ROLES);
    await connect();
    const count = await SubscriberModel.countDocuments({
      status: "subscribed",
      isActive: true,
    });
    return count;
  } catch (error) {
    console.error("Error getting subscriber count:", error);
    return 0;
  }
}
export async function getSubscribersByCategory(category) {
  try {
    await requireRole(TEAM_ROLES);
    await connect();
    const subscribers = await SubscriberModel.find({
      interests: category,
      status: "subscribed",
      isActive: true,
    }).select("email");
    return subscribers;
  } catch (error) {
    console.error("Error getting subscribers by category:", error);
    return [];
  }
}
export async function getAllSubscribers() {
  try {
    await requireRole(TEAM_ROLES);
    await connect();
    const subscribers = await SubscriberModel.find({
      status: "subscribed",
      isActive: true,
    });
    return subscribers;
  } catch (error) {
    console.error("Error getting all subscribers:", error);
    return [];
  }
}

export async function getSubscriberByEmail(email) {
  try {
    await connect();
    const subscriber = await SubscriberModel.findOne({
      email: email.toLowerCase().trim(),
    });
    return subscriber;
  } catch (error) {
    console.error("Error getting subscriber by email:", error);
    return null;
  }
}

export async function reactivateSubscriber(email) {
  try {
    await requireRole(TEAM_ROLES);
    await connect();
    const subscriber = await SubscriberModel.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { status: "subscribed", isActive: true },
      { new: true }
    );
    if (subscriber) {
      return { success: true, message: "Subscriber reactivated" };
    } else {
      return { success: false, message: "Subscriber not found" };
    }
  } catch (error) {
    console.error("Error reactivating subscriber:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteSubscriber(email) {
  try {
    await requireRole(TEAM_ROLES);
    await connect();
    const result = await SubscriberModel.findOneAndDelete({
      email: email.toLowerCase().trim(),
    });
    if (result) {
      return { success: true, message: "Subscriber deleted" };
    } else {
      return { success: false, message: "Subscriber not found" };
    }
  } catch (error) {
    console.error("Error deleting subscriber:", error);
    return { success: false, error: error.message };
  }
}
export async function updateSubscriberInterests(email, interests) {
  try {
    await requireRole(TEAM_ROLES);
    await connect();
    const subscriber = await SubscriberModel.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { interests: interests },
      { new: true }
    );
    if (subscriber) {
      return { success: true, message: "Interests updated", subscriber };
    } else {
      return { success: false, message: "Subscriber not found" };
    }
  } catch (error) {
    console.error("Error updating subscriber interests:", error);
    return { success: false, error: error.message };
  }
}
export async function getSubscribersSubscribedAfter(date) {
  try {
    await requireRole(TEAM_ROLES);
    await connect();
    const subscribers = await SubscriberModel.find({
      subscribedAt: { $gt: date },
      status: "subscribed",
      isActive: true,
    });
    return subscribers;
  } catch (error) {
    console.error("Error getting subscribers by date:", error);
    return [];
  }
}
export async function getInactiveSubscribers(sinceDate) {
  try {
    await requireRole(TEAM_ROLES);
    await connect();
    const subscribers = await SubscriberModel.find({
      lastEngagedAt: { $lt: sinceDate },
      status: "subscribed",
      isActive: true,
    });
    return subscribers;
  } catch (error) {
    console.error("Error getting inactive subscribers:", error);
    return [];
  }
}
export async function updateSubscriberLastEngaged(email) {
  try {
    await connect();
    const subscriber = await SubscriberModel.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { lastEngagedAt: new Date() },
      { new: true }
    );
    if (subscriber) {
      return {
        success: true,
        message: "Last engaged date updated",
        subscriber,
      };
    } else {
      return { success: false, message: "Subscriber not found" };
    }
  } catch (error) {
    console.error("Error updating last engaged date:", error);
    return { success: false, error: error.message };
  }
}

export async function countSubscribersByCategory(category) {
  try {
    await requireRole(TEAM_ROLES);
    await connect();
    const count = await SubscriberModel.countDocuments({
      interests: category,
      status: "subscribed",
      isActive: true,
    });
    return count;
  } catch (error) {
    console.error("Error counting subscribers by category:", error);
    return 0;
  }
}
export async function getRecentSubscribers(limit = 10) {
  try {
    await requireRole(TEAM_ROLES);
    await connect();
    const subscribers = await SubscriberModel.find({
      status: "subscribed",
      isActive: true,
    })
      .sort({ subscribedAt: -1 })
      .limit(limit);
    return subscribers;
  } catch (error) {
    console.error("Error getting recent subscribers:", error);
    return [];
  }
}
export async function getLeadMagnetsBySubscriber(email) {
  try {
    await connect();
    const subscriber = await SubscriberModel.findOne({
      email: email.toLowerCase().trim(),
    });
    if (!subscriber) {
      return [];
    }
    const leadMagnets = await LeadMagnetModel.find({
      subscriberId: subscriber._id,
    });
    return leadMagnets;
  } catch (error) {
    console.error("Error getting lead magnets by subscriber:", error);
    return [];
  }
}
export async function getTotalLeadMagnetsCount() {
  try {
    await requireRole(TEAM_ROLES);
    await connect();
    const count = await LeadMagnetModel.countDocuments();
    return count;
  } catch (error) {
    console.error("Error getting total lead magnets count:", error);
    return 0;
  }
}

export async function deactivateSubscriber(email) {
  try {
    await requireRole(TEAM_ROLES);
    await connect();
    const subscriber = await SubscriberModel.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { isActive: false },
      { new: true }
    );
    if (subscriber) {
      return { success: true, message: "Subscriber deactivated" };
    } else {
      return { success: false, message: "Subscriber not found" };
    }
  } catch (error) {
    console.error("Error deactivating subscriber:", error);
    return { success: false, error: error.message };
  }
}
export async function activateSubscriber(email) {
  try {
    await requireRole(TEAM_ROLES);
    await connect();
    const subscriber = await SubscriberModel.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { isActive: true },
      { new: true }
    );
    if (subscriber) {
      return { success: true, message: "Subscriber activated" };
    } else {
      return { success: false, message: "Subscriber not found" };
    }
  } catch (error) {
    console.error("Error activating subscriber:", error);
    return { success: false, error: error.message };
  }
}
export async function getSubscribersWithLeadMagnets() {
  try {
    await requireRole(TEAM_ROLES);
    await connect();
    const subscribers = await SubscriberModel.aggregate([
      {
        $lookup: {
          from: "leadmagnets",
          localField: "_id",
          foreignField: "subscriberId",
          as: "leadMagnets",
        },
      },
      {
        $match: {
          leadMagnets: { $ne: [] },
          status: "subscribed",
          isActive: true,
        },
      },
    ]);
    return subscribers;
  } catch (error) {
    console.error("Error getting subscribers with lead magnets:", error);
    return [];
  }
}
export async function getLeadMagnetCountByCategory(category) {
  try {
    await requireRole(TEAM_ROLES);
    await connect();
    const count = await LeadMagnetModel.countDocuments({
      category: category,
    });
    return count;
  } catch (error) {
    console.error("Error getting lead magnet count by category:", error);
    return 0;
  }
}
export async function getAllLeadMagnets() {
  try {
    await requireRole(TEAM_ROLES);
    await connect();
    const leadMagnets = await LeadMagnetModel.find();
    return leadMagnets;
  } catch (error) {
    console.error("Error getting all lead magnets:", error);
    return [];
  }
}
