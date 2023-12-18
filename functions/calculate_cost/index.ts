// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
export function calculate_cost(is_delivery_required, box_size, source_city, destination_city, warehouse) {
    let is_final_cost = false;
    if (!is_delivery_required) {
        is_final_cost = true;
    }
    var unit_transfer_price = {
        "Казань": 2500,
        "Коледино": 3500,
        "Тула": 3500,
        "Электросталь": 3500,
        "Шушары": 5500,
        "Краснодар": 4500,
        "Екатеринбург": 4500
    };
    let cost = 100;
    let volume = 0;
    let strings = box_size.split(/\r?\n/);
    for (const my_string of strings){
        let size = my_string.replace(/ /g, "");
        var parts = size.split("-");
        var measurements = parts[0].split("/", 3);
        var amount = parts[1];
        volume += parseFloat(measurements[0]) * parseFloat(measurements[1]) * parseFloat(measurements[2]) * parseFloat(amount) / 1000000;
    }
    if (source_city == 'Самара') {
        cost = 100;
    } else if (source_city == 'Тольятти') {
        cost = 200;
    }
    if (volume <= 0.1) {
        volume = 0.1;
    }
    if (destination_city in unit_transfer_price) {
        cost += volume * unit_transfer_price[destination_city];
    } else if (warehouse in unit_transfer_price) {
        cost += volume * unit_transfer_price[warehouse];
    } else {
        is_final_cost = false;
    }
    if (is_delivery_required) {
        is_final_cost = false;
    }
    let input_error = false;
    volume = Math.round((volume + Number.EPSILON) * 100) / 100;
    cost = Math.round((cost + Number.EPSILON) * 100) / 100;
    return [
        volume,
        cost,
        is_final_cost
    ];
}
export function is_proper_box_size(box_size) {
    const re = /\d+\/\d+\/\d+\s+-\s+\d+/;
    const myArray = box_size.match(re);
    if (myArray != null) {
        return myArray[0];
    }
    return false;
}
