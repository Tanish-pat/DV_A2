// Define both dictionaries globally
let buildings_per_district = {};
let damage_per_district = {};

async function fetch_data() {
    console.log("Fetching data...");
    try {
        const response = await fetch('csv_building_damage_assessment.csv'); // Ensure the CSV file path is correct
        const csvData = await response.text();

        Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true,
            step: function (row) {
                const district_id = row.data['district_id'];
                const damage_level = row.data['damage_overall_collapse'];

                // Ensure district_id is a string for consistency in dictionary keys
                if (district_id) {
                    // Update buildings_per_district count
                    buildings_per_district[district_id] = (buildings_per_district[district_id] || 0) + 1;

                    // Initialize damage_per_district entry for the district if not present
                    if (!damage_per_district[district_id]) {
                        damage_per_district[district_id] = {
                            'Moderate-Heavy': 0,
                            'Severe-Extreme': 0,
                            'Insignificant/light': 0,
                            'None': 0
                        };
                    }

                    // Update the count based on damage level, treating '' as 'Missing'
                    if (damage_per_district[district_id][damage_level] !== undefined) {
                        damage_per_district[district_id][damage_level]++;
                    }
                }
            },
            complete: function () {
                console.log("Data loading complete");
                console.log("Buildings per district:", buildings_per_district);
                console.log("Damage per district:", damage_per_district);
                showTreeMap();  // Render tree map after data is loaded
            }
        });
    } catch (error) {
        console.error("Error fetching or parsing CSV:", error);
    }
}

function consoleBuildingsPerDistrict() {
    // Check if data is already loaded; if not, load it first
    if (Object.keys(buildings_per_district).length === 0) {
        fetch_data().then(() => {
            console.log("Buildings per district:", buildings_per_district);
        });
    } else {
        console.log("Buildings per district:", buildings_per_district);
    }
}

function consoleDamageTypePerDistrict() {
    // Check if data is already loaded; if not, load it first
    if (Object.keys(damage_per_district).length === 0) {
        fetch_data().then(() => {
            console.log("Damage per district:", damage_per_district);
        });
    } else {
        console.log("Damage per district:", damage_per_district);
    }
}



// Function to create and display the tree map
let currentColorScheme = 'interpolateBlues';  // Default color scheme
let currentLayout = 'squarify';  // Default treemap layout

function updateColorScheme(colorScheme) {
    currentColorScheme = colorScheme;
    showTreeMap();  // Re-render tree map with the new color scheme
}

function updateLayout(layout) {
    currentLayout = layout;
    showTreeMap();  // Re-render tree map with the new layout
}

// Create the tree map data structure based on the selected category
function createTreeMapData(selectedCategory) {
    const treeMapData = {
        name: "Districts",
        children: []
    };

    for (const district_id in damage_per_district) {
        const districtData = {
            name: district_id,
            children: []
        };

        if (selectedCategory === "All") {
            // Include all damage grades for each district
            for (const damage_grade in damage_per_district[district_id]) {
                const value = damage_per_district[district_id][damage_grade];
                if (value > 0) { // Only include grades with a non-zero value
                    districtData.children.push({
                        name: damage_grade,
                        value: value,
                        district_id: district_id
                    });
                }
            }
        } else {
            // Only include the selected grade for each district
            const value = damage_per_district[district_id][selectedCategory];
            if (value > 0) { // Only include districts with a non-zero value for the selected grade
                districtData.children.push({
                    name: selectedCategory,
                    value: value,
                    district_id: district_id
                });
            }
        }

        if (districtData.children.length > 0) {
            treeMapData.children.push(districtData);
        }
    }

    return treeMapData;
}

function showTreeMap() {
    // Get the selected category from the dropdown
    const selectedCategory = document.getElementById('category-select').value;

    const data = createTreeMapData(selectedCategory);

    const width = 1200;
    const height = 600;

    // Map the currentLayout string to the corresponding d3 layout method
    let treemapLayout;
    switch (currentLayout) {
        case 'squarify':
            treemapLayout = d3.treemapSquarify;
            break;
        case 'binary':
            treemapLayout = d3.treemapBinary;
            break;
        case 'slice':
            treemapLayout = d3.treemapSlice;
            break;
        case 'dice':
            treemapLayout = d3.treemapDice;
            break;
        default:
            treemapLayout = d3.treemapSquarify;  // Default to squarify
    }

    const treemap = d3.treemap()
        .size([width, height])
        .padding(1)
        .tile(treemapLayout);  // Apply selected layout type

    const root = d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

    treemap(root);

    // Clear any existing SVG before adding a new one
    d3.select("#tree-map").html("");

    const svg = d3.select("#tree-map").append("svg")
        .attr("width", width)
        .attr("height", height);

    const nodes = svg.selectAll(".node")
        .data(root.leaves())
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.x0},${d.y0})`);

    const colorScale = d3.scaleSequential(d3[currentColorScheme])
        .domain([0, d3.max(root.leaves(), d => d.value)]);  // Apply color scale based on values

    nodes.append("rect")
        .attr("class", "rect")
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .style("fill", d => colorScale(d.value))
        .style("stroke", "black")
        .style("stroke-width", 1);

    nodes.append("text")
        .attr("x", 5)
        .attr("y", 15)
        .style("font-size", "12px")
        .each(function (d) {
            const districtName = d.parent ? d.parent.data.name : "Unknown District";

            d3.select(this).append("tspan")
                .attr("x", 5)
                .attr("dy", "1em")
                .text(`District ${districtName} -`);

            d3.select(this).append("tspan")
                .attr("x", 5)
                .attr("dy", "1em")
                .text(`${d.data.name}`);

            d3.select(this).append("tspan")
                .attr("x", 5)
                .attr("dy", "1em")
                .text(`Collapses: ${d.value}`);
        });

    // Add event listener to show district info in the tooltip
    const tooltip = d3.select("#tooltip");

    svg.selectAll(".node")
        .on("mouseover", function (event, d) {
            d3.select(this).select("rect")
                .style("stroke", "black")
                .style("stroke-width", 2);
            tooltip.style("opacity", 1)
                .html(`District: ${d.data.district_id}<br>Value: ${d.value}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function (event, d) {
            d3.select(this).select("rect")
                .style("stroke", "none");
            tooltip.style("opacity", 0);
        });
}

// Update the tree map whenever the dropdown selection changes
document.getElementById('category-select').addEventListener('change', showTreeMap);

// Initial tree map rendering
showTreeMap();










// Preload data on page load
window.onload = fetch_data;
