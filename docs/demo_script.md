# OrchestrAI: 5-Minute Demo Script

---

## 1. Intro & Problem (0:00 - 1:00)
> **Action**: Open the application at `http://localhost:5173/` (Dashboard). Hover over the KPI cards.

* **Speaker**:
  > "Hello judges. Imagine you're an operations lead preparing for an executive pricing sync. You have to comb through a 15-page meeting transcript, cross-reference it with a complex pricing spreadsheet, and check it against the latest budget forecast. That process takes hours. It causes decision delays and runs the risk of missing critical compliance details.
  > 
  > This is **OrchestrAI**, an enterprise Decision Intelligence platform designed to bridge the gap between documents, AI-driven recommendations, and auditable action execution."

---

## 2. Dashboard Overview (1:00 - 1:45)
> **Action**: Point to the calculated KPI cards (Total Workspaces, Analyzed, Executed Actions, Critical Risks).

* **Speaker**:
  > "When you log in, the main dashboard provides a birds-eye view of your operations. Every single card here is dynamically calculated from our workspaces. You can see we have 3 total workspaces, all pre-seeded for realistic demo scenarios. We also track 'Executed Actions' and 'Recent Activity' to maintain a complete auditable history of what tasks have been completed."

---

## 3. Deep-Dive: Q3 Pricing Review (1:45 - 3:00)
> **Action**: Click on the **Q3 Pricing Review** workspace card. Point to the documents list.

* **Speaker**:
  > "Let's click into our **Q3 Pricing Review** workspace. Here, we see three uploaded files. If we click a file, we can preview the extracted text directly in the browser.
  >
  > Below, we have our **Next Best Action** card: 'Finish Pricing Approval'. But as an operations lead, you shouldn't just trust a black-box AI recommendation. That's why we built the **Why? Explainability Panel**."
  
> **Action**: Click the **Why?** button. Scroll down to show the expanded panel.

* **Speaker**:
  > "By clicking 'Why?', OrchestrAI displays the underlying explainability structure. Under 'Evidence', we see direct quote highlights extracted directly from our documents—like Sarah warning about the margin reduction, and the proposal details. This ensures zero-trust auditability. We also show a 94% confidence indicator."

---

## 4. Executive Briefing & Action Execution (3:00 - 4:15)
> **Action**: Click the **AI Briefing** button in the header.

* **Speaker**:
  > "Before your meeting starts, you can click **AI Briefing** in the header. This generates a 30-second executive summary, talking points, risks, and follow-up questions from the existing analysis without initiating a redundant, costly API call.
  >
  > Once you're aligned, it's time to act."

> **Action**: Close the briefing modal, and click **Execute Action** in the Next Best Action card.

* **Speaker**:
  > "Clicking 'Execute Action' launches our human-in-the-loop review dialog. Here, we can inspect the task owner, due date, priority, and estimated business impact before signing off. Let's click **Approve & Execute**."

> **Action**: Click **Approve & Execute**. Wait for the spinner to finish, showing the success card.

* **Speaker**:
  > "The system creates a work item, generates a unique reference code, and displays the completed status. We also get an instant toast notification in the corner."

---

## 5. Dashboard Closed-Loop Synced (4:15 - 5:00)
> **Action**: Click **Done**. Point to the updated Next Best Action card (showing Completed status) and the Timeline (showing stages 5 & 6 completed).

* **Speaker**:
  > "Notice how the page updates instantly. The Next Best Action card now reflects the completed status, and the progress timeline shows all 6 stages are green.
  > 
  > Let's go back to the main Dashboard."

> **Action**: Click **Dashboard** in the sidebar.

* **Speaker**:
  > "Without reloading the page, our Dashboard has synchronized. 'Executed Actions' is now 1, and our 'Recent Activity' feed displays the newly created Work Item reference.
  >
  > Even if we disconnect from the internet or hit a rate limit, OrchestrAI's **Demo Mode** will automatically catch the exception and fall back to cached local scenario analyses—guaranteeing our demo is bulletproof.
  >
  > Thank you!"
