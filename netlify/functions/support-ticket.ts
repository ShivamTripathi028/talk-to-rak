// talk-to-rak/netlify/functions/support-ticket.ts

import type {
  Handler,
  HandlerEvent,
  HandlerContext,
  HandlerResponse,
} from "@netlify/functions";
import axios from "axios";
import { PROBLEM_TYPES, URGENCY_LEVELS } from '../../src/constants/supportForm';

/**
 * Interface defining the expected structure of the incoming request body.
 * Matches the fields sent from the final context state, including 'hasAttachments'.
 */
interface SupportPayload {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  deviceModel?: string;
  serialNumber?: string; // EUI
  firmwareVersion?: string;
  problemType?: string;
  issueDescription: string;
  errorMessage?: string;
  stepsToReproduce?: string;
  previousTicketId?: string;
  supportMethod?: string; // Kept if still needed for display/routing logic later
  urgencyLevel?: string;
  // Flag derived from frontend check of attachments array
  hasAttachments?: boolean;
}

type ResponseHeaders = { [header: string]: string | number | boolean };

const commonHeaders: ResponseHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*", // Be more specific in production
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const methodNotAllowedHeaders: ResponseHeaders = {
  ...commonHeaders,
  Allow: "POST, OPTIONS",
};

/**
 * Helper function to safely retrieve environment variables.
 * Checks for direct process.env variable first, then falls back to VITE_ prefixed one.
 */
const getEnvVariable = (name: string, viteName?: string): string => {
  const directValue = process.env[name];
  const viteValue = viteName ? process.env[viteName] : undefined;
  const value = directValue ?? viteValue; // Use direct value first, fallback to VITE_ prefixed

  if (!value) {
    const missingVar = name + (viteName ? ` or ${viteName}` : '');
    console.error(`Configuration Error: Missing environment variable ${missingVar}.`);
    throw new Error(`Configuration error: Environment variable ${missingVar} is not set.`);
  }
  return value;
};

/**
 * Formats the support data into an HTML string for the Zendesk ticket body.
 */
