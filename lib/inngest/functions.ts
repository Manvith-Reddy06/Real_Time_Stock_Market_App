import { getNews } from "../actions/finnhub.actions";
import { getAllUsersForNewsEmail } from "../actions/user.actions";
import { getWatchlistSymbolsByEmail } from "../actions/watchlist.actions";
import { NO_MARKET_NEWS } from "../constants";
import { sendNewsSummaryEmail, sendWelcomeEmail } from "../nodemailer";
import { inngest } from "./client";
import {
  NEWS_SUMMARY_EMAIL_PROMPT,
  PERSONALIZED_WELCOME_EMAIL_PROMPT,
} from "./prompts";

type UserNewsPayload = {
  user: UserForNewsEmail;
  articles: MarketNewsArticle[];
};

export const sendSignUpEmail = inngest.createFunction(
  {
    id: "sign-up-email",
    triggers: [
      {
        event: "app/user/created",
      },
    ],
  },

  async ({ event, step }) => {
    const userProfile = `
      - Country: ${event.data.country}
      - Investment Goals: ${event.data.investmentGoals}
      - Risk Tolerance: ${event.data.riskTolerance}
      - Preferred Industry: ${event.data.preferredIndustry}
    `;

    const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace(
      "{{userProfile}}",
      userProfile
    );

    const response = await step.ai.infer("generate-welcome-intro", {
      model: step.ai.models.gemini({
        model: "gemini-2.5-flash-lite",
      }),

      body: {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      },
    });

    await step.run("send-welcome-email", async () => {
      const introText =
        response.candidates?.[0]?.content?.parts?.find(
          (part) => "text" in part
        )?.text ?? "Thanks for joining our app.";

      const { email, name } = event.data;

      return await sendWelcomeEmail({
        email,
        name,
        intro: introText,
      });
    });

    return {
      success: true,
      message: "Welcome email sent successfully",
    };
  }
);

export const sendDailyNewsSummary = inngest.createFunction(
  {
    id: "daily-news-summary",
    triggers: [
      {
        event: "app/send.daily.news",
      },
      {
        cron: "0 12 * * *",
      },
    ],
  },
  async ({ step }) => {
    const users = await step.run("get-all-users", getAllUsersForNewsEmail);

    if (!users || users.length === 0) {
      return {
        success: false,
        message: "No users found for news email",
      };
    }

    const perUser = await step.run("prepare", async (): Promise<UserNewsPayload[]> => {
      const results: UserNewsPayload[] = [];

      for (const user of users as UserForNewsEmail[]) {
        try {
          const symbols = await getWatchlistSymbolsByEmail(user.email);
          let articles = await getNews(symbols);
          articles = (articles || []).slice(0, 6);

          if (!articles || articles.length === 0) {
            articles = await getNews();
            articles = (articles || []).slice(0, 6);
          }

          results.push({ user, articles });
        } catch (error) {
          console.error(
            "daily-news: error preparing user news",
            user.email,
            error
          );
          results.push({ user, articles: [] });
        }
      }

      return results;
    });

    for (const { user, articles } of perUser) {
      let newsContent = NO_MARKET_NEWS;

      if (articles.length > 0) {
        const newsData = JSON.stringify(articles, null, 2);
        const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace(
          "{{newsData}}",
          newsData
        );

        const response = await step.ai.infer(
          `generate-news-summary-${user.id}`,
          {
            model: step.ai.models.gemini({
              model: "gemini-2.5-flash-lite",
            }),
            body: {
              contents: [
                {
                  role: "user",
                  parts: [{ text: prompt }],
                },
              ],
            },
          }
        );

        newsContent =
          response.candidates?.[0]?.content?.parts?.find(
            (part) => "text" in part
          )?.text ?? NO_MARKET_NEWS;
      }

      await step.run(`send-email-${user.id}`, async () => {
        return sendNewsSummaryEmail({
          email: user.email,
          name: user.name,
          newsContent,
        });
      });
    }

    return {
      success: true,
      message: `Processed ${perUser.length} users`,
    };
  }
);
