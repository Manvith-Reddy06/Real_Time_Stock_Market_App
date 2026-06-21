import {serve} from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { sendDailyNewsSummary, sendSignUpEmail } from "@/lib/inngest/functions";


// exposing out inngest via a nextjs api route to make these functions callable via our app
// now nextjs will handle al our incoming events automatically
//functions are our backgroung jobs
// write these functions inside lib/inngest/functions.ts
export const{GET,POST,PUT}=serve({
    client:inngest,
    functions:[sendSignUpEmail, sendDailyNewsSummary],
})