const formatTicketBody = (data: SupportPayload): string => {
  // Ensure maps handle potential undefined keys gracefully
  const problemTypeMap: Record<string, string> = { connectivity: "Connectivity Issues", installation: "Installation Problems", configuration: "Configuration Help", hardware: "Hardware Malfunction", software: "Software/Firmware Issues", other: "Other Issue" };
  const urgencyLevelMap: Record<string, string> = { low: "Low", medium: "Medium", high: "High" };

  // Section for mentioning attachments
  let attachmentInfo = '';
  if (data.hasAttachments) { // Check the boolean flag
    attachmentInfo += '<hr>\n<h3>File Attachments</h3>\n<p><strong>Note:</strong> User indicated one or more files were attached via the form.</p>\n';
    attachmentInfo += '<p><em>(Actual files are not included here. Please request them from the user if needed.)</em></p>';
  }

  // Section for previous ticket ID
  let previousTicketInfo = '';
  if (data.previousTicketId && data.previousTicketId.trim() !== '') { // Check if ID has content
      previousTicketInfo = `<tr><td style="width: 30%; font-weight: bold;">Related Ticket ID</td><td>${data.previousTicketId.trim()}</td></tr>`;
  }

  return `
    <h2>RAKwireless Support Request</h2>
    <p>Submitted via the RAK Help Hub Support Form.</p>
    <hr>
    <h3>Client Information</h3>
    <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; font-family: sans-serif; font-size: 14px; width: 100%;">
     <tbody>
        <tr><td style="width: 30%; font-weight: bold;">Name</td><td>${data.name || "N/A"}</td></tr>
        <tr><td style="font-weight: bold;">Email</td><td>${data.email || "N/A"}</td></tr>
        <tr><td style="font-weight: bold;">Company</td><td>${data.company || "N/A"}</td></tr>
        <tr><td style="font-weight: bold;">Phone</td><td>${data.phone || "N/A"}</td></tr>
     </tbody>
    </table>

    <h3>Device Information</h3>
    <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; font-family: sans-serif; font-size: 14px; width: 100%;">
     <tbody>
        <tr><td style="width: 30%; font-weight: bold;">Device Model</td><td>${data.deviceModel || "N/A"}</td></tr>
        <tr><td style="font-weight: bold;">Device EUI/Serial</td><td>${data.serialNumber || "Not Provided"}</td></tr>
        <tr><td style="font-weight: bold;">Firmware Version</td><td>${data.firmwareVersion || "N/A"}</td></tr>
     </tbody>
    </table>

    <h3>Issue Details</h3>
    <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; font-family: sans-serif; font-size: 14px; width: 100%;">
      <tbody>
        <tr><td style="width: 30%; font-weight: bold;">Problem Type</td><td>${problemTypeMap[data.problemType || ""] || data.problemType || "N/A"}</td></tr>
        <tr><td style="font-weight: bold;">Urgency</td><td>${urgencyLevelMap[data.urgencyLevel || ""] || data.urgencyLevel || "N/A"}</td></tr>
        ${previousTicketInfo} {/* Insert Previous Ticket Info row */}
      </tbody>
    </table>

    <p style="margin-top: 10px;"><strong>Issue Description:</strong></p>
    <div style="border: 1px solid #ccc; padding: 10px; background-color: #f9f9f9; font-family: sans-serif; font-size: 14px; white-space: pre-wrap;">${data.issueDescription ? data.issueDescription.trim() : "<em>No description provided.</em>"}</div>

    ${data.errorMessage && data.errorMessage.trim() ? `
      <p style="margin-top: 10px;"><strong>Error Message:</strong></p>
      <div style="border: 1px solid #ccc; padding: 10px; background-color: #f9f9f9; font-family: monospace; font-size: 13px; white-space: pre-wrap;">${data.errorMessage.trim()}</div>`
    : ""}

    ${data.stepsToReproduce && data.stepsToReproduce.trim() ? `
      <p style="margin-top: 10px;"><strong>Steps to Reproduce:</strong></p>
      <div style="border: 1px solid #ccc; padding: 10px; background-color: #f9f9f9; font-family: sans-serif; font-size: 14px; white-space: pre-wrap;">${data.stepsToReproduce.trim()}</div>`
    : ""}

    ${attachmentInfo} {/* Insert attachment note */}
    <hr>
    <p><em>Timestamp: ${new Date().toUTCString()}</em></p>
  `;
};


