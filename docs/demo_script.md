# OrchestrAI: 5-Minute Demo Script

---

## 1. Intro & Problem (0:00 - 1:00)
> **Action**: Open the application at `http://localhost:5173/` (Dashboard). Hover over the KPI cards.

* **Speaker**:
  > "OrchestrAI transforms fragmented enterprise information into explainable, auditable, and actionable business decisions powered by Google Gemini.
  > 
  > Hello judges. Imagine you are an operations lead preparing for an executive pricing sync. You have to comb through a 15-page meeting transcript, cross-reference it with a complex SaaS pricing model, and check it against the latest budget forecast. That process takes hours. It causes decision latency, runs the risk of missing critical compliance details, and leaves no auditable connection between your decision and the source files that justified it.
  > 
  > OrchestrAI solves this by providing a unified decision loop that parses documents, reasons through business risks, grounds recommendations in source evidence, and supports human-in-the-loop execution."

---

## 2. Dashboard Overview (1:00 - 1:45)
> **Action**: Point to the dynamic KPI cards (Total Workspaces, Analyzed, Executed Actions, Critical Risks).

* **Speaker**:
  > "When you log in, the main dashboard provides a birds-eye view of your enterprise operations. Every card here is dynamically calculated from our workspaces. You can see we have 3 total workspaces, all pre-seeded for realistic demo scenarios. We also track 'Executed Actions'—currently at 0—and 'Recent Activity' to maintain a complete audit history of completed tasks."

---

## 3. Workspace Deep-Dive & Preview Documents (1:45 - 2:30)
> **Action**: Click on the **Q3 Pricing Review** workspace card. Point to the documents list under "Files".

* **Speaker**:
  > "Let's click into our **Q3 Pricing Review** workspace. Here, we see three uploaded documents: a budget forecast, a pricing proposal, and a meeting transcript. If we click a file like `meeting_transcript.txt`, we can preview the parsed text directly in the browser. This enterprise parser extracts text from PDFs, Excel spreadsheets, and plain text files automatically."

---

## 4. AI Analysis & Why? Explainability (2:30 - 3:30)
> **Action**: Point to the calculated confidence score (94%) and the tabs. Then click the **Why?** button on the Next Best Action card.

* **Speaker**:
  > "OrchestrAI has already run its analysis on these documents. If we wanted to re-trigger it, we could click 'Analyze Workspace' in the top right. Here, we see our Next Best Action: 'Finish Pricing Approval'. But as an operations lead, you shouldn't just trust a black-box AI recommendation. That's why we built the **Why? Explainability Panel**.
  > 
  > When I click 'Why?', OrchestrAI displays the underlying explainability structure. Under 'Evidence', we see direct quote highlights extracted directly from our documents—like Sarah warning about the margin reduction, and the pricing proposal tier adjustments. This ensures zero-trust auditability without incurring any extra LLM costs, as the quotes are cached during the initial analysis phase."

---

## 5. Executive Briefing (3:30 - 4:00)
> **Action**: Click the **AI Briefing** button in the header.

* **Speaker**:
  > "Before your alignment meeting starts, you can click **AI Briefing** in the header. This generates a 30-second executive summary, talking points, risks, and follow-up questions from the existing analysis instantly. This provides a clear verbal digest for operations teams without reading through tabs."

---

## 6. Execute Action (4:00 - 4:45)
> **Action**: Close the briefing modal, and click **Execute Action** on the Next Best Action card.

* **Speaker**:
  > "Once you are aligned, it's time to act. Clicking 'Execute Action' launches our human-in-the-loop review dialog. Here, we can inspect the task owner, due date, priority, and estimated business impact before signing off. I'll click **Approve & Execute**."

> **Action**: Click **Approve & Execute**. Wait for the spinner to finish, showing the success card with a reference number like `WI-2026-XXXX`.

* **Speaker**:
  > "The system creates a work item, generates a unique reference code, and displays the completed status. We also get an instant toast notification in the corner."

---

## 7. Closed-Loop Synced Updates (4:45 - 5:00)
> **Action**: Click **Done**. Point to the updated Next Best Action card (showing Completed status) and the Timeline (showing stages 5 & 6 completed). Then click **Dashboard** in the sidebar.

* **Speaker**:
  > "Notice how the workspace updates instantly. The Next Best Action card now reflects the completed status, and the progress timeline shows all stages are green.
  > 
  > Now, let's go back to the main Dashboard. Without reloading the page, our Dashboard has synchronized. 'Executed Actions' is now 1, and our 'Recent Activity' feed displays the newly created Work Item reference.
  > 
  > Even if we disconnect from the internet or hit a rate limit, OrchestrAI's **Demo Mode** will automatically catch the exception and fall back to cached local scenario analyses—guaranteeing our demo is bulletproof.
  > 
  > Thank you!"
