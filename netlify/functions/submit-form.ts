// talk-to-rak/netlify/functions/submit-form.ts

import type {
  Handler,
  HandlerEvent,
  HandlerContext,
  HandlerResponse,
} from "@netlify/functions";
import axios from "axios";

// Define the expected structure of the incoming request body from InquiryForm.tsx
interface SubmissionPayload {
  clientInfo: {
    name: string;
    email: string;
    company?: string;
    contactNumber?: string; // Was required in the UI step, should be present
  };
  region?: { selected: string; frequencyBand: string };
  deployment?: { environment: string | null };
  application?: { type: string; subtypes: string[]; otherSubtype?: string };
  scale?: string;
  connectivity?: { lorawanType: string | null; options: string[] };
  power?: string[];
  additionalDetails?: string;
}

// Define the expected type for headers to satisfy HandlerResponse
type ResponseHeaders = { [header: string]: string | number | boolean };

// Define common headers
const commonHeaders: ResponseHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*", // Consider restricting in production
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Define headers for Method Not Allowed
const methodNotAllowedHeaders: ResponseHeaders = {
  ...commonHeaders,
  Allow: "POST, OPTIONS", // Allow header is specifically for 405
};

// Helper function to safely get environment variables
// Checks for direct process.env variable first, then falls back to VITE_ prefixed one
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

