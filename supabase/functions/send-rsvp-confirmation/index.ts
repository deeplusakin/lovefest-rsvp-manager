
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { guestId, eventId } = await req.json();

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get guest and event details
    const { data: guestData, error: guestError } = await supabaseClient
      .from("guests")
      .select(`
        first_name,
        last_name,
        email,
        events!guest_events (
          event_id,
          is_attending,
          events (
            name,
            date,
            location
          )
        )
      `)
      .eq("id", guestId)
      .single();

    if (guestError || !guestData || !guestData.email) {
      throw new Error("Failed to fetch guest data");
    }

    const event = guestData.events[0]?.events;
    const isAttending = guestData.events[0]?.is_attending;

    if (!event) {
      throw new Error("Failed to fetch event data");
    }

    // Send confirmation email
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: "Wedding RSVP <rsvp@resend.dev>",
      to: guestData.email,
      subject: `RSVP Confirmation - ${event.name}`,
      html: `
        <h1>RSVP Confirmation</h1>
        <p>Dear ${guestData.first_name},</p>
        <p>Thank you for your RSVP to ${event.name}.</p>
        <p>You have indicated that you ${isAttending ? "will" : "will not"} be attending.</p>
        ${isAttending ? `
          <h2>Event Details:</h2>
          <p>Date: ${new Date(event.date).toLocaleDateString()}</p>
          <p>Location: ${event.location}</p>
        ` : ""}
        <p>If you need to make any changes to your RSVP, please use your invitation code to access the website.</p>
      `,
    });

    if (emailError) {
      throw emailError;
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
