// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import { calculate_cost, is_proper_box_size } from '../calculate_cost/index.ts';
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const supabase = createClient('https://jgphvtgikirnvxpereju.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpncGh2dGdpa2lybnZ4cGVyZWp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQ1Mjg0MjcsImV4cCI6MjAxMDEwNDQyN30.VByccqlvuvwHuRlo6MMa8GhH4eWSIqWoC2pBU_yuVzQ', {
    auth: {
        persistSession: false
    }
});
serve(async (req)=>{
    const { tranid , tranid_upd , box_size , box_amount  } = await req.json();
    const { data , error1  } = await supabase.from('orders').select(`
    is_final_cost,
    source_city,
    destination_city,
    warehouse,
    is_delivery_required
  `).eq('tranid', tranid_upd);
    const { source_city , destination_city , warehouse , is_delivery_required  } = data[0];
    let input_error = false;
    let is_final_cost = false;
    let volume;
    let cost;
    if (!is_proper_box_size(box_size)) {
        input_error = true;
        volume = 0;
        cost = 0;
    } else {
        [volume, cost, is_final_cost] = calculate_cost(is_delivery_required, box_size, source_city, destination_city, warehouse);
    }
    const { error  } = await supabase.from('orders').update({
        box_size: box_size,
        box_amount: box_amount,
        volume: volume,
        cost: cost,
        input_error: input_error
    }).eq('tranid', tranid_upd);
    return new Response(JSON.stringify(tranid), {
        headers: {
            "Content-Type": "application/json"
        }
    });
}) // To invoke:
 // curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
 //   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
 //   --header 'Content-Type: application/json' \
 //   --data '{"name":"Functions"}'
;
