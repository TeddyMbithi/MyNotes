# Google Analytics Setup Instructions

## Step 1: Create Google Analytics Account

1. Go to [https://analytics.google.com/](https://analytics.google.com/)
2. Sign in with your Google account
3. Click **"Start measuring"**
4. Enter account details:
   - Account name: `MyNotes Portfolio` (or any name)
   - Configure data sharing settings as desired
   - Click **Next**

## Step 2: Create Property

1. Property name: `MyNotes Website`
2. Time zone: Select your timezone
3. Currency: Select your currency
4. Click **Next**

## Step 3: Business Information

1. Industry: Select **"Technology"** or **"Internet & Telecom"**
2. Business size: Select appropriate option
3. How you plan to use Analytics: Select **"Examine user behavior"**
4. Click **Create**

## Step 4: Set Up Data Stream

1. Choose **"Web"**
2. Website URL: `https://TeddyMbithi.github.io`
3. Stream name: `MyNotes Website`
4. Click **"Create stream"**

## Step 5: Get Your Measurement ID

You'll see a **Measurement ID** that looks like: `G-XXXXXXXXXX`

**Example:** `G-ABC123DEF4`

## Step 6: Add the ID to Your Website

1. Open `index.html` in your editor
2. Find these two lines near the top:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   ```
   and
   ```javascript
   gtag('config', 'G-XXXXXXXXXX');
   ```

3. Replace **BOTH** instances of `G-XXXXXXXXXX` with your actual Measurement ID

4. Save the file

5. Commit and push:
   ```bash
   git add index.html
   git commit -m "Add Google Analytics tracking ID"
   git push
   ```

## Step 7: Enable Real-Time Alerts (Optional)

### Email Notifications:
1. In Google Analytics, go to **Admin** (bottom left gear icon)
2. Under **Property**, click **Custom Alerts**
3. Click **"+ New Alert"**
4. Configure:
   - Alert name: `New Visitor Alert`
   - Apply to: All Web Site Data
   - Period: Day
   - Condition: Users > 0
   - Send me an email: Check this box
5. Save

### Mobile App Notifications:
1. Download **Google Analytics** app on your phone
2. Sign in
3. Select your property
4. Enable push notifications in app settings
5. You'll get real-time alerts for visitors!

## Step 8: View Your Data

After setup (wait ~24 hours for full data):
- **Real-time**: See current visitors now
- **Reports** → **Engagement** → **Pages and screens**: Most viewed pages
- **Reports** → **User** → **User attributes**: Country, city, device
- **Reports** → **Acquisition**: How visitors found your site

## Privacy Compliance (Important!)

Add this to your website footer or create a Privacy page:

```
This website uses Google Analytics to understand visitor behavior. 
We collect anonymized data including pages viewed, time spent, and 
geographic location. No personal information is stored.
```

---

**Need help?** Check the [Google Analytics Help Center](https://support.google.com/analytics)
