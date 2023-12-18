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
// export const corsHeaders = {
//   'Access-Control-Allow-Origin': 'https://ivlev-ff.ru',
//   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
// }
serve(async (req)=>{
    // if (req.method === 'OPTIONS') {
    //   return new Response('ok', { headers: corsHeaders })
    // }
    const { ma_email , ma_name , tranid , legal_entity , comments , box_amount , box_size , phone , delivery_type , delivery_date , source_city , warehouse , destination_city  } = await req.json();
    try {
        const [day, month, year] = delivery_date.split('.');
        const delivery_date_converted = month + '.' + day + '.' + year;
        let input_error = false;
        let is_final_cost = false;
        let volume;
        let cost;
        let is_delivery_required = false;
        if (!is_proper_box_size(box_size)) {
            input_error = true;
            volume = "Ошибка ввода";
            cost = "Ошибка ввода";
        } else {
            [volume, cost, is_final_cost] = calculate_cost(is_delivery_required, box_size, source_city, destination_city, warehouse);
        }
        const { error  } = await supabase.from("orders").insert({
            email: ma_email,
            name: ma_name,
            legal_entity: legal_entity,
            phone: phone,
            box_amount: box_amount,
            box_size: box_size,
            delivery_type: delivery_type,
            source_city: source_city,
            warehouse: warehouse,
            comments: comments,
            destination_city: destination_city,
            delivery_date: delivery_date_converted,
            is_final_cost: is_final_cost,
            volume: volume,
            cost: cost,
            tranid: tranid,
            input_error: input_error,
            is_delivery_required: is_delivery_required
        });
        // const data = {
        //   comments:comments,
        //   price:cost,
        //   is_final_cost: is_final_cost,
        //   box_size: box_size,
        //   volume: volume,
        //   error: error,
        //   is_delivery_required: is_delivery_required,
        //   input_error: input_error
        // }
        return new Response(JSON.stringify(error), {
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({
            error: error.message
        }), {
            headers: {
                'Content-Type': 'application/json'
            },
            status: 400
        });
    }
}) // To invoke:
 // curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
 //   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
 //   --header 'Content-Type: application/json' \
 //   --data '{"name":"Functions"}'
;
