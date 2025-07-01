 💰 MoneyMate

MoneyMate is a modern personal finance tracking web app built with **Next.js 15**, **Supabase**, **Tailwind CSS**, and **Resend**. It helps users manage their income, expenses, investments, and subscriptions in one intuitive dashboard.

**🔗 Live App:** [money-mate-gamma-six.vercel.app](https://money-mate-gamma-six.vercel.app)

---

## 🚀 Features

- ✅ User authentication with Google (via Supabase Auth)
- 📊 Monthly summaries and visual insights (charts via Recharts)
- 🧾 Add/edit/delete income, expenses, and investments
- 📆 Track active subscriptions and upcoming renewals
- 📩 Automated email reminders (using Resend API + Vercel Cron)
- 🌗 Light/Dark mode toggle
- 📱 Fully responsive and mobile-friendly

---

## 🛠️ Tech Stack

- **Frontend:** [Next.js 15](https://nextjs.org/), [React 19](https://react.dev/)
- **Backend-as-a-Service:** [Supabase](https://supabase.io/)
- **UI:** [Tailwind CSS](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/)
- **Charts:** [Recharts](https://recharts.org/)
- **Emailing:** [Resend](https://resend.com/)
- **Deployment:** [Vercel](https://vercel.com/)

---

## 📦 Installation

```bash
# Clone the project (if hosted on GitHub or other repo)
git clone <your-project-link>
cd moneymate

# Install dependencies
npm install

# Create a `.env.local` file
cp .env.example .env.local

# Run the dev server
npm run dev
🔐 Environment Variables
Create a .env.local file with the following variables:

env
Copy
Edit
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_RESEND_KEY=your-resend-api-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
🧪 Testing Google Auth
Make sure your Supabase Auth Site URL is set to:

arduino
Copy
Edit
https://money-mate-gamma-six.vercel.app
And that your Google Cloud Console has:

✅ Authorized redirect URI:

bash
Copy
Edit
https://<your-supabase-project>.supabase.co/auth/v1/callback
✅ Authorized JavaScript origins:

arduino
Copy
Edit
https://money-mate-gamma-six.vercel.app
⏰ Cron Jobs for Email Reminders
MoneyMate uses Vercel Cron Jobs to send subscription expiry reminders.

Check vercel.json:

json
Copy
Edit
{
  "crons": [
    {
      "path": "/api/reminders",
      "schedule": "30 3 * * *"
    }
  ]
}
📸 Screenshots
Coming soon…

📄 License
This project is open-source and available under the MIT License.

👨‍💻 Author
Built with ❤️ by Sayan Mallick

