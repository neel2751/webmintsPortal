"use server";

import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { requireRole } from "@/lib/require-role";
import { TEAM_ROLES } from "@/lib/permissions";

// NOTE: generatePrivateGuide and generateLeadMagnetTitle stay unguarded —
// they are used by the public subscribe / lead magnet flow.

// private guide
export async function generatePrivateGuide(blogTitle, blogContent) {
  const { text } = await generateText({
    model: google("gemini-2.0-flash"),
    system: `You are an expert content creator specializing in transforming blog posts into comprehensive private guides. Your task is to create detailed guides that provide readers with in-depth information, actionable steps, and additional insights that enhance the original blog content. Ensure that the guides are well-structured, easy to follow, and offer valuable takeaways for readers looking to implement the information presented in the blog posts.`,
    prompt: `Write a detailed private guide based on the following blog title and content. The guide should provide in-depth information, actionable steps, and additional insights that complement the blog content. Blog Title: ${blogTitle} Blog Content: ${blogContent} Private Guide:`,
    maxTokens: 2000,
  });
  return text;
}

// lead magnet title
export async function generateLeadMagnetTitle(category, title) {
  const { text } = await generateText({
    model: google("gemini-2.0-flash"),
    system: `You are a world-class marketing copywriter specializing in high-conversion lead magnets.`,
    prompt: `The user is reading a blog post about "${title}" in the category "${category}". 
             Create a compelling, click-worthy title for a FREE PDF lead magnet. 
             
             Rules:
             - Must be under 7 words.
             - Must sound like a high-value resource (Checklist, Guide, Cheat Sheet).
             - Use powerful verbs.
             - Example: "The 10-Step AI Prompting Cheat Sheet".
             - Return ONLY the title text.`,
  });
  return text.trim();
}

// outline
export async function generateBlogOutline(topic) {
  await requireRole(TEAM_ROLES);
  const { text } = await generateText({
    model: google("gemini-2.0-flash"),
    system: `You are an expert content strategist specializing in creating detailed blog outlines that enhance reader engagement and SEO performance.`,
    prompt: `Create a comprehensive blog outline for the topic: "${topic}". 
             The outline should include:
             - An engaging introduction
             - At least 5 main sections with sub-points
             - A conclusion that encourages reader interaction
             
             Format the outline in a clear, organized manner.`,
    maxTokens: 1500,
  });
  return text;
}

// introduction
export async function generateBlogIntro(topic) {
  await requireRole(TEAM_ROLES);
  const { text } = await generateText({
    model: google("gemini-2.0-flash"),
    system: `You are an expert content writer specializing in crafting engaging blog introductions that captivate readers and set the tone for the article.`,
    prompt: `Write a compelling introduction for a blog post on the topic: "${topic}". 
             The introduction should:
             - Grab the reader's attention
             - Clearly state what the blog post will cover
             - Encourage the reader to continue reading`,
    maxTokens: 500,
  });
  return text;
}

// summary or conclusion
export async function generateBlogConclusion(topic) {
  await requireRole(TEAM_ROLES);
  const { text } = await generateText({
    model: google("gemini-2.0-flash"),
    system: `You are an expert content writer specializing in crafting effective blog conclusions that leave a lasting impression on readers.`,
    prompt: `Write a strong conclusion for a blog post on the topic: "${topic}". 
             The conclusion should:
             - Summarize the key points discussed in the blog
             - Reinforce the main message
             - Include a call-to-action to encourage reader engagement`,
    maxTokens: 500,
  });
  return text;
}

// content in json format and html format
export async function generateBlogContent(topic, outline) {
  await requireRole(TEAM_ROLES);
  const { text: contentJson } = await generateText({
    model: google("gemini-2.0-flash"),
    system: `You are an expert content writer specializing in creating detailed blog content based on provided outlines.`,
    prompt: `Using the following outline, write a comprehensive blog post on the topic: "${topic}". 
             Outline: ${outline} 
             
             Format the content in JSON format with sections and subsections.`,
    maxTokens: 4000,
  });

  const { text: contentHtml } = await generateText({
    model: google("gemini-2.0-flash"),
    system: `You are an expert content writer specializing in creating detailed blog content based on provided outlines.`,
    prompt: `Using the following outline, write a comprehensive blog post on the topic: "${topic}". 
             Outline: ${outline} 
             
             Format the content in HTML format with appropriate tags for headings, paragraphs, and lists.`,
    maxTokens: 4000,
  });

  return { contentJson, contentHtml };
}

// generate Headlines for test
export async function generateBlogHeadlines(topic) {
  await requireRole(TEAM_ROLES);
  // const { text } = await generateText({
  //   model: google("gemini-2.0-flash"),
  //   system: `You are a world-class marketing copywriter specializing in high-conversion blog headlines.`,
  //   prompt: `Create 5 compelling and click-worthy blog post headlines for the topic: "${topic}".
  //            Rules:
  //            - Each headline must be under 70 characters.
  //            - Use powerful and engaging language.
  //            - Make sure the headlines are relevant to the topic.

  //            Return the headlines as a numbered list.`,
  //   maxTokens: 1000,
  // });
  const headlines = [
    `10 Proven Strategies to Master ${topic} Today`,
    `The Ultimate Guide to Understanding ${topic}`,
    `How ${topic} Can Transform Your Life in 5 Easy Steps`,
    `Top Secrets About ${topic} You Need to Know`,
    `Unlocking the Power of ${topic}: A Comprehensive Overview`,
  ];
  return headlines;

  // return text.trim().split("\n").map((line) => line.replace(/^\d+\.\s*/, ""));
}

export async function predictBestSendTime() {
  await requireRole(TEAM_ROLES);
  // 1. Get the raw data from Mailchimp
  // const history = await getCampaignAnalytics(); // [{sendTime: Date, openRate: Number, subject: String}, ...]
  const history = [
    {
      sendTime: "2024-10-01T10:00:00Z",
      openRate: 25,
      subject: "Welcome to Our Newsletter!",
    },
    {
      sendTime: "2024-10-03T14:00:00Z",
      openRate: 30,
      subject: "Latest Updates and News",
    },
    {
      sendTime: "2024-10-05T09:00:00Z",
      openRate: 28,
      subject: "Exclusive Offers Just for You",
    },
    {
      sendTime: "2024-10-07T16:00:00Z",
      openRate: 35,
      subject: "How to Maximize Your Benefits",
    },
    {
      sendTime: "2024-10-09T11:00:00Z",
      openRate: 32,
      subject: "Top Tips for Success",
    },
  ];

  if (history.length === 0) return "Not enough data yet. Send more emails!";

  // 2. Format data for Gemini
  const dataSummary = history.map((h) => ({
    day: new Date(h.sendTime).toLocaleDateString("en-US", { weekday: "long" }),
    hour: new Date(h.sendTime).getHours(),
    openRate: h.openRate,
    subject: h.subject,
  }));

  // 3. Ask Gemini for the Insight
  const { text } = await generateText({
    model: google("gemini-2.0-flash"),
    system:
      "You are an Email Marketing Strategist. Analyze campaign data to find the best engagement window.",
    prompt: `Review this campaign history (last 10 emails): ${JSON.stringify(
      dataSummary
    )}
             
             Tasks:
             1. Identify which Day and Hour produced the highest Open Rate.
             2. Suggest the "Optimal Send Window" for the next campaign.
             3. Give a 1-sentence reason why (e.g., "Your audience is most active during mid-week lunch breaks").
             
             Format: Return as JSON with keys: 'bestDay', 'bestHour', 'reason'.`,
  });

  return JSON.parse(text);
}
