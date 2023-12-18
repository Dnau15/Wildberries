// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
console.log("Hello from Functions!");
serve(async (req)=>{
    const { name  } = await req.json();
    const tableId = '#rec642068219';
    const editCostFormId = '#rec644527229';
    const fields = [
        "tranid",
        "created_at",
        "delivery_date",
        "name",
        "email",
        "phone",
        "legal_entity",
        "source_city",
        "warehouse",
        "destination_city",
        "delivery_type",
        "box_amount",
        "box_size",
        "comments",
        "cost",
        "status",
        "is_final_cost"
    ];
    const optionsList = [
        'Не оплачен',
        'Доставка на склад',
        'Доставлен',
        'Ожидает отправки'
    ];
    const supabase = createClient('https://jgphvtgikirnvxpereju.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpncGh2dGdpa2lybnZ4cGVyZWp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQ1Mjg0MjcsImV4cCI6MjAxMDEwNDQyN30.VByccqlvuvwHuRlo6MMa8GhH4eWSIqWoC2pBU_yuVzQ', {
        auth: {
            persistSession: false
        }
    });
    const { data , error  } = await supabase.from('orders').select(fields.join(',')).csv();
    if (error) {
        console.error(error);
    }
    //create CSV file data in an array
    //create a user-defined function to download CSV file 
    //define the heading for each row of the data
    try {
        console.log(data);
        //display the created CSV data on the web browser 
        return new Response(JSON.stringify(data), {
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
    return new Response(JSON.stringify(json2CSV), {
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
