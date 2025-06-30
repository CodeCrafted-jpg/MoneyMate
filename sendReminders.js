import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

// Setup Supabase and Resend clients
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const resend = new Resend(process.env.NEXT_RESEND_KEY);

// ✅ Utility: Get today's date and +3 days
const today = new Date();
const threeDaysFromNow = new Date();
threeDaysFromNow.setDate(today.getDate() + 3);

console.log("🔁 Running reminder script...");

try {
  // 1. Fetch subscriptions ending in the next 3 days
  const { data: subscriptions, error } = await supabase
    .from("subscription")
    .select("*")
    .gte("end_date", today.toISOString())
    .lte("end_date", threeDaysFromNow.toISOString());

  if (error) throw error;

  if (!subscriptions || subscriptions.length === 0) {
    console.log("📭 No subscriptions ending in 3 days.");
  } else {
    console.log(`📬 Found ${subscriptions.length} subscription(s) ending soon.`);

    const dailyLimit = 90; 
    let emailsSentToday = 0;
    const delayInSeconds = 5;
    // -------------------------------------

    for (const sub of subscriptions) {
      // 2. Check if the daily limit has been reached
      if (emailsSentToday >= dailyLimit) {
        console.log(`🛑 Daily email limit of ${dailyLimit} reached. Stopping script.`);
        break; // Exit the loop
      }

      // 3. Validate user email
      if (!sub.user_email) {
        console.log(`⚠️ Skipping: Missing email for subscription ${sub.id}`);
        continue;
      }

      try {
        // 4. Send the email
        const response = await resend.emails.send({
          from: "onboarding@resend.dev", 
          to: sub.user_email,
          subject: "Your subscription is ending soon",
          html: `<p>Hi there,</p><p>Your subscription <strong>${sub.title}</strong> is ending on <strong>${new Date(
            sub.end_date
          ).toLocaleDateString()}</strong>.</p><p>Stay on top of your finances 💸</p>`,
        });

        console.log(`📤 Email sent to ${sub.user_email}`, response?.id || "");
        emailsSentToday++; 

        
        console.log(`⏳ Waiting for ${delayInSeconds} seconds before sending the next email...`);
        await new Promise(resolve => setTimeout(resolve, delayInSeconds * 1000)); 

      } catch (sendError) {
        console.error(`❌ Error sending email to ${sub.user_email}:`, sendError.message || sendError);
      }
    }
  }
} catch (err) {
  console.error("❌ Error in reminder script:", err.message || err);
}