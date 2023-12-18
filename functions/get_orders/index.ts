// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const supabase = createClient('https://jgphvtgikirnvxpereju.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpncGh2dGdpa2lybnZ4cGVyZWp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQ1Mjg0MjcsImV4cCI6MjAxMDEwNDQyN30.VByccqlvuvwHuRlo6MMa8GhH4eWSIqWoC2pBU_yuVzQ', {
    auth: {
        persistSession: false
    }
});
export const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
serve(async (req)=>{
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: corsHeaders
        });
    }
    const { tranid , email  } = await req.json();
    const { data , error  } = await supabase.from('orders').select(`
    tranid,
    source_city,
    destination_city,
    delivery_date,
    warehouse,
    box_amount,
    box_size,
    status,
    cost,
    volume,
    is_final_cost,
    changeable,
    legal_entity
  `).eq('email', email).neq('status', 'Доставлен');
    return new Response(JSON.stringify(data), {
        headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
        },
        status: 200
    });
}) // To invoke:
 // curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
 //   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
 //   --header 'Content-Type: application/json' \
 //   --data '{"name":"Functions"}'
;
