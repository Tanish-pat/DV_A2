let damage_per_district = {};
let buildings_per_district = {};

async function fetch_data() {
    console.log("Fetching data...");
    try {
        const response = await fetch('csv_building_structure.csv');
        const csvData = await response.text();

        Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true,
            step: function (row) {
                const district_id = row.data['district_id'];
                const damage_level = row.data['condition_post_eq'];

                if (district_id) {
                    buildings_per_district[district_id] = (buildings_per_district[district_id] || 0) + 1;

                    if (!damage_per_district[district_id]) {
                        damage_per_district[district_id] = {};
                    }

                    damage_per_district[district_id][damage_level || 'Missing'] =
                        (damage_per_district[district_id][damage_level || 'Missing'] || 0) + 1;
                }
            },
            complete: function () {
                console.log("Data loading complete");
                console.log(damage_per_district);
                preparePlotData();  // Create the plot after data is loaded
            }
        });
    } catch (error) {
        console.error("Error fetching or parsing CSV:", error);
    }
}

let currentColorScheme = 'Rainbow';

const useObject = damage_per_district;

function preparePlotData() {
    // Extract districts
    const districts = Object.keys(useObject).map(id => parseInt(id));

    // Extract unique damage types (we can just use the keys from any one district, as all districts will have the same damage types)
    const damageTypes = Object.keys(useObject[districts[0]]); // Use the first district's keys to get the damage types

    // Build the dimensions array
    const dimensions = [
        { label: 'District ID', values: districts },
        ...damageTypes.map(damageType => ({
            label: damageType,
            values: districts.map(id => useObject[id][damageType] || 0) // Use 0 if a specific damage type is not found for a district
        }))
    ];

    console.log(dimensions);

    const trace = {
        type: 'parcoords',
        line: {
            color: districts,
            colorscale: currentColorScheme,
            showscale: true
        },
        dimensions: dimensions
    };

    const layout = {
        title: 'Parallel Coordinate Plot For Condition Post Earthquake',
        width: 1800,
        height: 800,
        paper_bgcolor: 'rgb(243, 243, 243)',
        plot_bgcolor: 'rgb(243, 243, 243)',
        font: { family: 'Arial, sans-serif', size: 18 },
        xaxis: { title: { font: { size: 10 } } },
    };

    Plotly.newPlot('plot', [trace], layout);
}

function updateColorScheme(selectedScheme) {
    currentColorScheme = selectedScheme;
    preparePlotData();
}

function resetPlot() {
    preparePlotData();
}

document.addEventListener('DOMContentLoaded', preparePlotData);

window.onload = fetch_data;
