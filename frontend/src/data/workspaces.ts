import type { WorkspaceData } from '../types/workspace';

export const workspacesData: WorkspaceData[] = [
  {
    id: "1",
    name: "Q3 Pricing Review",
    scenario: "Financial Strategy",
    documents: 3,
    updated: "2 hours ago",
    status: "Not Started",
    priority: "Medium",
    aiConfidence: 94,
    nextBestAction: {
      title: "Finish Pricing Approval",
      owner: "Bala",
      due: "Tomorrow",
      reason: "Pricing review meeting tomorrow",
      whyDescription: "Based on the latest financial documents uploaded, there is a discrepancy in Q3 projections. Addressing this risk early minimizes potential downstream delays."
    },
    timeline: [
      { label: 'Workspace Created', completed: true },
      { label: 'Documents Uploaded', completed: true },
      { label: 'Analysis Pending', completed: false },
      { label: 'Action Items Generated', completed: false },
      { label: 'Awaiting Approval', completed: false },
    ],
    decisionBrief: [
      { title: 'Overall Summary', content: 'Provide a high-level overview of the Q3 pricing analysis and main takeaways here.' },
      { title: 'Business Impact', content: 'Describe how these pricing changes will affect revenue, customer retention, and market positioning.' },
      { title: 'Key Decisions', content: 'List the finalized decisions that need to be made during this review.' },
      { title: 'Open Questions', content: 'Detail any unresolved issues or missing data required for the final sign-off.' },
      { title: 'Recommendations', content: 'Outline the AI-generated recommended actions based on the uploaded documents.' },
    ],
    actionItems: [
      { id: "a1", status: "Draft", task: "Finish Pricing Approval", owner: "Bala", due: "Tomorrow", source: "Transcript" },
      { id: "a2", status: "Draft", task: "Update Budget", owner: "Finance", due: "Friday", source: "Budget" }
    ],
    risks: [
      { id: "r1", risk: "Potential budget overrun in Q4", impact: "High", mitigation: "Reallocate marketing funds and delay non-critical hires." },
      { id: "r2", risk: "Resource constraints in engineering team", impact: "Medium", mitigation: "Prioritize core features; consider short-term contractors." }
    ],
    generatedContent: {
      draftEmail: "Hi Team,\n\nFollowing our Q3 Pricing Review, please note that we need to finalize the pricing approval by tomorrow. Finance is also tasked with updating the budget by Friday.\n\nBest,\nBala",
      draftWorkItem: {
        title: "Finalize Q3 Pricing Adjustments",
        description: "Review and approve the latest pricing model proposed during the Q3 planning session.",
        priority: "High"
      }
    }
  },
  {
    id: "2",
    name: "Vendor Negotiation",
    scenario: "Procurement",
    documents: 5,
    updated: "Yesterday",
    status: "Analysis Complete",
    priority: "High",
    aiConfidence: 87,
    nextBestAction: {
      title: "Review ACME Corp Contract",
      owner: "Legal Team",
      due: "Today",
      reason: "Missing liability clause detected",
      whyDescription: "The uploaded vendor contract for ACME Corp is missing the standard indemnification clause required by our legal department."
    },
    timeline: [
      { label: 'Workspace Created', completed: true },
      { label: 'Documents Uploaded', completed: true },
      { label: 'Analysis Pending', completed: true },
      { label: 'Action Items Generated', completed: true },
      { label: 'Awaiting Approval', completed: false },
    ],
    decisionBrief: [
      { title: 'Overall Summary', content: 'Analysis of the ACME Corp vendor contract reveals standard terms with a few critical omissions.' },
      { title: 'Business Impact', content: 'Proceeding without standard liability clauses exposes the company to unnecessary financial risk.' },
      { title: 'Key Decisions', content: 'Decide whether to renegotiate terms or accept the current risk profile.' },
      { title: 'Open Questions', content: 'Is ACME Corp willing to adopt our standard MSA?' },
      { title: 'Recommendations', content: 'Halt signing until the indemnification clause is fully incorporated.' },
    ],
    actionItems: [
      { id: "a3", status: "To Do", task: "Send redlines to ACME", owner: "Legal", due: "Today", source: "Contract Analysis" },
      { id: "a4", status: "In Progress", task: "Schedule negotiation sync", owner: "Bala", due: "Wednesday", source: "Email Thread" }
    ],
    risks: [
      { id: "r3", risk: "Missing indemnification clause", impact: "High", mitigation: "Provide ACME with our standard MSA addendum." },
      { id: "r4", risk: "Delayed procurement timeline", impact: "Low", mitigation: "Fast-track legal review once new terms are submitted." }
    ],
    generatedContent: {
      draftEmail: "Hi ACME Team,\n\nWe have reviewed the latest contract draft. Please find our redlines attached, specifically addressing the missing indemnification clause.\n\nThanks,\nBala",
      draftWorkItem: {
        title: "ACME Contract Redlines",
        description: "Send standard MSA addendum to ACME Corp for their review.",
        priority: "High"
      }
    }
  },
  {
    id: "3",
    name: "Product Launch",
    scenario: "Marketing & Sales",
    documents: 2,
    updated: "3 days ago",
    status: "In Progress",
    priority: "High",
    aiConfidence: 91,
    nextBestAction: {
      title: "Finalize Marketing Assets",
      owner: "Marketing",
      due: "Next Monday",
      reason: "Launch date approaching",
      whyDescription: "All core messaging must be locked in before we can brief the PR agency next Tuesday."
    },
    timeline: [
      { label: 'Workspace Created', completed: true },
      { label: 'Documents Uploaded', completed: true },
      { label: 'Analysis Pending', completed: true },
      { label: 'Action Items Generated', completed: false },
      { label: 'Awaiting Approval', completed: false },
    ],
    decisionBrief: [
      { title: 'Overall Summary', content: 'The upcoming product launch requires alignment across sales, marketing, and engineering.' },
      { title: 'Business Impact', content: 'A successful launch is projected to increase Q4 revenue by 20%.' },
      { title: 'Key Decisions', content: 'Approve the final marketing budget and PR messaging.' },
      { title: 'Open Questions', content: 'Will engineering meet the code freeze deadline?' },
      { title: 'Recommendations', content: 'Increase ad spend allocation by 10% for the first two weeks.' },
    ],
    actionItems: [
      { id: "a5", status: "Draft", task: "Draft PR Briefing", owner: "Marketing", due: "Next Tuesday", source: "Launch Plan" },
    ],
    risks: [
      { id: "r5", risk: "Engineering delay", impact: "High", mitigation: "Implement feature flags to allow a soft launch if needed." },
    ],
    generatedContent: {
      draftEmail: "Hi PR Team,\n\nPlease see the attached product messaging guide for our upcoming launch. Let's sync on Tuesday to finalize the strategy.\n\nBest,\nBala",
      draftWorkItem: {
        title: "PR Briefing Document",
        description: "Finalize the PR briefing document based on the latest messaging guide.",
        priority: "Medium"
      }
    }
  }
];