// The main function Netlify will execute
const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
): Promise<HandlerResponse> => {

  // Handle CORS preflight requests
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: commonHeaders, body: "" };
  }

  // 1. Check if the request method is POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed. Please use POST." }),
      headers: methodNotAllowedHeaders,
    };
  }

  // 2. Parse the incoming JSON data
  let payload: SubmissionPayload;
  try {
    if (!event.body) {
      throw new Error("Missing request body");
    }
    payload = JSON.parse(event.body);
  } catch (error) {
    console.error("Error parsing JSON body:", error);
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Invalid JSON body. Please ensure you are sending valid JSON.",
      }),
      headers: commonHeaders,
    };
  }

  // 3. Validate essential data (name, email) and construct message
  const { name, email } = payload.clientInfo || {};
  if (!name || !email) {
    console.error("Validation Error: Missing required fields: name and email.");
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Missing required fields: 'name' and 'email' are mandatory.",
      }),
      headers: commonHeaders,
    };
  }

  // Construct the HTML message body for Zendesk
  const message = `
    <h2>RAK IoT Requirements Submission</h2>
    <p>Submitted via the RAK Help Hub Inquiry Form.</p>
    <hr>
    <h3>Client Information</h3>
    <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; font-family: sans-serif; font-size: 14px; width: 100%;">
      <tbody>
        <tr><td style="width: 30%; font-weight: bold;">Name</td><td>${name || "N/A"}</td></tr>
        <tr><td style="font-weight: bold;">Email</td><td>${email || "N/A"}</td></tr>
        <tr><td style="font-weight: bold;">Company</td><td>${payload.clientInfo?.company || "N/A"}</td></tr>
        <tr><td style="font-weight: bold;">Contact Number</td><td>${payload.clientInfo?.contactNumber || "N/A"}</td></tr>
      </tbody>
    </table>

    <h3>Deployment Context</h3>
     <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; font-family: sans-serif; font-size: 14px; width: 100%;">
      <tbody>
        <tr><td style="width: 30%; font-weight: bold;">Region</td><td>${payload.region?.selected || "N/A"} (${payload.region?.frequencyBand || "N/A"})</td></tr>
        <tr><td style="font-weight: bold;">Environment</td><td>${payload.deployment?.environment || "N/A"}</td></tr>
        <tr><td style="font-weight: bold;">Scale</td><td>${payload.scale || "N/A"}</td></tr>
      </tbody>
    </table>

    <h3>Application Details</h3>
    <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; font-family: sans-serif; font-size: 14px; width: 100%;">
      <tbody>
        <tr><td style="width: 30%; font-weight: bold;">Type</td><td>${payload.application?.type || "N/A"}</td></tr>
        <tr><td style="font-weight: bold;">Subtypes</td><td>${payload.application?.subtypes?.join(", ") || "N/A"}</td></tr>
        ${payload.application?.otherSubtype && payload.application?.subtypes?.includes("Other")
            ? `<tr><td style="font-weight: bold;">Other Specified</td><td>${payload.application.otherSubtype}</td></tr>`
            : ""}
      </tbody>
    </table>

    <h3>Technical Requirements</h3>
     <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; font-family: sans-serif; font-size: 14px; width: 100%;">
      <tbody>
        <tr><td style="width: 30%; font-weight: bold;">LoRaWAN Network</td><td>${payload.connectivity?.lorawanType || "N/A"}</td></tr>
        <tr><td style="font-weight: bold;">Other Connectivity</td><td>${payload.connectivity?.options?.length ? payload.connectivity.options.join(", ") : "None"}</td></tr>
        <tr><td style="font-weight: bold;">Power Sources</td><td>${payload.power?.length ? payload.power.join(", ") : "N/A"}</td></tr>
      </tbody>
    </table>

    <h3>Additional Details / Message</h3>
    <div style="border: 1px solid #ccc; padding: 10px; margin-top: 5px; background-color: #f9f9f9; font-family: sans-serif; font-size: 14px;">
      <p>${payload.additionalDetails ? payload.additionalDetails.replace(/\n/g, '<br>') : "<em>No additional details provided.</em>"}</p>
    </div>
    <hr>
    <p><em>Timestamp: ${new Date().toUTCString()}</em></p>
  `;


  // 4. Get Zendesk credentials from environment variables
  let zendeskSubdomain, zendeskApiToken, zendeskUserEmail, zendeskSalesGroupId;
  try {
    // Use the NON-PREFIXED name first, then the VITE_ prefixed one as fallback
    zendeskSubdomain = getEnvVariable("ZENDESK_SUBDOMAIN", "VITE_ZENDESK_SUBDOMAIN");
    zendeskApiToken = getEnvVariable("ZENDESK_API_TOKEN", "VITE_ZENDESK_API_TOKEN");
    zendeskUserEmail = getEnvVariable("ZENDESK_USER_EMAIL", "VITE_ZENDESK_USER_EMAIL");
    zendeskSalesGroupId = getEnvVariable("ZENDESK_SALES_GROUP_ID", "VITE_ZENDESK_SALES_GROUP_ID");
  } catch (error: any) {
    console.error("Internal Configuration Error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server configuration error. Please contact support." }),
      headers: commonHeaders,
    };
  }

  // 5. Construct Zendesk API payload
  const zendeskApiUrl = `https://${zendeskSubdomain}.zendesk.com/api/v2/tickets.json`;
  const zendeskTicketData = {
    ticket: {
      subject: `RAK Inquiry: ${payload.application?.type || 'General'} from ${name}`, // More specific subject
      comment: { html_body: message },
      requester: { name: name, email: email, verified: true }, // Assume verified for web form
      group_id: parseInt(zendeskSalesGroupId, 10), // Assign to Sales group
      tags: ["rak_inquiry_form", "sales_lead", "website_inquiry", `region_${payload.region?.selected?.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'unknown'}`], // Add region tag
      priority: "normal", // Default priority
      // custom_fields: [], // Add custom fields if needed
    },
  };

  // 6. Make API call to Zendesk using axios
  try {
    const authToken = Buffer.from(
      `${zendeskUserEmail}/token:${zendeskApiToken}`
    ).toString("base64");
    console.log(`INFO (Inquiry): Sending request to Zendesk API: ${zendeskApiUrl} for group ${zendeskSalesGroupId}`);
    const response = await axios.post(zendeskApiUrl, zendeskTicketData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authToken}`,
      },
      timeout: 15000 // 15 seconds timeout
    });

    // 7. Handle Zendesk success response
    const createdTicketId = response.data?.ticket?.id;
    console.log("SUCCESS (Inquiry): Created Zendesk ticket ID:", createdTicketId);
    return {
      statusCode: 201, // Created
      body: JSON.stringify({
        message: "Your inquiry has been submitted successfully! Our team will be in touch.",
        ticketId: createdTicketId || null // Return ticket ID if available
      }),
      headers: commonHeaders, // Use predefined headers for the response to the client
    };
  } catch (error: any) {
    // 8. Handle Zendesk error response
    console.error("ERROR (Inquiry): Failed to create Zendesk ticket.");
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      console.error(`Zendesk API Error - Status: ${status}`, JSON.stringify(error.response?.data || error.message, null, 2));
      let userMessage = "Failed to submit inquiry due to a server error.";
      if (status === 401 || status === 403) userMessage = "Authentication failed with inquiry system. Please contact administrator.";
      else if (status === 422) userMessage = `Invalid data sent: ${error.response?.data?.description || 'Validation error'}`;
      else if (status === 429) userMessage = "Rate limit exceeded. Please try again later.";
      else if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') userMessage = "Request to inquiry system timed out. Please try again.";
      else userMessage = `Failed to communicate with inquiry system (Status: ${status}).`;

      return {
        statusCode: status >= 500 ? 500 : status, // Return specific error codes if useful
        body: JSON.stringify({ message: userMessage }),
        headers: commonHeaders,
      };
    } else {
      console.error("Unexpected error during Zendesk call:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "An unexpected error occurred while submitting your inquiry." }),
        headers: commonHeaders,
      };
    }
  }
};

// Export the handler function
export { handler };