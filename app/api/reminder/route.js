// app/api/reminders/route.js

import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export const dynamic = 'force-dynamic';

export async function GET(req, res) {
  // Setup Supabase and Resend clients
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const resend = new Resend(process.env.NEXT_RESEND_KEY);

  // Utility: Get today's date and +3 days
  const today = new Date();
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(today.getDate() + 3);

  console.log("🔁 Running reminder script...");

  try {
    // 1. Fetch subscriptions ending soon that have NOT had a reminder sent yet
    const { data: subscriptions, error } = await supabase
      .from("subscription")
      .select("*")
      .eq("reminder_sent", false) 
      .gte("end_date", today.toISOString())
      .lte("end_date", threeDaysFromNow.toISOString());

    if (error) throw error;

    if (!subscriptions || subscriptions.length === 0) {
      console.log("📭 No new subscriptions ending in 3 days that need a reminder.");
      return new Response("No new subscriptions ending soon.", { status: 200 });
    } else {
      console.log(`📬 Found ${subscriptions.length} subscription(s) ending soon that need a reminder.`);

      // --- Limit and Delay Configuration ---
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

          // 5. Update the database to mark the email as sent
          const { data: updateData, error: updateError } = await supabase
            .from("subscription")
            .update({ reminder_sent: true })
            .eq("id", sub.id);

          if (updateError) {
            console.error(`❌ Error updating reminder_sent status for subscription ${sub.id}:`, updateError);
          } else {
            console.log(`✅ Successfully updated subscription ${sub.id} to 'reminder_sent: true'.`);
          }

          // 6. Add a delay between sends
          console.log(`⏳ Waiting for ${delayInSeconds} seconds before sending the next email...`);
          await new Promise(resolve => setTimeout(resolve, delayInSeconds * 1000));

        } catch (sendError) {
          console.error(`❌ Error sending email to ${sub.user_email}:`, sendError.message || sendError);
        }
      }
      return new Response(`Successfully processed reminders. Sent ${emailsSentToday} emails.`, { status: 200 });
    }
  } catch (err) {
    console.error("❌ Error in reminder script:", err.message || err);
    return new Response(`Error in reminder script: ${err.message}`, { status: 500 });
  }
}