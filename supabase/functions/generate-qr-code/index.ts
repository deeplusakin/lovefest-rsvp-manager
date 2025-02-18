
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import QRCode from "npm:qrcode@1.5.3";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { guestId } = await req.json();

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch guest's invitation code
    const { data: guest, error: guestError } = await supabaseClient
      .from('guests')
      .select('invitation_code')
      .eq('id', guestId)
      .single();

    if (guestError || !guest) {
      throw new Error('Guest not found');
    }

    // Generate QR code for the RSVP URL
    const rsvpUrl = `${req.headers.get('origin')}/rsvp?code=${guest.invitation_code}`;
    const qrCode = await QRCode.toDataURL(rsvpUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });

    return new Response(
      JSON.stringify({ qrCode, rsvpUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