const handler: Handler = async (event: HandlerEvent, context: HandlerContext): Promise<HandlerResponse> => {

  // Handle CORS preflight requests
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: commonHeaders, body: "" };
  }

  // Check method
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ success: false, message: "Method Not Allowed." }), headers: methodNotAllowedHeaders };
  }

  // Parse body
  let payload: SupportPayload;
  try {
    if (!event.body) throw new Error("Missing request body");
    payload = JSON.parse(event.body); // Already contains hasAttachments flag from context
  } catch (error: any) {
    console.error("Error parsing JSON body:", error.message);
    return { statusCode: 400, body: JSON.stringify({ success: false, message: "Invalid request body." }), headers: commonHeaders };
  }

  // Basic Validation
  if (!payload.name || !payload.email || !payload.issueDescription || !payload.problemType || !payload.urgencyLevel) {
    const missing = [
        !payload.name && 'name',
        !payload.email && 'email',
        !payload.issueDescription && 'issueDescription',
        !payload.problemType && 'problemType',
        !payload.urgencyLevel && 'urgencyLevel'
    ].filter(Boolean).join(', ');
    console.warn(`Validation Error: Missing required fields: ${missing}`);
    return { statusCode: 400, body: JSON.stringify({ success: false, message: `Missing required fields: ${missing}.` }), headers: commonHeaders };
  }

  // Get Zendesk Credentials
  let zendeskSubdomain: string, zendeskApiToken: string, zendeskUserEmail: string, zendeskTechSupportGroupId: string;
   try {
    // Use the NON-PREFIXED name first, then the VITE_ prefixed one as fallback
    zendeskSubdomain = getEnvVariable("ZENDESK_SUBDOMAIN", "VITE_ZENDESK_SUBDOMAIN");
    zendeskApiToken = getEnvVariable("ZENDESK_API_TOKEN", "VITE_ZENDESK_API_TOKEN");
    zendeskUserEmail = getEnvVariable("ZENDESK_USER_EMAIL", "VITE_ZENDESK_USER_EMAIL");
    zendeskTechSupportGroupId = getEnvVariable("ZENDESK_TECH_SUPPORT_GROUP_ID", "VITE_ZENDESK_TECH_SUPPORT_GROUP_ID");
  } catch (error: any) {
     console.error("Internal Configuration Error:", error.message);
     return { statusCode: 500, body: JSON.stringify({ success: false, message: "Internal server configuration error." }), headers: commonHeaders };
  }

  const zendeskApiUrl = `https://${zendeskSubdomain}.zendesk.com/api/v2/tickets.json`;
  const ticketSubject = `Support: ${payload.deviceModel || 'General'} - ${payload.problemType ? PROBLEM_TYPES[payload.problemType] : 'Issue'} from ${payload.name}`;
  const ticketBody = formatTicketBody(payload); // Includes attachment note and previous ID now

  const zendeskTicketData = {
    ticket: {
      subject: ticketSubject,
      comment: { html_body: ticketBody },
      requester: { name: payload.name, email: payload.email, verified: true },
      group_id: parseInt(zendeskTechSupportGroupId, 10),
      tags: ['TTR-tech-support', 'website_support_form', `device_${payload.deviceModel?.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'unknown'}`], // Add device tag
      priority: payload.urgencyLevel === 'high' ? 'high'
               : payload.urgencyLevel === 'medium' ? 'normal'
               : 'low',
      // Add custom fields if configured in Zendesk
      // custom_fields: [ { id: 12345, value: payload.serialNumber } ],
    },
  };

  // Make API Call
  try {
      const authToken = Buffer.from(`${zendeskUserEmail}/token:${zendeskApiToken}`).toString("base64");
      console.log(`INFO (Support): Sending request to Zendesk API: ${zendeskApiUrl} for group ${zendeskTechSupportGroupId}`);
      const response = await axios.post(zendeskApiUrl, zendeskTicketData, {
        headers: { "Content-Type": "application/json", Authorization: `Basic ${authToken}` },
        timeout: 15000 // 15 seconds timeout
      });

      // Handle Success
      const createdTicketId = response.data?.ticket?.id;
      console.log(`SUCCESS (Support): Created Zendesk ticket ID: ${createdTicketId}`);
      return {
        statusCode: 201,
        body: JSON.stringify({ success: true, message: "Support request submitted successfully!", ticketId: createdTicketId || null }),
        headers: commonHeaders,
      };

    } catch (error: any) {
        // Handle Zendesk API Error
         console.error("ERROR (Support): Failed to create Zendesk ticket.");
        if (axios.isAxiosError(error)) {
             const status = error.response?.status || 500;
             console.error(`Zendesk API Error - Status: ${status}`, JSON.stringify(error.response?.data || error.message, null, 2));
             let userMessage = "Failed to submit support request due to a server error.";
             if (status === 401 || status === 403) userMessage = "Authentication failed with support system. Please contact administrator.";
             else if (status === 422) userMessage = `Invalid data sent to support system: ${error.response?.data?.description || 'Validation error'}`;
             else if (status === 429) userMessage = "Rate limit exceeded contacting support system. Please try again later.";
             else if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') userMessage = "Request to support system timed out. Please try again.";
             else userMessage = `Failed to communicate with support system (Status: ${status}).`;

            return {
                statusCode: status >= 500 ? 500 : status, // Return specific error code if useful
                body: JSON.stringify({ success: false, message: userMessage }),
                headers: commonHeaders,
            };
        } else {
           console.error("Unexpected error during Zendesk call:", error);
            return {
                statusCode: 500,
                body: JSON.stringify({ success: false, message: "An unexpected error occurred." }),
                headers: commonHeaders,
            };
        }
    }
};

export { handler };